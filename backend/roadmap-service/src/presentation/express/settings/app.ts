import express from "express";
import roadmapRouter from "../routers/roadmap";

const app = express();

app.use(express.json());
app.use("/", roadmapRouter);

export default app;