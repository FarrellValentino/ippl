import {
  Meta,
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";
import { ReactLenis as Lenis } from "lenis/react";

import Header from "~/components/Header";
import db from "~/db";

import "~/tailwind.css";
import "lenis/dist/lenis.css";

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
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                <Links />
            </head>
            <body>
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8">
                    <Header />
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
