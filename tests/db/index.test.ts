import { describe, expect, test } from "vitest";
import { AssertionError } from "assert";
import db from "app/db";

describe("Database tests", async () => {
    await db.use("tests/mymart.temp.db");

    test("Newly created temporary db exists", async () => {
        expect(db.exists("tests/mymart.temp.db")).toBe(true);
    });

    test("Adding numeric category", async () => {
        try { expect(await db.addCategory({ name: "124" })).not.toBeUndefined() } catch (e) { expect(e).toBeInstanceOf(AssertionError) }
        try { expect(await db.addCategory({ name: "69420" })).not.toBeUndefined() } catch (e) { expect(e).toBeInstanceOf(AssertionError) }
    });

    test("Adding new categories", async () => {
        expect(await db.addCategory({ name: "Echidna" })).toBeUndefined();
        expect((await db.getCategories()).find((c) => c.name === "Echidna")).not.toBeUndefined();

        expect(await db.addCategory({ name: "Hysteria" })).toBeUndefined();
        expect((await db.getCategories()).find((c) => c.name === "Hysteria")).not.toBeUndefined();
    });

    test("No category should be found", async () => {
        const categories = await db.getCategories();
        expect(categories).not.toHaveLength(0);
        expect(categories.find((c) => c.name === "2e2")).toBeUndefined();
        expect(categories.find((c) => c.name === "???")).toBeUndefined();
        expect(categories.find((c) => c.name === "69420")).toBeUndefined();
    });

    test("Adding numeric products", async () => {
        try { expect(await db.addProduct({ name: "555", stock: 1, price: 10_000, category: "" })).not.toBeUndefined() } catch (e) { expect(e).toBeInstanceOf(AssertionError) }
        try { expect(await db.addProduct({ name: "69420", stock: 1, price: 10_000, category: "" })).not.toBeUndefined() } catch (e) { expect(e).toBeInstanceOf(AssertionError) }
    });

    test("Adding products with negative stock", async () => {
        try { expect(await db.addProduct({ name: "Jack Atlas", stock: -1, price: 10_000, category: "" })).not.toBeUndefined() } catch (e) { expect(e).toBeInstanceOf(AssertionError) }
        try { expect(await db.addProduct({ name: "Jack Daniel's", stock: -69420, price: 10_000, category: "" })).not.toBeUndefined() } catch (e) { expect(e).toBeInstanceOf(AssertionError) }
    });

    test("Adding products with unknown category", async () => {
        await db.addProduct({ name: "Jack Atlas", price: 20_000, stock: 1, category: "Booze" });
        await db.addProduct({ name: "Jack Daniel's", price: 29_000, stock: 1, category: "booze" });

        const categories = await db.getCategories();
        expect(categories).not.toHaveLength(0);
        expect(categories.find((c) => c.name === "Booze")).not.toBeUndefined();
        expect(categories.find((c) => c.name === "booze")).toBeUndefined();
    });

    test("Update a product", async () => {
        let products = await db.getRacksByCategory("Booze");
        let productsLength = products.length;
        expect(products).not.toHaveLength(0);

        let oldProduct = products[0];
        expect(await db.updateProduct({ ...oldProduct, name: "Sempurna" })).toBeUndefined();

        products = await db.getRacksByCategory("Booze");
        expect(products).not.toHaveLength(0);

        expect(products.length).toEqual(productsLength);
        expect(products.find((p) => p.name === "Sempurna")).not.toBeUndefined();
        expect(products.find((p) => p.name === oldProduct.name)).toBeUndefined();
    });

    test("Failed updating a product", async () => {
        let products = await db.getRacksByCategory("Booze");
        let productsLength = products.length;
        expect(products).not.toHaveLength(0);

        let oldProduct = products[0];
        try { expect(await db.updateProduct({ ...oldProduct, name: "69" })).not.toBeUndefined() } catch (e) { expect(e).toBeInstanceOf(AssertionError) }

        products = await db.getRacksByCategory("Booze");
        expect(products).not.toHaveLength(0);

        expect(products.length).toEqual(productsLength);
        expect(products.find((p) => p.name === oldProduct.name)).not.toBeUndefined();
        expect(products.find((p) => p.name === "69")).toBeUndefined();
    });

    test("Newly created temporary db removed", async () => {
        db.remove();
        expect(db.exists()).toBe(false);
    });
});
