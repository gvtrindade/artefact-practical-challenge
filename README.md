# Task List

A small task management app with create, edit, delete, cursor-based pagination, and infinite scrolling. The list is rendered from a server-prefetched first page and lazily loads more tasks as you scroll.

Check it out at [tasks.trindade.dev](https://tasks.trindade.dev)

## Stack

- **Next.js 16** (App Router) with React 19
- **TypeScript**
- **tRPC 11** for the API layer
- **TanStack Query 5** for caching, hydration, and infinite queries
- **Tailwind CSS 4** for styling
- **Zod 4** for input validation

## Run Locally

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
pnpm build   # production build
pnpm start   # run the production build
pnpm lint    # lint the project
```

## Notes

Tasks are stored in memory. Data resets when the server restarts; swap `trpc/task-store.ts` for a database when persistence is needed.
Lazy loading is implemented to improve loading speed.
