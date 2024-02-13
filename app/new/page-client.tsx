"use client";

import { HeaderComponent, FooterComponent, UploadComponent } from "@/components";
import { useSearchParams } from "next/navigation";

export function New() {
    const searchParams = useSearchParams();
    const type = searchParams.get("type")

    return (
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen relative flex flex-col">
                <HeaderComponent isNewPage={true}/>
        
                <div className="w-[85%] h-fit left-[7.5%] relative justify-center">
                    <UploadComponent type={type!} />        
                </div>
                <FooterComponent/>
            </div>
        </main>
    )
}