export type RackLabel = {
    name: string,
    color: string,
};

export const racks: RackLabel[] = [
    {
        name: "Snacks",
        color: "#97FA9A",
    },
    {
        name: "Chocolates",
        color: "#79B8F4",
    },
    {
        name: "Sandwich",
        color: "#FCC5D9",
    },
    {
        name: "Cocktails",
        color: "#D8BBFF",
    },
    {
        name: "Soda",
        color: "#FFD6A5",
    },
    {
        name: "Noodles",
        color: "#FDFFB6",
    },
    {
        name: "Apples",
        color: "#CAFFBF",
    },
    {
        name: "Juice",
        color: "#FFADAD",
    },
    {
        name: "Cereal",
        color: "#9BF6FF",
    },
    {
        name: "Rice",
        color: "#D1B2A1",
    }
];

export type RackItem = {
    // TODO: add more information
    name: string,
    price: number,
};

export const rackItems: Record<string, RackItem[]> = {
    "Snacks": [
        { name: "Ritz", price: 25 },
        { name: "M&Ms", price: 25 },
        { name: "Lay's", price: 25 },
        { name: "Oreo", price: 25 },
        { name: "Oatmeal", price: 25 },
        { name: "Twinkies", price: 25 },
    ],
    "Chocolates": [
        { name: "Reese's", price: 25 },
        { name: "Hersey's", price: 25 },
        { name: "Snickers", price: 25 },
        { name: "KitKat", price: 25 },
    ],
    "Sandwich": [],
    "Cocktails": [],
    "Soda": [],
    "Noodles": [],
    "Apples": [],
    "Juice": [],
    "Cereal": [],
    "Rice": [],
};
