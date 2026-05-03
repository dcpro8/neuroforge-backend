import { Router } from "express";
import { generateController } from "../controllers/generate.controller";

const router = Router();

router.get("/generate", (req, res) => {
  res.json({ message: "Use POST to /generate with { idea: 'your idea' }" });
});

router.post("/generate", generateController);

export default router;