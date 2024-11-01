import { useLoaderData } from "@remix-run/react";
import db, { type Category } from "~/db";

export const loader = async () => {
    return await db.getCategories();
};

export default () => {
    const categories = useLoaderData<typeof loader>();

    return (
        <>
            <h1>Restock</h1>
            <form action="POST" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="category">Category</label>

                <select name="category">
                    {categories.map((category: Category, i: number) => 
                        <option key={`option-restock-${i}`} value={category.name}>{category.name}</option>
                    )}
                </select>

                <br />
                <label htmlFor="name">Name</label>
                <input name="name" type="text" />

                <br />

                <label htmlFor="price">Price</label>
                <input name="price" type="number" defaultValue={2000} />

                <br />

                <button type="submit">Submit</button>
            </form>
        </>
    );
}
