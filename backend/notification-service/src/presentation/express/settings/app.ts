import express from "express";
import notificationRouter from "../routers/notification";
import meetingRouter from "../routers/meeting";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', notificationRouter);
app.use('/meeting', meetingRouter);

export default app;