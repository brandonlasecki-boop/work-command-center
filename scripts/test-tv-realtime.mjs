import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const anon = createClient(url, anonKey);

const { data: task, error: fetchError } = await anon
  .from("work_items")
  .select("id,title,status,completed_at")
  .eq("type", "task")
  .neq("status", "completed")
  .limit(1)
  .maybeSingle();

if (fetchError || !task) {
  console.error("Could not fetch task", fetchError);
  process.exit(1);
}

console.log("Testing with task:", task.title);

let gotEvent = false;
const channel = anon
  .channel("test-tv-realtime")
  .on(
    "postgres_changes",
    { event: "UPDATE", schema: "public", table: "work_items" },
    (payload) => {
      gotEvent = true;
      console.log("UPDATE event:", {
        id: payload.new?.id,
        oldStatus: payload.old?.status,
        newStatus: payload.new?.status,
        completedAt: payload.new?.completed_at,
      });
    }
  )
  .subscribe((status, err) => {
    console.log("Channel status:", status, err?.message ?? "");
  });

await new Promise((resolve) => setTimeout(resolve, 2500));

const { error: updateError } = await anon
  .from("work_items")
  .update({ status: "completed" })
  .eq("id", task.id);

console.log("Update result:", updateError ?? "ok");
await new Promise((resolve) => setTimeout(resolve, 4000));
console.log("Received realtime event:", gotEvent);

await anon.removeChannel(channel);
await anon.from("work_items").update({ status: "not_started" }).eq("id", task.id);
process.exit(gotEvent ? 0 : 1);
