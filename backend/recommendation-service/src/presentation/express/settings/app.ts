import express from "express";
import recommendationRouter from "../routers/recommendation";

const app = express();

app.use(express.json());
app.use("/", recommendationRouter);

export default app;