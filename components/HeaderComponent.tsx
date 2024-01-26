"use client";

import { usePathname, useRouter } from "next/navigation";
import isLoggedIn, { getToken, logout } from "./AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { isAllowedToAccess } from "@/actions/actions";

const HeaderComponent = ({ isLoginPage = false, isNewPage = false }) => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {

    const getAccess = async () => {
      const admin = await isAllowedToAccess(getToken(), "admin");
      switch (admin) {
        case "yes":
          setIsAdmin(true)
          break
        case "expired":
          handleLogOut()
          //todo: show a popup
          break
        default:
          break
      }
    }

    getAccess();
    setIsClient(true);
  }, [])
  const router = useRouter();
  const loggedIn = isLoggedIn();
  
  const handleLogOut = () => {
    logout();
    router.push("/")
    router.refresh();
  }
  return (
    isClient ? (
      <header className=" w-[100vw] pr-2 h-fit fixed z-10 bg-[#FBFBF1] flex flex-col justify-center shadow">
        <div className="flex justify-between w-full">
            <div className="flex justify-start w-[30%]">
            {( loggedIn  && !isNewPage && isAdmin) && (
              <Link className="place-self-center m-6 cursor-pointer" href="/new" rel="noopener noreferrer">
                New
              </Link>
            )}
            </div>
          <div className="flex justify-center w-full">
            <Link className="" href="/" rel="noopener noreferrer">
              <h1 className="text-center text-blue-500 text-[48px] font-normal font-['Junicode'] p-1 hover:cursor-pointer">
              Juliette Khoo
              </h1>
            </Link>
          </div>
          <div className="flex justify-end w-[30%]">
            {
              !isLoginPage ? (!loggedIn ? (
              <Link className="place-self-center m-6 hover:cursor-pointer" href={pathname === "/" ? "/login" : `/login?redirect=${pathname}`} rel="noopener noreferrer">
                Login
              </Link>
            ) : (
              <button className="place-self-center m-6 " onClick={handleLogOut} rel="noopener noreferrer">
                Logout
              </button>
                )
              ) : <></>
            }
          </div>
        </div>
      </header>) : (
        <header className=" w-[100vw] pr-2 h-fit fixed z-10 bg-[#FBFBF1] flex flex-col justify-center shadow">
          <div className="flex justify-between w-full">
            <div className="flex justify-center w-full">
              <Link href="/" rel="noopener noreferrer">
                <h1 className="text-center text-blue-500 text-[48px] font-normal font-['Junicode'] p-1 hover:cursor-pointer">
                Juliette Khoo
                </h1>
              </Link>
            </div>
          </div>
      </header>
      )
    )
  }
  
  export default HeaderComponent