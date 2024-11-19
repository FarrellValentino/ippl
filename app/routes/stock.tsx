import { Link, useLoaderData, MetaFunction, useNavigate } from "@remix-run/react";
import { useState } from "react";
import utils from "~/utils";
import db, { type Category, type Rack } from "~/db";
import { LoaderFunctionArgs } from "@remix-run/node";
import config from "~/config";

export const loader = async ({ request }: LoaderFunctionArgs ) => {
    const params = new URL(request.url).searchParams;
    const rack = params.get(config.URL_ACTIVE_RACK_PARAM);

    return { 
        categories: await db.getCategories(), 
        items: rack ? await db.getRacksByCategory(utils.camelToCapitalCase(rack)) : []
    };
};

export const meta: MetaFunction = () => [
    { title: "My Mart - Stock" },
];

const RackForm = () => {
    return (
        <div>
        </div>
    );
}

export default () => {
    const navigate = useNavigate();
    const { categories, items } = useLoaderData<typeof loader>();
    const [receipt, setReceipt] = useState({});
    const [popupForm, setPopupForm] = useState<{ [key: string]: boolean }>({
        rack: false,
        product: false,
    });

    return (
        <div>
            <div className="flex mt-6">
                <div className="w-9/12 h-80 overflow-y-scroll flex flex-wrap content-start gap-2">
                    {categories.map((category: Category, i: number) => (
                        <Link to={`/stock?${config.URL_ACTIVE_RACK_PARAM}=${utils.toCamelCase(category.name)}`} key={`stock-${i}`} >
                            <div className="relative size-36 text-black cursor-pointer" style={{background: category.color}} >
                                <p className="text-center">{category.name}</p>
                                <span className="absolute w-11 h-2.5 rounded-lg cursor-default bg-black bottom-1.5 left-0 right-0 mx-auto"></span>
                            </div>
                        </Link>
                    ))}
                    {/* <button className="size-36 text-2xl" onClick={() => {
                        setPopupForm((prev) => ({
                            ...prev,
                            rack: true,
                        }));
                    }}>+</button> */}
                </div>
                <div className="w-3/12 bg-neutral-900">
                    <p className="text-center my-2.5">Receipt</p>
                    <hr className="border-dashed mx-4" />
                    <div className="mx-4 mt-2">
                        <div className="h-52 overflow-auto">
                            {Object.values(receipt).map((item: any, i: number) => (
                                <div className="group flex items-center justify-between cursor-pointer" key={`receipt-item-${i}`} onClick={() => {
                                    setReceipt((prev: { [key: string]: any }): any => {
                                        const obj = { ...prev };

                                        if (obj[item.name].quantity - 1 >= 0) {
                                            obj[item.name] = { ...obj[item.name] };
                                            obj[item.name].quantity--;

                                            if (obj[item.name].quantity === 0) {
                                                delete obj[item.name];
                                            }
                                        }

                                        return obj;
                                    });
                                }}>
                                    <p>{item.name}: Rp. {item.price * item.quantity} ({item.quantity}x)</p>
                                    <span className="bg-red-700 text-sm px-2 rounded-lg hidden group-hover:block">-</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex align-center justify-between mt-5">
                            <p>Total: Rp. {Object.values(receipt).reduce((total: number, item: any): number => total + (item.price * item.quantity), 0)}</p>
                            <button onClick={async () => {
                                const products = Object.values(receipt);
                                if (!products.length) {
                                    return;
                                }

                                setReceipt({});

                                await fetch("/api/v1/racks/checkout", {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(products),
                                });

                                navigate(`.${window.location.search}`);
                            }}>Checkout</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex">
                {items.map((item: Rack, i: number) =>
                    <div className="size-36 bg-neutral-900 mr-2 p-2 cursor-pointer" key={`stock-rack-${i}`} onClick={() => {
                        setReceipt((prev: { [key: string]: any }) => {
                            if (!item.stock) {
                                return prev;
                            }

                            const obj = { ...prev };

                            if (!(item.name in obj)) {
                                obj[item.name] = { ...item };
                                obj[item.name].quantity = 0;
                            }

                            obj[item.name] = { ...obj[item.name] };

                            // NOTE: not enough stock
                            if (obj[item.name].quantity + 1 > obj[item.name].stock) {
                                return obj;
                            }

                            obj[item.name].quantity += 1;
                            return obj;
                        });
                    }}>
                        <p>{item.name} ({item.stock})</p>
                        <i className="text-sm">Rp. <span className="text-lime-400">{item.price}</span></i>
                    </div>
                )}
            </div>
        </div>
    );
}
