import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust this to your frontend's URL
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users", userRouter); // routes declaration

export { app };
