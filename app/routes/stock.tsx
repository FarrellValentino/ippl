import { Link, useLoaderData, MetaFunction, useNavigate } from "@remix-run/react";
import { useState } from "react";
import utils from "~/utils";
import db, { type Category, type Rack } from "~/db";
import { LoaderFunctionArgs } from "@remix-run/node";
import config from "~/config";

// Define an interface for receipt items
interface ReceiptItem extends Rack {
    quantity: number;
}

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

export default () => {
    const navigate = useNavigate();
    const { categories, items } = useLoaderData<typeof loader>();
    const [receipt, setReceipt] = useState<Record<string, ReceiptItem>>({});
    const [confirmationModal, setConfirmationModal] = useState(false);

    const addToReceipt = (item: Rack) => {
        setReceipt((prev) => {
            if (!item.stock) return prev;

            const obj = { ...prev };
            if (!(item.name in obj)) {
                obj[item.name] = { ...item, quantity: 0 };
            }

            if (obj[item.name].quantity + 1 <= obj[item.name].stock) {
                obj[item.name] = { 
                    ...obj[item.name], 
                    quantity: obj[item.name].quantity + 1 
                };
            }
            return obj;
        });
    };

    const removeFromReceipt = (itemName: string) => {
        setReceipt((prev) => {
            const obj = { ...prev };
            if (obj[itemName]) {
                obj[itemName].quantity--;
                if (obj[itemName].quantity <= 0) {
                    delete obj[itemName];
                }
            }
            return obj;
        });
    };

    const handleCheckout = async () => {
        const products = Object.values(receipt);
        if (!products.length) return;

        await fetch("/api/v1/racks/checkout", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(products),
        });

        setReceipt({});
        setConfirmationModal(false);
        navigate(`.${window.location.search}`);
    };

    const totalAmount = Object.values(receipt).reduce(
        (total, item) => total + (item.price * item.quantity), 0
    );

    return (
        <div>
            {confirmationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-black p-6 rounded-lg shadow-lg w-11/12 max-w-md">
                  <h2 className="text-2xl font-bold mb-4 text-center">
                    Confirm Checkout
                  </h2>
                  <p className="text-lg text-center">
                    Total: <span className="font-semibold">Rp. {totalAmount.toLocaleString()}</span>
                  </p>
                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full shadow transition-all duration-200"
                      onClick={() => setConfirmationModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full shadow transition-all duration-200"
                      onClick={handleCheckout}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
            
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
                </div>
                <div className="w-3/12 bg-neutral-900">
                    <p className="text-center my-2.5">Receipt</p>
                    <hr className="border-dashed mx-4" />
                    <div className="mx-4 mt-2">
                        <div className="h-52 overflow-auto">
                            {Object.values(receipt).map((item, i) => (
                                <div className="flex items-center justify-between mt-1" key={`receipt-item-${i}`}>
                                    <p>{item.name}: Rp. {(item.price * item.quantity).toLocaleString()} ({item.quantity}x)</p>
                                    <div>
                                        <button 
                                            className="text-white px-2 rounded mr-1"
                                            onClick={() => removeFromReceipt(item.name)}
                                        >
                                            -
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex align-center justify-between mt-5">
                            <p>Total: Rp. {totalAmount}</p>
                            <button 
                                onClick={() => {
                                    const products = Object.values(receipt);
                                    if (products.length) {
                                        setConfirmationModal(true);
                                    }
                                }}
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex flex-wrap">
                {items.map((item: Rack, i: number) => (
                    <div 
                        className="size-36 bg-neutral-900 mr-2 mb-2 p-2 relative" 
                        key={`stock-rack-${i}`}
                    >
                        <p>{item.name} ({item.stock})</p>
                        <i className="text-sm">Rp. <span className="text-lime-400">{item.price.toLocaleString()}</span></i>
                        <div className="absolute bottom-2 right-2 flex items-center">
                            <button 
                                className="text-white px-2 rounded mr-1"
                                onClick={() => addToReceipt(item)}
                                disabled={!item.stock}
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
