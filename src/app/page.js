import { connection } from "next/server";
import { Studio } from "@/components/studio/Studio";
import { getGenerations } from "@/lib/store";

export default async function Home() {
  // The store changes with every run, so render per request: history arrives in
  // the HTML instead of after hydration, and the first row is discoverable.
  await connection();
  return <Studio initialGenerations={getGenerations()} />;
}
