import express from "express";
import chatRouter from "../routers/chat";
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

app.use('/', chatRouter);

app.use(errorHandler);

export default app;