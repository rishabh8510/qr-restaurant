// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import cookieParser from 'cookie-parser';
// import path from 'path';
// import { env, getAllowedOrigins } from './config/env';
// import { globalLimiter } from './middlewares/rateLimiter';
// import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
// import routes from './routes';

// const app = express();
// const allowedOrigins = getAllowedOrigins();

// app.use(helmet({
//   crossOriginResourcePolicy: { policy: 'cross-origin' },
// }));

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow non-browser / same-origin and configured fronts
//       if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
//         callback(null, true);
//         return;
//       }
//       // Dev-friendly: allow localhost any port
//       if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
//         callback(null, true);
//         return;
//       }
//       callback(null, true);
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );

// app.use(globalLimiter);
// app.use(express.json({ limit: '1mb' }));
// app.use(express.urlencoded({ extended: true, limit: '1mb' }));
// app.use(cookieParser());

// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// app.use('/api', routes);

// app.get('/health', (_req, res) => {
//   res.json({ status: 'ok', timestamp: new Date().toISOString() });
// });

// app.use(notFoundHandler);
// app.use(errorHandler);

// export default app;




import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { env, getAllowedOrigins } from './config/env';
import { globalLimiter } from './middlewares/rateLimiter';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import routes from './routes';

const app = express();
const allowedOrigins = getAllowedOrigins();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser / same-origin and configured fronts
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
        callback(null, true);
        return;
      }
      // Dev-friendly: allow localhost any port
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        callback(null, true);
        return;
      }
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-guest-key',
      'X-Guest-Key',
    ],
  })
);

app.use(globalLimiter);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api', routes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;