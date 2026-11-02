import HomeClient from "@/components/HomeClient";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

export default async function Home() {
  await getQueryClient()
    .query(trpc.task.list.queryOptions())
    .catch(() => undefined);

  return (
    <HydrateClient>
      <HomeClient />
    </HydrateClient>
  );
}
