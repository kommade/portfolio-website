import { LoadingComponent } from "@/components";
import { Suspense } from "react";
import { New } from "./page-client";

export const experimental_ppr = true

export default async function NewWrapper() {
    return (
        <Suspense fallback={<LoadingComponent/>}>
            <New />
        </Suspense>
    )
}