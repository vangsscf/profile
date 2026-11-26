# Portfolio code review

Reviewed November 26, 2026.

## Summary

The project passes strict TypeScript checks for both Next.js and the Sites Worker. The page leaves static portfolio content in Server Components and limits client-side React to the chat. Both runtimes call the same chat handler, which validates message roles and lengths, bounds request size and provider latency, and keeps the OpenRouter key server-side. The chat renders model output as React text and `<strong>` elements, so formatted replies do not require an HTML injection API.

The most important work is to protect the OpenRouter quota before exposing the chat publicly, handle partial AI answers and cancellation, and make the custom Sites build reproducible from the main checkout. The findings below distinguish observed behavior from deployment and maintenance risks.

## Findings

### 1. P1 before public access · Add application-level quota protection

The shared handler checks `Sec-Fetch-Site`, the content type, and the size and shape of each request. The request then uses the same OpenRouter key for every visitor, with no per-visitor rate limit, shared budget, or concurrency limit in either runtime. Fetch Metadata describes a browser request and provides no caller identity for the quota. A busy chat can exhaust the shared free allowance and leave other visitors with a 429. This matters most if the portfolio is made public or the Next.js server is exposed directly. A private Sites deployment limits the audience. [Chat handler](app/career-chat-server.ts#L69) · [Next.js public endpoints and rate limiting](https://nextjs.org/docs/app/guides/backend-for-frontend#rate-limiting) · [OpenRouter free model limits](https://openrouter.ai/collections/free-models/)

**Recommendation.** Apply rate and concurrency limits at the hosting layer or through shared storage. Scope the policy to the chat route and key it by trusted visitor identity where available. Keep a shared budget for the upstream key so one caller or a burst cannot consume the entire allowance.

### 2. P2 · Long answers can lose formatting and appear complete

The server cuts the response at 2,000 UTF-16 code units and ignores the provider’s completion status. A local test with a stubbed long reply returned HTTP 200 with only one `**` delimiter. Chrome displayed that delimiter literally, consistent with the client’s paired-marker renderer. The same cut can split a word or a Unicode character. [Reply handling](app/career-chat-server.ts#L105) · [Bold renderer](app/career-chat.tsx#L12)

**Recommendation.** Keep the reply and history limits aligned. If a reply needs shortening, cut at a safe text boundary, preserve paired formatting, and tell the visitor when the provider or application cut the answer short. Test formatting that crosses the limit and a provider response that stops at its token limit.

### 3. P2 · Leaving the chat does not cancel the provider request

The client fetch has no cancellation signal. The upstream fetch uses a 25-second timeout but does not use the incoming request signal. In a local Worker test, aborting the incoming request left the stubbed upstream signal active. This can leave work running when the current answer is no longer needed. The form also stays read-only during the request and offers no way to stop it. [Client submit flow](app/career-chat.tsx#L31) · [Provider fetch](app/career-chat-server.ts#L84)

**Recommendation.** Pass an abort signal through the client fetch and combine the incoming request signal with the provider timeout where the host supports disconnect propagation. Allow the visitor to stop a pending answer and handle that state without showing a network failure. Test cancellation separately from timeout.

### 4. P2 · Visitor messages go to an external provider without a chat disclosure

The handler sends the latest question and recent conversation turns to OpenRouter. The panel identifies the twin as AI but gives visitors no indication that their questions leave the portfolio. The request also specifies no provider data-handling preference in source. The OpenRouter account’s privacy settings were outside the review. [Chat introduction](app/career-chat.tsx#L72) · [OpenRouter request](app/career-chat-server.ts#L84) · [OpenRouter provider routing and data controls](https://openrouter.ai/docs/guides/get-started/sovereign-ai)

**Recommendation.** State beside the input that chat messages are sent to OpenRouter. Decide which provider retention settings are appropriate, then verify that the free routing option still has eligible providers before applying stricter settings.

### 5. P2 · The Sites build depends on Next.js internal files and a separate manifest

The packager reads `.next/server/app/index.html`, `_not-found.html`, and `icon.svg.body` directly. Those filenames and the resolved static paths are assumptions of this build. Adding another App Router page does not make it available in the Worker, which currently packages a fixed homepage, 404, icon, static assets, public files, and one chat route. The main checkout also ignores `.openai/` and does not contain the hosting manifest, so the README’s build command can produce an artifact without reproducing the full Sites release from this checkout. [Sites packager](scripts/build-sites.mts#L38) · [Worker routes](worker/index.ts#L8) · [Ignore rules](.gitignore#L1) · [Build instructions](README.md#L12) · [Next.js deployment adapter guidance](https://nextjs.org/docs/app/guides/deploying-to-platforms)

**Recommendation.** Document the supported routes and the provenance of the Sites manifest, keeping runtime secrets in hosting configuration. Add an artifact smoke check for the homepage, 404, linked JS and CSS, résumé, and chat API before updating Next.js. If the portfolio gains additional Next.js routes, adopt a deployment path that supports those routes or explicitly package them.

### 6. P3 · Provider errors are difficult to diagnose and retry correctly

The handler collapses upstream non-429 failures and caught network or parsing errors into generic responses. There are no structured diagnostic events for status, timeout, invalid response, or missing configuration. The 429 branch also discards provider retry timing. In a stubbed test, an upstream 429 with `Retry-After: 45` produced a downstream 429 without that header. The incoming JSON parser similarly reports oversized and malformed requests as the same question-length error. [Request and error handling](app/career-chat-server.ts#L65) · [Provider failure handling](app/career-chat-server.ts#L100) · [OpenRouter retry guidance](https://learn.openrouter.ai/courses/first-request/when-a-request-fails)

**Recommendation.** Keep visitor-facing messages concise. Add server-side diagnostics with an error category, upstream status, and request ID while excluding prompts, replies, and secrets. Forward valid retry timing when present and distinguish malformed JSON, invalid messages, and excess body size in the response contract.

### 7. P3 · The Worker omits cache directives for fingerprinted assets

The generated Worker serves assets with a content type only. A direct check of a fingerprinted JavaScript URL returned HTTP 200 with no `Cache-Control` header. In the absence of a hosting override, browsers receive no explicit instruction to keep those versioned assets. The Worker also decodes the embedded asset for each GET it handles. [Asset response](worker/index.ts#L22) · [Next.js static asset caching](https://nextjs.org/docs/app/guides/cdn-caching)

**Recommendation.** Set long-lived immutable caching for fingerprinted assets. Give the homepage and résumé independent policies because their URLs can stay the same across releases. Consider static asset bindings if the packaged assets grow.

### 8. P3 · Chat history scrolls unexpectedly and its memory limit is invisible

The chat scrolls to the bottom whenever `messages`, `pending`, or `error` changes. A visitor reading older messages can lose their place when a reply arrives or request status changes. The transcript also remains visible after the oldest turns drop out of the 11-message context window. The first exchange leaves the model’s context when the seventh question is sent, even though the visitor can still see it. [Scroll effect and request body](app/career-chat.tsx#L27) · [History limit](app/chat-limits.ts#L6)

**Recommendation.** Follow the latest message while the visitor stays near the bottom, and let readers return to the latest response when ready. Indicate that only recent turns are used when answering follow-ups.

### 9. P3 · Centralize career details and narrow external JSON at the boundary

Experience, projects, and skills are already shared. Location, role interests, education, and languages are separately written in the page and the system prompt, so a portfolio edit can leave the twin answering from older facts. The outbound reply and browser response have TypeScript annotations over `response.json()`; the code checks the final text or error string, while the rest of the JSON shape remains an assumption. [Prompt facts](app/career-chat-server.ts#L4) · [Page credentials](app/page.tsx#L109) · [Chat response parsing](app/career-chat.tsx#L49) · [TypeScript narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing)

**Recommendation.** Put shared career facts in `app/content.ts` and derive both presentations from them. Treat external JSON as `unknown` and narrow only the fields the code uses, including any completion status added to the chat contract.

## Verification

- Ran TypeScript with `--noEmit --incremental false` under both configurations. Both passed.
- Used the existing Worker build for offline checks. The homepage, a fingerprinted JavaScript asset, and the résumé returned 200. An unknown path returned 404. Stubbed OpenRouter responses confirmed truncation, retry-header loss, and cancellation behavior.
- In headless Chrome, the existing page fit at 320, 360, 390, and 768 CSS pixels without horizontal overflow. This was a reflow spot check. [WCAG reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow)
- The repository has build and typecheck scripts but no committed automated test suite. Start with repeatable tests for the shared chat request and reply contract, then a browser smoke check against the packaged Worker. [Project scripts](package.json#L5)
- Verification used the local source, existing build artifacts, and stubbed provider responses. This report is the only file added.
