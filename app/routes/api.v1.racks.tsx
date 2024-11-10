import { ActionFunctionArgs } from "@remix-run/node";
import db, { Rack } from "~/db";

export const action = async ({ request }: ActionFunctionArgs) => {
    switch (request.method) {
        case "PUT":  return await putRequest(await request.json());
        case "POST": return await postRequest(await request.json());
        default:     return { success: false, message: "Unknown method" };
    }
}

const putRequest = async (item: Rack) => {
    await db.updateProduct(item);
    return { success: true, data: item };
}

const postRequest = async (item: Rack) => {
    await db.addProduct(item);
    return { success: true, data: item };
}
