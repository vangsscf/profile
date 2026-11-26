# Vagner Caldeira

A Next.js and TypeScript portfolio for a senior backend and full-stack engineer, with an AI career chat.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Set `OPENROUTER_API_KEY` in the untracked `.env` file to enable the chat. The server calls OpenRouter using `openrouter/free` and uses the portfolio content to answer career questions.

For a production Next.js server, run `npm run build` followed by `npm start` and provide `OPENROUTER_API_KEY` in the runtime environment.

For ChatGPT Sites, `npm run build:sites` packages the prerendered homepage and the chat endpoint as a Worker in `dist/server/`. Configure `OPENROUTER_API_KEY` as a Sites runtime secret.

Run `npm run typecheck` to check the TypeScript source.

Career entries, contact links, and the featured projects live in `app/content.ts`. To publish a case study link, add an `href` to its project entry. The card will show a case study link automatically. The downloadable résumé lives in `public/`.
