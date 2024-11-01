import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import utils from "~/utils";
import db, { type Rack } from "~/db";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    /* TODO: assert */
    if (typeof params.category !== "string") return [];
    return await db.getRacksByCategory(utils.camelToCapitalCase(params.category));
};

export default () => {
    const items = useLoaderData<typeof loader>();
    const setReceipt = useOutletContext<Function>();

    return (
        <div className="mt-6 flex">
            {items.map((item: Rack, i: number) => 
                <div className="size-36 bg-neutral-900 mr-2 p-2" key={`stock-rack-${i}`}>
                    <p>{item.name}</p>
                    <i className="text-sm">Rp. <span className="text-lime-400">{item.price}</span></i>

                    <div className="mt-3">
                        <button className="py-1 px-3 mr-1" onClick={() => {
                            setReceipt((prev: { [key: string]: any }) => {
                                const obj = { ...prev };

                                if (!(item.name in obj)) {
                                    obj[item.name] = { ...item };
                                    obj[item.name].count = 0;
                                }

                                obj[item.name] = { ...obj[item.name] };

                                // NOTE: not enough stock
                                if (obj[item.name].count + 1 > obj[item.name].stock) {
                                    return obj;
                                }

                                obj[item.name].count += 1;
                                return obj;
                            });
                        }}>+</button>
                    </div>
                </div>
            )}
        </div>
    );
};
