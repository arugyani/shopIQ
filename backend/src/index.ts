require("dotenv").config();

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import searchRoutes from "./routes/searchRoutes";
import recommendationRoutes from "./routes/recommendationRoutes";

const app = express();
app.use(cors());

const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/search", searchRoutes);
app.use("/recommendations", recommendationRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to ShopIQ" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.stack });
});

app.listen(port, () => {
  console.log(`shopIQ server running at http://localhost:${port} 🎉`);
});
