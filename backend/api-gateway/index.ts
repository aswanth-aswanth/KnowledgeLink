import express, { Express, Request, Response } from 'express';
import { createProxyMiddleware, Options, RequestHandler } from 'http-proxy-middleware';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

const app: Express = express();

// CORS configuration
const corsOptions = {
  origin: `${process.env.BASE_URL}:3000`,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

const services: { [key: string]: string } = {
  auth: `${process.env.BASE_URL}:5000`,
  roadmap: `${process.env.BASE_URL}:5001`,
  profile: `${process.env.BASE_URL}:5002`,
  post: `${process.env.BASE_URL}:5003`,
  notification: `${process.env.BASE_URL}:5004`,
  chat: `${process.env.BASE_URL}:5005`,
  recommendation: `${process.env.BASE_URL}:5006`,
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
  target: services.post,
  changeOrigin: true,
});

const notificationProxy: RequestHandler = createProxyMiddleware({
  target: services.notification,
  changeOrigin: true,
});

const chatProxy: RequestHandler = createProxyMiddleware({
  target: services.chat,
  changeOrigin: true,
});

const recommendationProxy: RequestHandler = createProxyMiddleware({
  target: services.recommendation,
  changeOrigin: true,
});

app.use('/auth', authProxy);
app.use('/profile', profileProxy);
app.use('/roadmap', roadmapProxy);
app.use('/post', postProxy);
app.use('/notification', notificationProxy);
app.use('/chat', chatProxy);
app.use('/recommendation', recommendationProxy);

const PORT: number = 4000;
app.listen(PORT, () => {
  console.log(`API Gateway is running on ${process.env.BASE_URL}:${PORT}`);
});
