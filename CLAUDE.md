# StackAudit

Static-path frontend at **bilko.run/projects/stack-audit/**. SaaS-stack waste finder. Calls `bilko.run/api/demos/stack-audit` same-origin so the Clerk session cookie + JWT travel automatically.

## Layout
- `src/main.tsx` — React mount point + `<ClerkProvider>`.
- `src/StackAuditPage.tsx` — the page (extracted from `~/Projects/Bilko/src/pages/StackAuditPage.tsx`).
- `src/useToolApi.ts` — hook hitting `https://bilko.run/api` same-origin.
- `src/kit.tsx` — slim `track()` + `<ToolHero>`/`<ScoreCard>`/`<SectionBreakdown>`/`<CrossPromo>`. Full kit lives in the host at `~/Projects/Bilko/src/components/tool-page/`.
- `.mcp.json` — wires the `bilko-host` MCP into Claude sessions in this repo.

## Commands
- `pnpm dev` — local on `http://localhost:5173`.
- `pnpm build` — emit `dist/`.
- `pnpm sync` — `rm -rf ../Bilko/public/projects/stack-audit && cp -r dist ../Bilko/public/projects/stack-audit`.

## Deploy
Static-path sibling of Bilko. `pnpm build && pnpm sync`, then commit + push from `~/Projects/Bilko` to both remotes. Or use the `bilko-host` MCP from this session — `register_static_project` once, `publish_static_project` each release.

## Conventions
- Server route stays in the host (`~/Projects/Bilko/server/routes/tools/stack-audit.ts`). Do not move backend logic here.
- Auth is Clerk via `@clerk/clerk-react`. JWT bearer comes from `useToolApi`.
- Vite `base: '/projects/stack-audit/'`.
- TS strict. Tailwind v4 (`@tailwindcss/vite`). No router.
- See `~/Projects/Bilko/docs/host-contract.md` for the static-path contract.
