import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  CLIENT_URL: process.env.CLIENT_URL || "*",

  GROQ_API_KEY: process.env.GROQ_API_KEY || "",
  GROQ_BASE_URL: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1",
};