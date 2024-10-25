import db, { Category } from "~/.server/db";

export const loader = async () => {
    return db.getRacks();
}

export default ({ category }: { category: Category }) => {
    return (
        <div>
            {/* {rackItems[label.name].map((item: RackItem) =>
                <div>
                    <span>{item.name}: {item.price}</span>
                </div>
            )} */}
        </div>
    );
}
