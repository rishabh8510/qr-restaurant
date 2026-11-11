"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const env_1 = require("./config/env");
const socket_1 = require("./socket");
async function bootstrap() {
    await (0, database_1.connectDatabase)();
    const server = http_1.default.createServer(app_1.default);
    (0, socket_1.initSocket)(server);
    server.listen(env_1.env.PORT, () => {
        console.log(`🚀 Server running on port ${env_1.env.PORT} in ${env_1.env.NODE_ENV} mode`);
        console.log(`📡 WebSocket ready at path /socket.io`);
    });
}
bootstrap().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map