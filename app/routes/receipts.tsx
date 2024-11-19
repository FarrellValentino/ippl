import { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import db, { type Receipt } from "~/db";

export const loader = async () => {
    return await db.getReceipts();
};

export const meta: MetaFunction = () => [
    { title: "My Mart - Receipt" },
];

export default () => {
    const receipts = useLoaderData<typeof loader>();

    return (
        <div>
            {receipts.map((receipt: any, i: number) => (
                <ul key={`receipt-${i}`}>
                    <li>Identifier: {receipt.id}</li>
                    {receipt.products.map((product: any, j: number) => (
                        <ul key={`receipt-product-${j}`}>
                            <li>Name: {product.name}</li>
                            <li>Price: {product.price}</li>
                            <li>Quantity: {product.quantity}</li>
                        </ul>
                    ))}
                    <li>Total: Rp. {receipt.products.reduce((acc: number, product: any) => acc + (product.price * product.quantity), 0)}</li>
                    <br />
                </ul>
            ))}
        </div>
    );
};
