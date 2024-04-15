import { Router } from "express";
import { getProductList } from "../controllers/recommendationController";
import { body } from "express-validator";

const router = Router();

const validationRules = [
  body("query").notEmpty().withMessage("Search Query is required."),
  body("responses").notEmpty().withMessage("Q&A Responses are required."),
  body("responses").isArray().withMessage("Q&A Responses must be an array"),
];

router.post("/", validationRules, getProductList);

export default router;
