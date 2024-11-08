import { useLoaderData, MetaFunction } from "@remix-run/react";
import { FormEvent } from "react";
import db, { type Category } from "~/db";

export const loader = async () => {
    return await db.getCategories();
};

export const meta: MetaFunction = () => [
    { title: "My Mart - Restock" },
];

export default () => {
    const categories = useLoaderData<typeof loader>();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget);

        /* TODO: Refactor, handle from input, prevent the minus value to present.
         */
        if ((data.get("price") && Number(data.get("price")) < 0) ||
            (data.get("stock") && Number(data.get("stock")) < 0)) {
            return;
        }

        fetch("/api/v1/racks", {
            method: "POST",
            body: JSON.stringify(Object.fromEntries(data.entries())),
        });
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="mt-10 mb-4">Restock</h1>
            <form action="POST" onSubmit={(e) => handleSubmit(e)}>
                <div className="my-4">
                    <label htmlFor="category">Category</label>
                    <br />
                    <select className="h-10 w-52 outline-none bg-neutral-900 text-white p-1 rounded" name="category">
                        {categories.map((category: Category, i: number) => 
                            <option key={`option-restock-${i}`} value={category.name}>{category.name}</option>
                        )}
                    </select>
                </div>

                <div className="my-4">
                    <label htmlFor="name">Name</label>
                    <br />
                    <input className="h-10 w-52 outline-none bg-neutral-900 text-white p-1 rounded" name="name" type="text" />
                </div>

                <div className="my-4">
                    <label htmlFor="price">Price</label>
                    <br />
                    <input className="h-10 w-52 outline-none bg-neutral-900 text-white p-1 rounded" name="price" type="number" defaultValue={2000} />
                </div>

                <div className="my-4">
                    <label htmlFor="stock">Stock</label>
                    <br />
                    <input className="h-10 w-52 outline-none bg-neutral-900 text-white p-1 rounded" name="stock" type="number" defaultValue={5} />
                </div>

                <button className="h-10 w-52 mt-4" type="submit">Submit</button>
            </form>
        </div>
    );
}
