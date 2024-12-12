/* TODO: use sql transactions
 */

import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { randomUUID } from "crypto";
import fs from "fs";
import utils, { groupBy } from "~/utils";
import config from "~/config";
import assert from "assert";

/* enum */
export type Payment = "Cash" | "Credit Card" | "QRIS";

export type Rack = {
    id: number,
    category: string,
    name: string,
    price: number,
    stock: number,
};

export type Category = {
    name: string,
    color: string,
};

export type ReceiptProduct = Pick<Rack, "name" | "price"> & {
    id: number,
    receiptId: string,
    quantity: number,
}

export type Receipt = {
    id: string,
    date: Date,
    payment: Payment,
    products: ReceiptProduct[],
};

let __filename: string = config.DB_FILEPATH;

export const temp = (filename: string) => {
    __filename = filename;
};

/* Database open wrapper
 */
const __open = async <T>(callback: (db: Database<sqlite3.Database, sqlite3.Statement>) => Promise<T>): Promise<T> => {
    const db = await open({filename: __filename, driver: sqlite3.Database});
    const value = await callback(db);
    await db.close();
    return value;
};

export const reset = async () => {
    await __open(async (db) => {
        await db.run("CREATE TABLE IF NOT EXISTS Category (name VARCHAR(32) PRIMARY KEY UNIQUE NOT NULL, color VARCHAR(16))");
        await db.run("INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", "Snacks", "#97FA9A");
        await db.run("INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", "Beverages", "#79B8F4");
        await db.run("INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", "Dairy Products", "#FCC5D9");
        await db.run("INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", "Bakery", "#D8BBFF");
        await db.run("INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", "Frozen Foods", "#FFD6A5");
        await db.run("INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", "Produce", "#FDFFB6");
        await db.run("INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", "Dry Goods", "#CAFFBF");
        await db.run("INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", "Personal Care", "#FFADAD");
        await db.run("INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", "Household Essentials", "#9BF6FF");
        await db.run("INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", "Condiments", "#D1B2A1");

        await db.run("CREATE TABLE IF NOT EXISTS Racks (id INTEGER PRIMARY KEY AUTOINCREMENT, category VARCHAR(32) REFERENCES Category(category), name VARCHAR(32) UNIQUE NOT NULL, price REAL, stock INTEGER)");
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Potato Chips", 15000, 25);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Cheese Crackers", 12000, 30);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Peanut Butter Cookies", 17000, 20);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Seaweed Snacks", 8000, 40);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Trail Mix", 25000, 15);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Pocky Sticks", 13000, 18);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Chocolate Bars", 20000, 22);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Granola Bars", 14000, 35);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Rice Crackers", 10000, 50);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Fruit Gummies", 9000, 45);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Popcorn", 15000, 28);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Beef Jerky", 30000, 12);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Pretzels", 11000, 38);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Chocolate Chip Cookies", 18000, 25);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Yogurt Covered Raisins", 16000, 20);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Almond Biscotti", 19000, 15);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Caramel Popcorn", 18000, 30);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Wasabi Peas", 15000, 25);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Honey Roasted Peanuts", 13000, 40);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Salted Cashews", 20000, 18);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Veggie Chips", 17000, 22);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Sweet Potato Chips", 14000, 35);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Banana Chips", 9000, 50);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Cheese Puffs", 12000, 28);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Ginger Cookies", 16000, 20);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Protein Bars", 25000, 15);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Coconut Chips", 11000, 40);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Dried Mango Slices", 15000, 18);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Sea Salt Crackers", 10000, 42);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Mini Donuts", 20000, 20);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Chocolate Wafers", 17000, 25);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Apple Chips", 14000, 30);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Salted Almonds", 19000, 22);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Chewy Candies", 8000, 60);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Trail Granola Mix", 22000, 12);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Lemon Cookies", 16000, 24);


        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Beverages", "Green Tea", 12000, 35);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Beverages", "Orange Juice", 15000, 25);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Beverages", "Bottled Water", 5000, 50);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Beverages", "Iced Coffee", 18000, 20);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Beverages", "Soda", 10000, 45);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Beverages", "Lemonade", 12000, 25);

        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Dairy Products", "Whole Milk", 15000, 20);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Dairy Products", "Yogurt", 8000, 30);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Dairy Products", "Cheddar Cheese", 35000, 10);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Dairy Products", "Butter", 25000, 15);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Dairy Products", "Cream Cheese", 20000, 12);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Dairy Products", "Chocolate Milk", 12000, 25);

        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Bakery", "Croissant", 15000, 18);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Bakery", "Bagel", 12000, 20);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Bakery", "Baguette", 10000, 12);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Bakery", "Danish Pastry", 13000, 15);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Bakery", "Donut", 8000, 25);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Bakery", "Muffin", 9000, 20);

        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Frozen Foods", "Frozen Pizza", 45000, 10);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Frozen Foods", "Ice Cream", 25000, 15);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Frozen Foods", "Frozen Vegetables", 12000, 20);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Frozen Foods", "Chicken Nuggets", 30000, 12);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Frozen Foods", "French Fries", 20000, 18);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Frozen Foods", "Fish Sticks", 28000, 10);

        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Produce", "Bananas", 15000, 25);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Produce", "Apples", 20000, 30);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Produce", "Carrots", 8000, 40);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Produce", "Spinach", 10000, 20);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Produce", "Tomatoes", 12000, 35);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Produce", "Potatoes", 9000, 40);

        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Dry Goods", "Rice", 60000, 10);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Dry Goods", "Pasta", 15000, 25);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Dry Goods", "Flour", 12000, 15);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Dry Goods", "Sugar", 11000, 20);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Dry Goods", "Lentils", 9000, 18);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Dry Goods", "Beans", 10000, 15);

        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Personal Care", "Shampoo", 30000, 50);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Personal Care", "Toothpaste", 15000, 40);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Personal Care", "Soap", 8000, 100);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Personal Care", "Deodorant", 20000, 30);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Personal Care", "Lotion", 25000, 25);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Personal Care", "Shaving Cream", 22000, 20);

        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Household Essentials", "Dish Soap", 12000, 50);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Household Essentials", "Laundry Detergent", 20000, 40);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Household Essentials", "Toilet Paper", 15000, 80);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Household Essentials", "Paper Towels", 18000, 60);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Household Essentials", "Trash Bags", 10000, 100);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Household Essentials", "Cleaning Spray", 25000, 30);

        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Condiments", "Soy Sauce", 17000, 60);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Condiments", "Chili Sauce", 12000, 50);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Condiments", "Mayonnaise", 20000, 40);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Condiments", "Ketchup", 15000, 70);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Condiments", "Mustard", 18000, 35);
        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Condiments", "BBQ Sauce", 22000, 45);

        await db.run("CREATE TABLE IF NOT EXISTS Receipt (id VARCHAR(64) PRIMARY KEY NOT NULL, date DATETIME, payment VARCHAR(32))");
        await db.run("CREATE TABLE IF NOT EXISTS ReceiptProducts (id INTEGER PRIMARY KEY AUTOINCREMENT, receiptId VARCHAR(64) REFERENCES Receipt(receiptId) NOT NULL, name VARCHAR(32) NOT NULL, quantity INTEGER NOT NULL, price INTEGER NOT NULL)");
    });
};

export const getRacks = async (): Promise<Rack[]> => {
    return await __open(async (db) => await db.all("SELECT * FROM Racks"));
}

export const getRacksByCategory = async (category: string): Promise<Rack[]> => {
    return await __open(async (db) => await db.all("SELECT * FROM Racks WHERE category = ?", category));
}

export const getCategories = async (): Promise<Category[]> => {
    return await __open(async (db) => await db.all("SELECT * FROM Category"));
}

export const addCategory = async (category: Partial<Category>): Promise<any> => {
    assert(isNaN(Number(category.name)));

    return await __open(async (db) => {
        await db.run(
            "INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", 
            category.name, 
            category.color || utils.generateRandomColor()
        );
    });
}

export const addProduct = async (product: Partial<Rack>): Promise<any> => {
    assert(isNaN(Number(product.name)));
    assert(product.stock !== undefined && product.stock >= 0);

    return await __open(async (db) => {
        const category = await db.get("SELECT * FROM Category WHERE name = ?", product.category);

        if (!category) {
            await db.run("INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", product.category, utils.generateRandomColor());
        }

        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", product.category, product.name, product.price, product.stock);
    });
}

export const updateProduct = async (product: Partial<Rack>): Promise<any> => {
    assert(isNaN(Number(product.name)));
    assert(product.stock !== undefined && product.stock >= 0);

    return await __open(async (db) => {
        await db.run("UPDATE Racks SET name = ?, price = ?, stock = ? WHERE id = ?", product.name, product.price, product.stock, product.id);
    });
}

export const checkoutProducts = async (products: Partial<Rack & { quantity: number }>[]): Promise<any> => {
    return await __open(async (db) => {
        for (const product of products) {
            const stock = await db.get("SELECT stock FROM Racks WHERE id = ?", product.id);

            if (!stock) throw new Error("checkoutProducts: `stock` undefined");
            if (!product.quantity) throw new Error("checkoutProducts: `product.quantity` undefined");

            if (stock - product.quantity < 0) {
                // throw new Error(`checkoutProducts: (${product.name}) requested too much stock`);
                return false;
            }
        }

        for (const product of products) {
            if (!product.quantity) throw new Error("checkoutProducts: `product.quantity` undefined");
            await db.run("UPDATE Racks SET stock = stock - ? WHERE id = ?", product.quantity, product.id);
        }

        const receiptId = randomUUID();
        await db.run("INSERT OR IGNORE INTO Receipt (id, date, payment) VALUES (?, ?, ?)", receiptId, new Date().toISOString(), "Cash" as Payment);

        for (const product of products) {
            await db.run("INSERT OR IGNORE INTO ReceiptProducts (receiptId, name, quantity, price) VALUES (?, ?, ?, ?)", 
                receiptId, 
                product.name,
                product.quantity,
                product.price);
        }

        return true;
    });
}

export const getReceipts = async (): Promise<Receipt[]> => {
    return await __open(async (db) => {
        const receipts = await db.all("SELECT * FROM Receipt JOIN ReceiptProducts ON ReceiptProducts.receiptId = Receipt.id");
        const grouped = Object.values(groupBy(receipts, (receipt: Partial<Receipt & ReceiptProduct>) => receipt.receiptId));
        return grouped.map((receipts: Partial<Receipt & ReceiptProduct>[]): Receipt => {
            const receipt = receipts[0];
            assert(receipt && receipt.receiptId && receipt.date && receipt.payment);

            return { 
                id: receipt.receiptId,
                date: receipt.date,
                payment: receipt.payment,
                products: receipts.map((receipt: Partial<Receipt & ReceiptProduct>): ReceiptProduct => {
                    assert(receipt.id && receipt.receiptId && receipt.name && receipt.quantity && receipt.price);

                    return { 
                        id: receipt.id, 
                        receiptId: receipt.receiptId,
                        name: receipt.name, 
                        quantity: receipt.quantity,
                        price: receipt.price,
                    }
                })
            };
        });
    });
}

export const addReceipt = async (products: Omit<ReceiptProduct, "receiptId">[]): Promise<any> => {
    assert(false);
    return await __open(async (db) => null);
}

export const exists = (): boolean => fs.existsSync(config.DB_FILEPATH);

const db = {
    temp,
    reset,
    getRacks,
    getCategories,
    getRacksByCategory,
    addProduct,
    updateProduct,
    addCategory,
    checkoutProducts,
    getReceipts,
    exists,
};

export default db;

