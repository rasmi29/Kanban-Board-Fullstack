//import express
import express from "express";

//create server
const app = express();

//json parsing
app.use(express.json());

//router imports
import healthCheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/auth.routes.js";

//routing
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/user", userRouter);

//export app
export default app;
