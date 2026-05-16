import axios from "axios";
import { env } from "../config/env";
import { safeParseJSON } from "../utils/safeParse";
import { blueprintSchema } from "../validators/blueprint.schema";

const MAX_ATTEMPTS = 2;

export const generateBlueprint = async (idea: string) => {
  const prompt = `
Generate a software product blueprint.

Return ONLY valid JSON.

Schema:
{
  "features": [
    {
      "name": "",
      "description": "",
      "priority": "high|medium|low"
    }
  ],

  "database": [
    {
      "name": "",
      "fields": [
        {
          "name": "",
          "type": "",
          "required": true
        }
      ]
    }
  ],

  "apis": [
    {
      "method": "GET|POST|PUT|DELETE",
      "path": "/api/...",
      "description": ""
    }
  ],

  "ui": [
    {
      "name": "",
      "description": "",
      "components": []
    }
  ],

  "roadmap": [
    {
      "phase": "",
      "items": []
    }
  ]
}

Rules:
- Return raw JSON only
- No markdown
- No explanations
- No <think>
- APIs must be backend endpoints only
- Keep responses concise but practical

Idea:
${idea}
`;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await axios.post(
        `${env.GROQ_BASE_URL}/chat/completions`,
        {
          model: "llama-3.3-70b-versatile",

          messages: [
            {
              role: "system",
              content: "You are a JSON API. Return only valid JSON.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],

          temperature: 0.2,
          top_p: 1,
          max_tokens: 2500,
          stream: false,

          response_format: {
            type: "json_object",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },

          timeout: 30000,
        }
      );

      const content =
        response.data?.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("Empty AI response");
      }

      const parsed = safeParseJSON(content);

      if (!parsed) {
        console.error("RAW AI RESPONSE:", content);

        throw new Error("Invalid JSON returned");
      }

      const validated = blueprintSchema.safeParse(parsed);

      if (!validated.success) {
        console.error(
          validated.error.flatten()
        );

        throw new Error(
          "Blueprint schema validation failed"
        );
      }

      return validated.data;
    } catch (error: any) {
      console.error(
        "AI ERROR:",
        error?.response?.data || error.message
      );

      if (attempt === MAX_ATTEMPTS) {
        throw new Error("AI failed after retries");
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 1500)
      );
    }
  }
};