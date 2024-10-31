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
        <div>
            {items.map((item: Rack, i: number) => 
                <div key={`dashboard-rack-${i}`}>
                    {item.name}
                </div>
            )}
        </div>
    );
}
