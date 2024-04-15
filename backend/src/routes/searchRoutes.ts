import { Router } from "express";
import { Request, Response } from "express";
import { getQuestions } from "../controllers/searchController";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(400).json({
    error: "No search query passed...",
    requiredFormat: "/search/:query",
    example: "/search/sports+cameras",
  });
});

router.get("/:query", getQuestions);

export default router;
