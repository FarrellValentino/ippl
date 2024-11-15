import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import fs from "fs";
import utils from "~/utils";
import config from "~/config";

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

/* Database open wrapper
 */
const __open = async <T>(callback: (db: Database<sqlite3.Database, sqlite3.Statement>) => Promise<T>): Promise<T> => {
    const db = await open({filename: config.DB_FILEPATH, driver: sqlite3.Database});
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
    });
};

export const getRacks = async (): Promise<Rack[]> => {
    return await __open(async (db) => await db.all("SELECT * FROM Racks"));
}

export const getRacksByCategory = async (category: string): Promise<Rack[]> => {
    console.log(category);
    return await __open(async (db) => await db.all("SELECT * FROM Racks WHERE category = ?", category));
}

export const getCategories = async (): Promise<Category[]> => {
    return await __open(async (db) => await db.all("SELECT * FROM Category"));
}

export const addCategory = async (category: Partial<Category>): Promise<any> => {
    return await __open(async (db) => {
        await db.run(
            "INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", 
            category.name, 
            category.color || utils.generateRandomColor()
        );
    });
}

export const addProduct = async (product: Partial<Rack>): Promise<any> => {
    return await __open(async (db) => {
        const category = await db.get("SELECT * FROM Category WHERE name = ?", product.category);
        console.log(category);

        if (!category) {
            console.log("??", category);
            await db.run("INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", product.category, utils.generateRandomColor());
        }

        await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", product.category, product.name, product.price, product.stock);
    });
}

export const updateProduct = async (product: Partial<Rack>): Promise<any> => {
    return await __open(async (db) => {
        await db.run("UPDATE Racks SET name = ?, price = ?, stock = ? WHERE id = ?", product.name, product.price, product.stock, product.id);
    });
}

export const exists = (): boolean => fs.existsSync(config.DB_FILEPATH);

const db = { reset, getRacks, getCategories, getRacksByCategory, addProduct, updateProduct, addCategory, exists };

export default db;

