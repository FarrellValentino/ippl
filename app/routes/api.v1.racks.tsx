import { ActionFunctionArgs } from "@remix-run/node";
import db, { Rack } from "~/db";

export const action = async ({ request }: ActionFunctionArgs) => {
    switch (request.method) {
        case "POST": return await postRequest(await request.json());
        default:     return { success: false, message: "Unknown method" };
    }
}

const postRequest = async (item: Rack) => {
    await db.addProduct(item);
    return { success: true, data: item };
}
