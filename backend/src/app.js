import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";

const app = express();
app.use(
  cors({
    origin: "https://dayblog.vercel.app", // Adjust this to your frontend's URL
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users", userRouter); // routes declaration
app.use("/api/v1/posts", postRouter); // routes declaration

export { app };
