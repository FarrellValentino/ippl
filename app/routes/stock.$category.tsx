import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import db, { type Rack } from "~/db";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    /* TODO: assert */
    if (typeof params.category !== "string") return [];

    const category = `${params.category[0].toUpperCase()}${params.category.slice(1)}`;
    return await db.getRacksByCategory(category);
};

export default () => {
    const items = useLoaderData<typeof loader>();

    return (
        <div className="mt-6 flex">
            {items.map((item: Rack, i: number) => 
                <div className="h-32 w-32 bg-neutral-900 mr-2" key={`stock-rack-${i}`}>
                    <p>{item.name}</p>
                    <i>Rp. {item.price}</i>
                    <br />
                    <br />
                    <br />
                    <button className="py-1 px-3 mr-1">+</button>
                    <button className="py-1 px-3">-</button>
                </div>
            )}
        </div>
    );
}
