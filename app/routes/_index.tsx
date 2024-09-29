import type { MetaFunction } from "@remix-run/node";
import Rack from "~/components/Rack";
import { type RackItem, racks } from "~/data/racks";

export const meta: MetaFunction = () => {
    return [
        { title: "My Mart" },
        { name: "description", content: "My Mart" },
    ];
};

export default function Index() {
    return (
        <div className="flex mt-6">
            <div className="w-9/12 h-80 overflow-y-scroll flex flex-wrap content-start gap-2">
                {racks.map((item: RackItem, i: number) => (
                    <Rack key={`Rack @${i}`} item={item} />
                ))}
            </div>
            <div className="w-3/12 bg-neutral-900">
                <p className="text-center my-2.5">Receipt</p>
                <hr className="border-dashed mx-4" />
            </div>
        </div>
    );
}
