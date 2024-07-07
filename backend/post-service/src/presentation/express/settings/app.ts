import express from "express";
import postRouter from "../routers/post";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', postRouter);

export default app;