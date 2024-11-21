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

    // Calculate total profit
    const totalProfit = receipts.reduce((total, receipt) => {
        const receiptTotal = receipt.products.reduce((acc, product) => acc + (product.price * product.quantity), 0);
        return total + receiptTotal;
    }, 0);

    return (
        <div className="p-4 space-y-4">
            {/* Total Profit Display */}
            <div className="rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-center mb-4">
                <span className="text-2xl font-bold">
                    Total Profit: Rp. {totalProfit.toLocaleString()}
                </span>
            </div>

            {receipts.map((receipt, i) => (
                <div 
                    key={`receipt-${i}`} 
                    className="rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <h2 className="text-xl font-semibold">Receipt #{receipt.id}</h2>
                        <span>{new Date(receipt.date).toLocaleString()}</span>
                    </div>
                    
                    <div className="mb-4">
                        <div className="text-sm">Payment Method</div>
                        <div className="font-medium">{receipt.payment}</div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                        <div className="font-semibold">Items:</div>
                        {receipt.products.map((product, j) => (
                            <div 
                                key={`receipt-product-${j}`} 
                                className="flex justify-between"
                            >
                                <span>{product.name}</span>
                                <span>{product.quantity} x Rp. {product.price.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="text-right border-t pt-2">
                        <span className="text-xl font-bold">
                            Total: Rp. {receipt.products.reduce((acc, product) => acc + (product.price * product.quantity), 0).toLocaleString()}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
};