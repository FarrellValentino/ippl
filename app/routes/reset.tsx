import { type ActionFunctionArgs, redirect } from "@remix-run/node";
import db from "~/db";

/* TODO: visible on development only
 */

export const action = async ({ request }: ActionFunctionArgs) => {
    await db.reset();
    return redirect("/reset");
}

export default () => {
    return (
        <form action="/reset" method="POST" onSubmit={(e) => e.preventDefault()}>
            <button type="submit">Reset Database</button>
        </form>
    );
}
