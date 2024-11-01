export const toCamelCase = (str: string): string => {
    return str.toLowerCase().split(" ").join("-");
};

export const camelToCapitalCase = (str: string): string => {
    return str.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
};

export default {
    toCamelCase,
    camelToCapitalCase,
};
