import { Link, useLoaderData, Outlet } from "@remix-run/react";
import { useState } from "react";
import utils from "~/utils";
import db, { type Category } from "~/db";

export const loader = async () => {
    return await db.getCategories();
};

export default () => {
    const categories = useLoaderData<typeof loader>();
    const [receipt, setReceipt] = useState([]);

    return (
        <div>
            <div className="flex mt-6">
                <div className="w-9/12 h-80 overflow-y-scroll flex flex-wrap content-start gap-2">
                    {categories.map((category: Category, i: number) => (
                        <Link to={`/stock/${utils.toCamelCase(category.name)}`} key={`stock-${i}`} >
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
                            {Object.values(receipt).map((item: any, i: number) => {
                                return (
                                    <div key={`receipt-item-${i}`}>
                                        <p><span>-</span> {item.name}: Rp. {item.price * item.count} ({item.count}x)</p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex align-center justify-between mt-5">
                            <p>Total: Rp. {Object.values(receipt).reduce((total: number, item: any): number => total + item.price, 0)}</p>
                            <button>Accept</button>
                        </div>
                    </div>
                </div>
            </div>
            <Outlet context={setReceipt} />
        </div>
    );
}
