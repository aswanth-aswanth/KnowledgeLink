import express from "express";
import postRouter from "../routers/post";
import shortRouter from "../routers/short";
import { errorHandler } from '../../../infra/http/middleware/errorHandler';
import logger from '../../../infra/logging/logger';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    logger.info({
        method: req.method,
        path: req.path,
        body: req.body,
        query: req.query,
    });
    next();
});

app.use('/', postRouter);
app.use('/short', shortRouter);

app.use(errorHandler);

export default app;