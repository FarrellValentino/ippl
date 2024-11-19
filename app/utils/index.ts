export const toCamelCase = (str: string): string => {
    return str.toLowerCase().split(" ").join("-");
};

export const toCapitalCase = (str: string): string => {
    return str.toLowerCase().split(" ").map((word) => {
        if (!word) {
            return word;
        }

        return word[0].toUpperCase() + word.slice(1);
    }).join(" ");
};

export const camelToCapitalCase = (str: string): string => {
    return toCapitalCase(str.split("-").join(" "));
};

export const generateRandomColor = (): string => {
    // pastel range (150-255)
    const r = Math.floor(Math.random() * 106) + 150;
    const g = Math.floor(Math.random() * 106) + 150;
    const b = Math.floor(Math.random() * 106) + 150;

    const toHex = (value: number) => value.toString(16).padStart(2, "0");

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const groupBy = (arr: unknown[], callback: Function): Object => {
    const group: { [key: string | number | symbol]: unknown[] } = {};

    for (const item of arr) {
        const key = callback(item);
        if (!(key in group)) {
            group[key] = [];
        }

        group[key].push(item);
    }

    return group;
};

export default {
    toCamelCase,
    toCapitalCase,
    camelToCapitalCase,
    generateRandomColor,
    groupBy,
};
