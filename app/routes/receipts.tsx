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
        <div className="p-4 bg-gray-50 space-y-4">
            {receipts.map((receipt, i) => (
                <div 
                    key={`receipt-${i}`} 
                    className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Receipt #{receipt.id}</h2>
                        <span className="text-gray-600">{new Date(receipt.date).toLocaleString()}</span>
                    </div>
                    
                    <div className="mb-4">
                        <div className="text-sm text-gray-500">Payment Method</div>
                        <div className="font-medium text-gray-700">{receipt.payment}</div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                        <div className="font-semibold text-gray-700">Items:</div>
                        {receipt.products.map((product, j) => (
                            <div 
                                key={`receipt-product-${j}`} 
                                className="flex justify-between text-gray-600"
                            >
                                <span>{product.name}</span>
                                <span>{product.quantity} x Rp. {product.price.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="text-right border-t pt-2">
                        <span className="text-xl font-bold text-gray-900">
                            Total: Rp. {receipt.products.reduce((acc, product) => acc + (product.price * product.quantity), 0).toLocaleString()}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
};