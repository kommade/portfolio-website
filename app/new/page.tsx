"use client";

import { HeaderComponent, LoadingComponent, FooterComponent, UploadComponent, MessageDisplayComponent } from "@/components";
import { isAllowedToAccess } from "@/functions/actions";
import { getToken, logout } from "@/functions/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function New() {
    const router = useRouter();
    const token = getToken();
    const searchParams = useSearchParams();
    const type = searchParams.get("type")
    const [access, setAccess] = useState(false);
    const [checking, setChecking] = useState(true);
    useEffect(() => {
        const fetchAccess = async () => {
            if (!token) {
                setChecking(false);
                setAccess(false);
            } else {
                const res = await isAllowedToAccess(token, "admin")
                setChecking(false);
                switch (res) {
                    case "expired":
                        logout();
                        router.push("/expired=true")
                        return;
                    case "yes":
                        setAccess(true);
                        return;
                    default:
                        return;
                }
            }
        }
        fetchAccess();
    }, [token, router])
    return (
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen relative flex flex-col">
                <HeaderComponent isNewPage={true}/>

                <div className="w-[85%] h-fit left-[7.5%] relative justify-center">
                    {
                        checking ? <LoadingComponent /> : access ? <UploadComponent type={type!} /> : <MessageDisplayComponent/>         
                    }
                </div>
                <FooterComponent/>
            </div>
        </main>
        )
  }
  