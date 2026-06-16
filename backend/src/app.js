import { config } from "dotenv";
config({ path: ".env.development.local" });
import express from "express";
import cors from "cors";
import prisma from "./lib/prisma.js";
import authRouter from "./auth/auth.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import categoriesRouter from "./categories/categories.routes.js";
import menuItemsRouter from "./menu-items/menu-items.routes.js";
import tablesRouter from "./tables/tables.routes.js";
import ordersRouter from "./orders/orders.routes.js";
import reservationsRouter from "./reservations/reservations.routes.js";

const app = express();

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map(s => s.trim())
  : ["http://localhost:5173", "http://localhost:4173"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o.replace(/\/+$/, '')))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/menu-items", menuItemsRouter);
app.use("/api/v1/tables", tablesRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/reservations", reservationsRouter);

app.get("/", (req, res) => {
  res.send("You have reached Mangia Restaurant Management API");
});

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Mangia API running on localhost:${process.env.PORT}`);
});
