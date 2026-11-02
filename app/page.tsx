import HomeClient from "@/components/HomeClient";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import { TASK_PAGE_SIZE } from "@/trpc/task-properties";

export default async function Home() {
  await getQueryClient()
    .infiniteQuery(
      trpc.task.list.infiniteQueryOptions(
        { limit: TASK_PAGE_SIZE },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        },
      ),
    )
    .catch(() => undefined);

  return (
    <HydrateClient>
      <HomeClient />
    </HydrateClient>
  );
}
