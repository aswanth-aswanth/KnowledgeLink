import express, { Express, Request, Response } from 'express';
import { createProxyMiddleware, Options, RequestHandler } from 'http-proxy-middleware';
import cors from 'cors';

const app: Express = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: '*',
  credentials: true,
};

app.use(cors(corsOptions));

const services: { [key: string]: string } = {
  auth: 'http://localhost:5000',
  roadmap: 'http://localhost:5001',
  profile: 'http://localhost:5002',
  post: 'http://localhost:5003',
  notification: 'http://localhost:5004',
};

const authProxy: RequestHandler = createProxyMiddleware({
  target: services.auth,
  changeOrigin: true,
});

const profileProxy: RequestHandler = createProxyMiddleware({
  target: services.profile,
  changeOrigin: true,
});

const roadmapProxy: RequestHandler = createProxyMiddleware({
  target: services.roadmap,
  changeOrigin: true,
});

const postProxy: RequestHandler = createProxyMiddleware({
  target: services.roadmap,
  changeOrigin: true,
});

const notificationProxy: RequestHandler = createProxyMiddleware({
  target: services.roadmap,
  changeOrigin: true,
});

app.use('/auth', authProxy);
app.use('/profile', profileProxy);
app.use('/roadmap', roadmapProxy);
app.use('/post', postProxy);
app.use('/notification', notificationProxy);

const PORT: number = 4000;
app.listen(PORT, () => {
  console.log(`API Gateway is running on http://localhost:${PORT}`);
});
