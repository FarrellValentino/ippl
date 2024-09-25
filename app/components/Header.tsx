const menu: any[] = [
    {
        name: "Stock",
        link: "/stock",
    },
    {
        name: "Orders",
        link: "/orders",
    },
    {
        name: "History",
        link: "/history",
    },
]

export default function Header() {
    return (
        <header className="flex items-center justify-between">
            <div className="flex">
                <div>
                    <span>MyMart</span>
                </div>
                <div>
                    <input type="text" placeholder="Search" />
                </div>
            </div>
            <div>
                <ul className="flex flex-row">
                    {menu.map((m: any) => (
                        <li className="mr-2">{m.name}</li>
                    ))}
                </ul>
            </div>
        </header>
    );
}
