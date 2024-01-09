"use client";

import { useRouter } from "next/navigation";
import isLoggedIn, { logout } from "./AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";

const HeaderComponent = ({ isLoginPage = false, isNewPage = false }) => {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
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
      <header className=" w-[100vw] pr-2 h-fit fixed z-10 bg-orange-50 flex flex-col justify-center border-b-2 border-neutral-400">
        <div className="flex justify-between w-full">
            <div className="flex justify-start w-[30%]">
            {( loggedIn  && !isNewPage ) && (
              <Link className="place-self-center m-6" href="/new" rel="noopener noreferrer">
                New
              </Link>
            )}
            </div>
          <div className="flex justify-center w-full">
            <Link href="/" rel="noopener noreferrer">
              <h1 className="text-center text-blue-500 text-[40px] font-normal font-['Junicode'] p-1">
              Juliette Khoo
              </h1>
            </Link>
          </div>
          <div className="flex justify-end w-[30%]">
            {
              !isLoginPage ? (!loggedIn ? (
              <Link className="place-self-center m-6" href="/login" rel="noopener noreferrer">
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
        <header className=" w-[100vw] pr-2 h-fit fixed z-10 bg-orange-50 flex flex-col justify-center border-b-2 border-neutral-400">
          <div className="flex justify-between w-full">
            <div className="flex justify-center w-full">
              <Link href="/" rel="noopener noreferrer">
                <h1 className="text-center text-blue-500 text-[40px] font-normal font-['Junicode'] p-1">
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