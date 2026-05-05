# StackAudit

Standalone SaaS-stack waste finder. Built as a static-path sibling that gets served at **bilko.run/projects/stack-audit/** by the [bilko-run host](https://github.com/StanislavBG/bilko-run).

Calls `bilko.run/api/demos/stack-audit` same-origin — Clerk session cookie + JWT travel automatically.

## Build + sync

```bash
pnpm install
pnpm build              # emits dist/
pnpm sync               # copies dist/ to ../Bilko/public/projects/stack-audit/
```

Or, from a Claude session in this repo, use the `bilko-host` MCP — it'll register the project, copy the build output, commit, and push to both remotes for you.

## Architecture

- React 18 + Vite 6 + Tailwind v4. No router. Bundles `@clerk/clerk-react` for SignInButton + JWT bearer auth.
- Slim local kit (`src/kit.tsx`) for `track()`, `<ToolHero>`, `<ScoreCard>`, `<SectionBreakdown>`, `<CrossPromo>`. The host's full kit lives at `~/Projects/Bilko/src/components/tool-page/`.
- `useToolApi` hooks the standalone to `bilko.run/api` same-origin. Server route stays in the host.
- Vite `base: /projects/stack-audit/` so all assets resolve under that path.

## Files

- `src/StackAuditPage.tsx` — the page (extracted from `~/Projects/Bilko/src/pages/StackAuditPage.tsx`)
- `src/main.tsx` — mount point + ClerkProvider
- `src/index.css` — Tailwind + warm/fire/grade palette tokens
- `src/kit.tsx` — slim `track()` + ToolHero/ScoreCard/SectionBreakdown/CrossPromo
- `src/useToolApi.ts` — same hook as host, points to `https://bilko.run/api`
- `vite.config.ts` — base path + tailwind plugin
- `.mcp.json` — wires up `bilko-host` MCP for self-publish from a Claude session
