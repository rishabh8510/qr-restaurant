import http from 'http';
import app from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import { initSocket } from './socket';

async function bootstrap() {
  await connectDatabase();

  const server = http.createServer(app);
  initSocket(server);

  server.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    console.log(`📡 WebSocket ready at path /socket.io`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
