export const toCamelCase = (str: string): string => {
    return str.toLowerCase().split(" ").join("-");
};

export const camelToCapitalCase = (str: string): string => {
    return str.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
};

export const generateRandomColor = (): string => {
    // pastel range (150-255)
    const r = Math.floor(Math.random() * 106) + 150;
    const g = Math.floor(Math.random() * 106) + 150;
    const b = Math.floor(Math.random() * 106) + 150;

    const toHex = (value: number) => value.toString(16).padStart(2, "0");

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};


export default {
    toCamelCase,
    camelToCapitalCase,
    generateRandomColor,
};
