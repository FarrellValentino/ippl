import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [
        { title: "My Mart" },
        { name: "description", content: "My Mart" },
    ];
};

export default function Index() {
    return (
        <>
        </>
    );
}
