import { ActionFunctionArgs } from "@remix-run/node";
import db, { type Rack } from "~/db";

export const action = async ({ request }: ActionFunctionArgs) => {
    switch (request.method) {
        case "PUT":  return await putRequest(await request.json());
        default:     return { success: false, message: "Unknown method" };
    }
}

const putRequest = async (products: Rack[]) => {
    return { success: await db.checkoutProducts(products), data: null };
}
