import { describe, expect, test } from "vitest";
import { AssertionError } from "assert";
import * as db from "app/db";

describe("Database tests", async () => {
    db.temp("tests/mymart.temp.db");
    await db.reset();

    test("Wrong data format", async () => {
        try { expect(await db.addCategory({ name: "124" })).not.toBeUndefined() } catch (e) { expect(e).toBeInstanceOf(AssertionError) }
    });

    test("Adding new categories", async () => {
        expect(await db.addCategory({ name: "Echidna" })).toBeUndefined();
        expect((await db.getCategories()).find((c) => c.name === "Echidna")).not.toBeUndefined();

        expect(await db.addCategory({ name: "Hysteria" })).toBeUndefined();
        expect((await db.getCategories()).find((c) => c.name === "Hysteria")).not.toBeUndefined();
    });

    test("No category should be found", async () => {
        const categories = (await db.getCategories());
        expect(categories.find((c) => c.name === "2e2")).toBeUndefined();
        expect(categories.find((c) => c.name === "???")).toBeUndefined();
        expect(categories.find((c) => c.name === "69420")).toBeUndefined();
    });
});
