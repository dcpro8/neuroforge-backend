import { z } from "zod";

export const generateSchema = z.object({
    idea: z.string().min(5, "Idea too short").max(500, "Idea too long"),
});
