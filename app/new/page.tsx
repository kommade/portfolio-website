import { LoadingComponent } from "@/components";
import { getRole } from "@/functions/actions";
import { Suspense } from "react";
import { New } from "./page-client";

export default async function NewWrapper() {
    return (
        <Suspense fallback={<LoadingComponent/>}>
            <New />
        </Suspense>
    )
}