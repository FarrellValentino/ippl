import {
  Meta,
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";

import Header from "~/components/Header";
import db from "~/db";
import "~/tailwind.css";

export const meta: MetaFunction = () => [
    { title: "My Mart" },
];

export const loader = async (): Promise<null> => {
    if (!db.exists()) await db.reset();
    return null;
};

export default ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8">
                    <Header />
                    <Outlet />
                </div>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
};
