import express, { Express, Request, Response } from 'express';
import { createProxyMiddleware, Options, RequestHandler } from 'http-proxy-middleware';

const app: Express = express();

const services: { [key: string]: string } = {
  auth: 'http://localhost:5000',
  roadmap: 'http://localhost:5001',
  profile: 'http://localhost:5002',
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

app.use('/auth', authProxy);
app.use('/profile', profileProxy);
app.use('/roadmap', roadmapProxy);

const PORT: number = 4000;
app.listen(PORT, () => {
  console.log(`API Gateway is running on http://localhost:${PORT}`);
});
