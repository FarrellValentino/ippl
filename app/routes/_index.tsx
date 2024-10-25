import type { MetaFunction } from "@remix-run/node";
import RackBox from "~/components/Rack/RackBox";
import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import db, { type Category } from "~/.server/db";

export const meta: MetaFunction = () => {
    return [
        { title: "My Mart" },
        { name: "description", content: "My Mart" },
    ];
};

export const loader = async () => {
    return await db.getCategories();
};

export default () => {
    const categories = useLoaderData<typeof loader>();
    const [currentCategory, setCurrentCategory]: [Category, Function] = useState(categories[0]);

    return (
        <div>
            <div className="flex mt-6">
                <div className="w-9/12 h-80 overflow-y-scroll flex flex-wrap content-start gap-2">
                    {categories.map((c: Category, i: number) => (
                        <RackBox key={`Rack @${i}`} category={c} onClick={(c) => setCurrentCategory((_: Category) => c)} />
                    ))}
                </div>
                <div className="w-3/12 bg-neutral-900">
                    <p className="text-center my-2.5">Receipt</p>
                    <hr className="border-dashed mx-4" />
                </div>
            </div>
            {/* <RackItems label={label} /> */}
        </div>
    );
}
