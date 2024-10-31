import { HiOutlineShoppingCart, HiOutlineSearch } from "react-icons/hi";
import { Link, useSearchParams } from "@remix-run/react";
import config from "~/config";

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
    const [searchParams, setSearchParams] = useSearchParams();

    return (
        <header className="flex items-center justify-between mx-2 py-5 border-neutral-800 border-b">
            <div className="flex items-center justify-center">
                <div className="flex items-center justify-center mr-4">
                    <HiOutlineShoppingCart className="mr-4" />
                    <Link to="/" className="text-lg">Home</Link>
                </div>
                <form className="ml-4 flex items-center justify-center rounded bg-neutral-900 p-1" onSubmit={(e) => e.preventDefault()}>
                    <HiOutlineSearch className="m-2" />
                    <input className="mx-2 py-1 bg-transparent outline-none" type="text" placeholder="Quick Search" onChange={(e) => {
                        const params = new URLSearchParams();
                        params.set(config.URL_SEARCH_PARAM, e.target.value);
                        setSearchParams(params, { preventScrollReset: true });
                    }} />
                </form>
            </div>
            <div>
                <ul className="flex flex-row">
                    {menu.map((m: any, i: number) => (
                        <li className="ml-8" key={i}>
                            <Link to={m.link} className="button">{m.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
}
