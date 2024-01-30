"use client";

import { isAllowedToAccess } from "@/actions/actions";
import UploadComponent from "@/components/UploadComponent";
import HeaderComponent from "@/components/HeaderComponent";
import { getToken, logout } from "@/components/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import NoAccessComponent from "@/components/NoAccessComponent";
import LoadingComponent from "@/components/LoadingComponent";
import FooterComponent from "@/components/FooterComponent";

export default function New() {
    const router = useRouter();
    const token = getToken();
    const searchParams = useSearchParams();
    const type = searchParams.get("type")
    const [access, setAccess] = useState(false);
    const [checking, setChecking] = useState(true);
    const redirect = () => {
      router.push("/")
    }
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
                        redirect();
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
    }, [token])
    return (
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen relative flex flex-col">
                <HeaderComponent isNewPage={true}/>

                <div className="w-[85%] h-fit left-[7.5%] relative justify-center">
                    {
                        checking ? <LoadingComponent /> : access ? <UploadComponent type={type!} /> : <NoAccessComponent/>         
                    }
                </div>
                <FooterComponent/>
            </div>
        </main>
        )
  }
  