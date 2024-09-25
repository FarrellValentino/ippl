import { HiOutlineShoppingCart, HiOutlineSearch } from "react-icons/hi";
import { Link } from "@remix-run/react";

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
        <header className="flex items-center justify-between mx-2 py-5 border-neutral-800 border-b">
            <div className="flex items-center justify-center">
                <div className="flex items-center justify-center mr-4">
                    <HiOutlineShoppingCart className="mr-4" />
                    <span className="text-lg">Mart</span>
                </div>
                <form className="ml-4 flex items-center justify-center rounded bg-neutral-900 p-1" onSubmit={(e) => e.preventDefault()}>
                        <HiOutlineSearch className="m-2" />
                        <input className="mx-2 py-1 bg-transparent outline-none" type="text" placeholder="Quick Search" />
                </form>
            </div>
            <div>
                <ul className="flex flex-row">
                    {menu.map((m: any, i: number) => (
                        <li className="ml-8" key={i}>
                            <Link to={m.link}>{m.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
}
