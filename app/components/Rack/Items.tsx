import { type RackItem, type RackLabel, rackItems } from "~/data/racks";

export default function RackItems({ label }: { label: RackLabel }) {
    return (
        <div>
            {rackItems[label.name].map((item: RackItem) =>
                <div>
                    <span>{item.name}: {item.price}</span>
                </div>
            )}
        </div>
    );
}
