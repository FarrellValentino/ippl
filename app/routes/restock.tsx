import { useLoaderData } from "@remix-run/react";
import db, { type Category } from "~/db";

export const loader = async () => {
    return await db.getCategories();
};

export default () => {
    const categories = useLoaderData<typeof loader>();

    return (
        <>
            <br />
            <h1>Restock</h1>
            <form action="POST" onSubmit={(e) => e.preventDefault()}>
                <div className="my-2">
                    <label htmlFor="category">Category</label>
                    <br />
                    <select className="h-7 w-52 bg-neutral-900 text-white p-1 rounded" name="category">
                        {categories.map((category: Category, i: number) => 
                            <option key={`option-restock-${i}`} value={category.name}>{category.name}</option>
                        )}
                    </select>
                </div>

                <div className="my-2">
                    <label htmlFor="name">Name</label>
                    <br />
                    <input className="h-7 w-52 bg-neutral-900 text-white p-1 rounded" name="name" type="text" />
                </div>

                <div className="my-2">
                    <label htmlFor="price">Price</label>
                    <br />
                    <input className="h-7 w-52 bg-neutral-900 text-white p-1 rounded" name="price" type="number" defaultValue={2000} />
                </div>

                <button type="submit">Submit</button>
            </form>
        </>
    );
}
