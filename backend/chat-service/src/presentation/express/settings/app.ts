import express from "express";
import chatRouter from "../routers/chat";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', chatRouter);

export default app;