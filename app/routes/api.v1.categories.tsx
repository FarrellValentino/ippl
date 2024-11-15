import type { ActionFunctionArgs } from "@remix-run/node";
import db, { Category } from "~/db";

export const action = async ({ request }: ActionFunctionArgs) => {
    switch (request.method) {
        case "POST": return await postRequest(await request.json());
        default:     return { success: false, message: "Unknown method" };
    }
}

const postRequest = async (category: Partial<Category>) => {
    await db.addCategory(category);
    return { success: true, data: category };
}
