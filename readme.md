# NeuroForge Backend

The NeuroForge Backend is an Express.js API built with TypeScript. It serves as the engine behind AI-powered blueprint generation, helping turn simple product ideas into detailed technical plans. It connects with the Minimax AI model to bridge the gap between raw concepts and structured data.

## 1. Project Overview
This server acts as a stateless API that handles input validation, crafts AI prompts, and checks responses. You feed it a product idea, and it spits out a neatly formatted JSON blueprint packed with features, database schemas, API designs, UI components, and implementation roadmaps.

## 2. API Functionality
The main action happens through one key endpoint:
- **Blueprint Generation**: Turns plain text into organized technical docs.
- **Validation**: Uses Zod to make sure both your requests and the AI's responses follow the right structure.
- **Prompt Engineering**: Builds smart prompts on the fly to get valid, parseable JSON from the AI.

## 3. Architecture Breakdown
Here's how the code is organized:
- **`app.ts`**: The starting point—sets up Express middleware, security headers, and gets the server running.
- **`generate.routes.ts`**: Handles the routing for the `/api/generate` endpoint.
- **`generate.controller.ts`**: Takes care of requests and responses, plus error handling.
- **`ai.service.ts`**: The core logic for building prompts, talking to Minimax, and parsing responses.
- **`generate.schema.ts`**: Zod schema to validate what you send in.
- **`blueprint.schema.ts`**: Zod schema to validate the AI's output.
- **`sanitize.ts`**: Cleans up HTML and unsafe characters from user input.
- **`env.ts`**: Manages environment variables in a type-safe way.

## 4. Request/Response Flow
Here's the step-by-step process:
1. **POST Request**: Your client sends a simple `{ "idea": "string" }` to `/api/generate`.
2. **Sanitization**: We strip out any HTML or risky tags using `sanitize.ts`.
3. **Request Validation**: Zod checks that your input is properly formatted.
4. **AI Orchestration**:
   - `ai.service.ts` wraps your idea in a system prompt.
   - Sends the request to Minimax's chat completion API.
5. **Output Validation**: Parses and validates the AI response against `blueprint.schema.ts`.
6. **Response**: Returns a clean JSON object to your client.

## 5. Folder Structure
```text
src/
├── controllers/
│   └── generate.controller.ts  # Request handlers
├── routes/
│   └── generate.routes.ts      # API route definitions
├── services/
│   └── ai.service.ts           # Minimax API integration
├── schemas/
│   ├── generate.schema.ts      # Input validation
│   └── blueprint.schema.ts     # AI output validation
├── utils/
│   ├── sanitize.ts             # Input cleaning
│   └── env.ts                  # Environment config
├── app.ts                      # Express setup
└── server.ts                   # Server listener
```

## 6. Setup Instructions
Ready to get started? Let's set this up:

First, clone the repo:
```bash
git clone <repository-url>
cd neuroforge-server
```

Next, grab the dependencies:
```bash
npm install
```

Now, set up your environment. Create a `.env` file in the root directory:
```bash
MINIMAX_API_KEY=your_api_key
MINIMAX_BASE_URL=your_api_base_url
CLIENT_URL=http://localhost:3000
PORT=5000
```

Finally, build and run:
```bash
npm run build
npm start
```

## 7. Environment Variables

| Variable          | Description                                      |
|-------------------|--------------------------------------------------|
| MINIMAX_API_KEY   | Your secret key to access Minimax AI.            |
| MINIMAX_BASE_URL  | The base URL for Minimax chat completions.       |
| CLIENT_URL        | The frontend URL for CORS restrictions.          |

## 8. Security Considerations
We've got a few layers of security in place:
- **Helmet**: Adds HTTP headers to keep things secure.
- **CORS**: Limits requests to your specified CLIENT_URL to avoid unauthorized access.
- **Rate Limiting**: Keeps things fair by preventing overuse and managing AI costs.
- **Sanitization**: Cleans user input to reduce injection risks before it hits the AI.

## 9. Notes
Just a couple of things to keep in mind:
- **Scope**: This is purely for blueprint generation—it's stateless, doesn't store data, and won't create actual code.
- **Validation**: We enforce strict JSON rules. If the AI messes up the structure, we handle it gracefully instead of sending back junk.