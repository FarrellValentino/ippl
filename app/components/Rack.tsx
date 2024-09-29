import type { RackItem } from "~/data/racks";

export default function Rack({ item }: { item: RackItem }) {
    // <div className="relative size-36 text-black" style={{background: item.color}}>
    // <div className="relative size-36 bg-neutral-800" style={{color: item.color}}>
    return (
        <div className="relative size-36 text-black cursor-pointer" style={{background: item.color}}>
            <p className="text-center">{item.name}</p>
            <span className="absolute w-11 h-2.5 rounded-lg cursor-default bg-black bottom-1.5 left-0 right-0 mx-auto"></span>
        </div>
    );
}
