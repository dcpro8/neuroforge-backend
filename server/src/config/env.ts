import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  CLIENT_URL: process.env.CLIENT_URL || "*",

  MINIMAX_API_KEY: process.env.MINIMAX_API_KEY || "",
  MINIMAX_BASE_URL: process.env.MINIMAX_BASE_URL || "",
};