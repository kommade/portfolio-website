import { LoadingComponent } from "@/components";
import { Suspense } from "react";
import { Login } from "./page-client";

export const experimental_ppr = true

export default function LoginWrapper() {
    return (
        <Suspense fallback={<LoadingComponent/>}>
            <Login />
        </Suspense>
    )
}