import express from "express";
import postRouter from "../routers/post";
import shortRouter from "../routers/short";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', postRouter);
app.use('/short', shortRouter);

export default app;