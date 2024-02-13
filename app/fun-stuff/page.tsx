"use client";

import { HeaderComponent, MessageDisplayComponent, LoadingComponent, FooterComponent } from "@/components";
import { getFunStuff, getRole } from "@/functions/actions";
import React, { Suspense } from 'react';
import { FunStuff } from "./page-client";


const FunStuffWrapper = async () => {
    const access = await getRole();
    const dataRes = await getFunStuff();
    if (!dataRes.success) {
        return (
            <main className="flex flex-col items-center justify-between overflow-x-clip">
                <div className="w-screen relative flex flex-col">
                    <HeaderComponent />
                    <MessageDisplayComponent text="Whoops! Something went wrong." />
                    <FooterComponent/>
                </div>
            </main>
        )
    }

    return (
        <Suspense fallback={<LoadingComponent/>}>
            <FunStuff data={dataRes.data} access={access} />
        </Suspense>
    )
}

export default FunStuffWrapper