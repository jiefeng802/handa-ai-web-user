import { redirect } from "next/navigation";

export const redirectToPreviousPageOrSearchPage = (): void => {
    redirect("/search");
};
