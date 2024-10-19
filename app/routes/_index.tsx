import type { MetaFunction } from "@remix-run/node";
import Rack from "~/components/Rack/Rack";
import RackItems from "~/components/Rack/Items";
import { type RackLabel, racks } from "~/data/racks";
import { useState } from "react";

export const meta: MetaFunction = () => {
    return [
        { title: "My Mart" },
        { name: "description", content: "My Mart" },
    ];
};

export default function Index() {
    const [label, setLabel]: [RackLabel, Function] = useState(racks[0]);

    return (
        <div>
            <div className="flex mt-6">
                <div className="w-9/12 h-80 overflow-y-scroll flex flex-wrap content-start gap-2">
                    {racks.map((label: RackLabel, i: number) => (
                        <Rack key={`Rack @${i}`} label={label} onClick={(label) => setLabel((_: RackLabel) => label)} />
                    ))}
                </div>
                <div className="w-3/12 bg-neutral-900">
                    <p className="text-center my-2.5">Receipt</p>
                    <hr className="border-dashed mx-4" />
                </div>
            </div>
            <RackItems label={label} />
        </div>
    );
}
