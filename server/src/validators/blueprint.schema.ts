import { z } from "zod";

export const blueprintSchema = z.object({
  features: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      priority: z.enum(["high", "medium", "low"]),
    })
  ),

  database: z.array(
    z.object({
      name: z.string(),
      fields: z.array(
        z.object({
          name: z.string(),
          type: z.string(),
          required: z.boolean(),
        })
      ),
    })
  ),

  apis: z.array(
    z.object({
      method: z.enum(["GET", "POST", "PUT", "DELETE"]),
      path: z.string(),
      description: z.string(),
    })
  ),

  ui: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      components: z.array(z.string()),
    })
  ),

  roadmap: z.array(
    z.object({
      phase: z.string(),
      items: z.array(z.string()),
    })
  ),
});