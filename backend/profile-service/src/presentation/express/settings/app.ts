import express from "express";
// import profileRouter from "../routers/profile";

const app = express();

app.use(express.json());
// app.use('/profile', profileRouter);

export default app;