import express from "express";
import notificationRouter from "../routers/notification";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', notificationRouter);

export default app;