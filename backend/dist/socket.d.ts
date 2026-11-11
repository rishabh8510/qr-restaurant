import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
export declare function initSocket(httpServer: HttpServer): Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare function getIO(): Server | null;
/** Safe broadcast to admin + staff dashboards */
export declare function emitToStaff(event: string, payload: unknown): void;
export declare function emitToUser(userId: string, event: string, payload: unknown): void;
//# sourceMappingURL=socket.d.ts.map