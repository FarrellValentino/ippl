import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import utils from "~/utils";
import db, { type Rack } from "~/db";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    /* TODO: assert */
    if (typeof params.category !== "string") return [];
    return await db.getRacksByCategory(utils.camelToCapitalCase(params.category));
};

export default () => {
    const items = useLoaderData<typeof loader>();

    return (
        <div className="mt-6 flex">
            {items.map((item: Rack, i: number) => 
                <div className="size-36 bg-neutral-900 mr-2" key={`stock-rack-${i}`}>
                    <p>{item.name}</p>
                    <i className="text-sm">Rp. <span className="text-lime-400">{item.price}</span></i>
                    <div className="mt-3">
                        <button className="py-1 px-3 mr-1">+</button>
                        <button className="py-1 px-3">-</button>
                    </div>
                </div>
            )}
        </div>
    );
}
