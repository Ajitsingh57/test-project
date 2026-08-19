import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";

import path from "path";

import userRouter from "./routes/userRoute.js";
import watchRouter from "./routes/watchRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB
connectDB();

// ROUTES
app.use("/api/auth", userRouter);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/watches", watchRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

app.get("/", (req, res) => {
  res.send("API working");
});

// Vercel ke liye app export
export default app;