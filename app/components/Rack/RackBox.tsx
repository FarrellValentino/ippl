import { Category } from "~/.server/db";

export default ({ category, onClick }: { category: Category, onClick: (category: Category) => void }) => {
    return (
        <div className="relative size-36 text-black cursor-pointer" style={{background: category.color}} onClick={() => onClick(category)}>
            <p className="text-center">{category.name}</p>
            <span className="absolute w-11 h-2.5 rounded-lg cursor-default bg-black bottom-1.5 left-0 right-0 mx-auto"></span>
        </div>
    );
}
