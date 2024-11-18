import {
  Meta,
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  redirect,
} from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";
import { ReactLenis as Lenis } from "lenis/react";

import Header from "~/components/Header";
import db, { Category } from "~/db";
import utils from "~/utils";

import "~/tailwind.css";
import "lenis/dist/lenis.css";
import config from "./config";

export const meta: MetaFunction = () => [
    { title: "My Mart" },
];

export const loader = async () => {
    if (!db.exists()) {
        await db.reset();
        return redirect("/");
    }

    return await db.getCategories();
};

export default ({ children }: { children: React.ReactNode }) => {
    const categories = useLoaderData<typeof loader>();
    const menu: any[] = [
        {
            label: "Stock",
            link: `/stock${!categories.length ? '' : `?${config.URL_ACTIVE_RACK_PARAM}=${utils.toCamelCase(categories[0].name)}`}`,
        },
        {
            label: "Restock",
            link: "/restock",
        },
        {
            label: "Orders",
            link: "/orders",
        },
    ];

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                <Links />
            </head>
            <body>
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8">
                    <Header menu={menu} />
                    <Lenis root>
                        <Outlet />
                    </Lenis>
                </div>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
};
