import { describe, expect, test } from "vitest";
import * as utils from "app/utils";

describe("Utility tests", () => {
    test("Converting to Camel Case", () => {
        expect(utils.toCamelCase("beverage goods")).toBe("beverage-goods");
        expect(utils.toCamelCase("bEverage goods")).toBe("beverage-goods");
        expect(utils.toCamelCase("beverage goOds")).toBe("beverage-goods");
        expect(utils.toCamelCase("beverage-goods")).toBe("beverage-goods");
    });

    test("Converting to Capital Case", () => {
        expect(utils.toCapitalCase("beverage goods")).toBe("Beverage Goods");
        expect(utils.toCapitalCase("bEverage goods")).toBe("Beverage Goods");
        expect(utils.toCapitalCase("beverage goOds")).toBe("Beverage Goods");
        expect(utils.toCapitalCase("beverage-goods")).toBe("Beverage-goods");
    });
});
