import { json, useLoaderData, MetaFunction } from "@remix-run/react";
import db from "~/db";

const boxes = [
    "/assets/box-5.png",
    "/assets/box-3.png",
    "/assets/box-8.png",
];

export const meta: MetaFunction = () => [
    { title: "My Mart - Statistics" },
];

export const loader = async () => {
    return json({ racks: await db.getRacks() });
};

export default () => {
    const items = useLoaderData<typeof loader>();

    const getMostFilledRack = (): string => {
        let hmap: {[key: string]: number} = {};

        for (const item of items.racks) {
            if (!(item.category in hmap)) {
                hmap[item.category] = 0;
            }

            hmap[item.category] += item.stock;
        }

        const sortedEntries = Object.entries(hmap).sort((a, b) => b[1] - a[1]);
        return sortedEntries[0][0];
    };

    const getMostStockedItem = (): string => {
        let most = items.racks[0];

        for (const item of items.racks) {
            if (item.stock > most.stock) {
                most = item;
            }
        }

        return most.name;
    };

    return (
        <>
            <div className="my-28">
                <h1 className="m-5 text-6xl text-center">My Mart &#8480;</h1>
                <p className="text-neutral-400 font-bold text-center leading-tight tracking-tighter">STREAMLINED ONLINE AGENT <br /> SERVICE FOR RETAILS</p>

                <div className="flex justify-center items-center my-5">
                    {boxes.map((path: string, i: number) => 
                        <img src={path}
                             className="mx-2"
                             height={60}
                             width={60}
                             alt=""
                             key={`box-${i}`} />
                    )}
                </div>
            </div>
            <div>
                <h2 className="text-3xl text-center">Statistics – past 6 months</h2>
                <p className="text-center">Total racks: {items.racks.length}</p>
                <p className="text-center">Most filled rack: <span style={{color: "#97FA9A"}}>{getMostFilledRack()}</span></p>
                <p className="text-center">Most stocked item: <span style={{color: "#79B8F4"}}>{getMostStockedItem()}</span></p>
            </div>
            <div className="mt-14">
                <p className="text-center">support: admin@mymart.com</p>
                <p className="text-center">Thank you for trusting our service.</p>
            </div>
        </>
    );
}