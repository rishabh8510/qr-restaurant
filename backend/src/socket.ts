import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from './utils/tokens';
import { JwtPayload } from './types';

let io: Server | null = null;

function parseCookie(header?: string): Record<string, string> {
  if (!header) return {};
  const out: Record<string, string> = {};
  header.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (key) out[key] = decodeURIComponent(val);
  });
  return out;
}

function extractToken(socket: Socket): string | null {
  // 1) auth payload from client
  const authToken = socket.handshake.auth?.token;
  if (typeof authToken === 'string' && authToken) return authToken;

  // 2) Authorization header
  const authHeader = socket.handshake.headers?.authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // 3) query param
  const q = socket.handshake.query?.token;
  if (typeof q === 'string' && q) return q;

  // 4) httpOnly cookie (admin dashboard uses this)
  const cookies = parseCookie(socket.handshake.headers?.cookie);
  if (cookies.accessToken) return cookies.accessToken;

  return null;
}

export function initSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST'],
    },
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    allowEIO3: true,
  });

  io.use((socket, next) => {
    try {
      const token = extractToken(socket);
      if (!token) {
        return next(new Error('Authentication required'));
      }
      const payload = verifyAccessToken(token) as JwtPayload;
      (socket as any).user = payload;
      next();
    } catch (err) {
      console.warn('[WS] Auth failed:', (err as Error)?.message || err);
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user as JwtPayload;
    if (!user) {
      socket.disconnect(true);
      return;
    }

    console.log(`[WS] Connected: ${user.role} ${user.userId} (${socket.id})`);

    // All staff + admin listen on "staff" room for order events
    if (user.role === 'admin' || user.role === 'staff') {
      socket.join('staff');
      socket.join(user.role);
    } else if (user.role === 'customer') {
      socket.join(`user:${user.userId}`);
    }

    socket.on('disconnect', (reason) => {
      console.log(`[WS] Disconnected: ${user.userId} reason=${reason}`);
    });
  });

  return io;
}

export function getIO(): Server | null {
  return io;
}

/** Safe broadcast to admin + staff dashboards */
export function emitToStaff(event: string, payload: unknown) {
  if (!io) {
    console.warn(`[WS] skip emit ${event}: socket not ready`);
    return;
  }
  // Single room — both admin and staff join "staff"
  io.to('staff').emit(event, payload);
}

export function emitToUser(userId: string, event: string, payload: unknown) {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
}
