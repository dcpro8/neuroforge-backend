import axios from "axios";
import { env } from "../config/env";
import { safeParseJSON } from "../utils/safeParse";
import { blueprintSchema } from "../validators/blueprint.schema";

const MAX_RETRIES = 2;

export const generateBlueprint = async (idea: string) => {
  const prompt = `
Return ONLY valid JSON. No explanation.

Schema:
{
  "features": [{ "name": "", "description": "", "priority": "high|medium|low" }],
  "database": [{ "name": "", "fields": [{ "name": "", "type": "", "required": true }] }],
  "apis": [{ "method": "GET|POST|PUT|DELETE", "path": "/api/...", "description": "" }],
  "ui": [{ "name": "", "description": "", "components": [] }],
  "roadmap": [{ "phase": "", "items": [] }]
}

Rules:
- APIs = real backend endpoints
- No third-party APIs
- Keep output concise
- Return raw JSON only
- No markdown
- No <think>

Idea:
${idea}
`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.post(
        `${env.MINIMAX_BASE_URL}/chat/completions`,
        {
          model: "minimaxai/minimax-m2.7",

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],

          temperature: 0.2,
          top_p: 0.95,
          max_tokens: 4000,
          stream: false,
        },
        {
          headers: {
            Authorization: `Bearer ${env.MINIMAX_API_KEY}`,
            "Content-Type": "application/json",
          },

          timeout: 240000,
        }
      );

      const content = response.data?.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("Empty AI response");
      }

      const parsed = safeParseJSON(content);

      if (!parsed) {
        throw new Error("Invalid JSON returned");
      }

      const validated = blueprintSchema.safeParse(parsed);

      if (!validated.success) {
        console.error(validated.error.flatten());

        throw new Error("Blueprint schema validation failed");
      }

      return validated.data;
    } catch (error: any) {
      console.error(
        "AI ERROR:",
        error?.response?.data || error.message
      );

      if (attempt === MAX_RETRIES) {
        throw new Error("AI failed after retries");
      }
    }
  }
};