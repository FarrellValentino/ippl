import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
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

export const reset = async () => {
    const db = await open({filename: config.DB_FILEPATH, driver: sqlite3.Database});

    await db.run("CREATE TABLE IF NOT EXISTS Category (name VARCHAR(32) PRIMARY KEY UNIQUE NOT NULL, color VARCHAR(16))");
    await db.run("INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", "Snacks", "#97FA9A");
    await db.run("INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", "Chocolates", "#79B8F4");
    await db.run("INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", "Sandwich", "#FCC5D9");
    await db.run("INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", "Cocktails", "#D8BBFF");
    await db.run("INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", "Soda", "#FFD6A5");
    await db.run("INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", "Noodles", "#FDFFB6");
    await db.run("INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", "Apples", "#CAFFBF");
    await db.run("INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", "Juice", "#FFADAD");
    await db.run("INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", "Cereal", "#9BF6FF");
    await db.run("INSERT OR IGNORE INTO Category (name, color) VALUES (?, ?)", "Rice", "#D1B2A1");

    await db.run("CREATE TABLE IF NOT EXISTS Racks (id INTEGER PRIMARY KEY AUTOINCREMENT, category VARCHAR(32) REFERENCES Category(category), name VARCHAR(32) UNIQUE NOT NULL, price REAL, stock INTEGER)");
    await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Ritz", 21.900, 7);
    await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "M&Ms", 10.900, 57);
    await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Lay's", 12.900, 32);
    await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Oatmeal", 10.900, 20);
    await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Snacks", "Twinkies", 10.900, 12);
    await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Chocolates", "KitKat", 13500, 20);
    await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Chocolates", "Cadbury Dairy Milk", 22500, 15);
    await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Chocolates", "Toblerone", 45000, 10);
    await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Chocolates", "SilverQueen", 27000, 8);
    await db.run("INSERT OR IGNORE INTO Racks (category, name, price, stock) VALUES (?, ?, ?, ?)", "Chocolates", "Ferrero Rocher", 75000, 5);

    await db.close();
};

export const getRacks = async (): Promise<Rack[]> => {
    const db = await open({filename: config.DB_FILEPATH, driver: sqlite3.Database});
    const racks: Rack[] = await db.all("SELECT * FROM Racks");
    await db.close();
    return racks;
};

export const getRacksByCategory = async (category: string): Promise<Rack[]> => {
    const db = await open({filename: config.DB_FILEPATH, driver: sqlite3.Database});
    const racks: Rack[] = await db.all("SELECT * FROM Racks WHERE category = ?", category);
    await db.close();
    return racks;
};

export const getCategories = async (): Promise<Category[]> => {
    const db = await open({filename: config.DB_FILEPATH, driver: sqlite3.Database});
    const categories: Category[] = await db.all("SELECT * FROM Category");
    await db.close();
    return categories;
};

export const exists = (): boolean => {
    return fs.existsSync(config.DB_FILEPATH);
};

const db = { reset, getRacks, getCategories, getRacksByCategory, exists };
export default db;
