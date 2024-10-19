import type { RackLabel } from "~/data/racks";

export default function Rack({ label, onClick }: { label: RackLabel, onClick: (label: RackLabel) => void }) {
    return (
        <div className="relative size-36 text-black cursor-pointer" style={{background: label.color}} onClick={() => onClick(label)}>
            <p className="text-center">{label.name}</p>
            <span className="absolute w-11 h-2.5 rounded-lg cursor-default bg-black bottom-1.5 left-0 right-0 mx-auto"></span>
        </div>
    );
}
