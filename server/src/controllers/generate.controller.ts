import { Request, Response } from "express";
import { generateSchema } from "../validators/generate.schema";
import { generateBlueprint } from "../services/ai.service";

export const generateController = async (req: Request, res: Response) => {
    try {
        // validate input
        const parsed = generateSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                error: parsed.error.flatten(),
            });
        }

        const { idea } = parsed.data;

        // call AI
        const result = await generateBlueprint(idea);

        return res.json(result);
    } catch (error) {
        console.error("GENERATION ERROR:", error);

        return res.status(500).json({
            error: "Failed to generate blueprint",
        });
    }
};