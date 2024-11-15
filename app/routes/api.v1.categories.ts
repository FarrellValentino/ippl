// app/routes/api.v1.categories.ts
import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import db from "~/db";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    await db.addCategory({ name: body.name });
    return json({ success: true });
  } catch (error) {
    console.error("Error adding category:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};