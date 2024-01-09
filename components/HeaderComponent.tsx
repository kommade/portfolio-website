"use client";

import { useRouter } from "next/navigation";
import isLoggedIn, { logout } from "./AuthContext";
import { useState, useEffect } from "react";

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
              <a className="place-self-center m-4" href="/new" rel="noopener noreferrer">
                New
              </a>
            )}
            </div>
          <div className="flex justify-center w-full">
            <a href="/" rel="noopener noreferrer">
              <h1 className="text-center text-blue-500 text-[40px] font-normal font-['Junicode'] p-1">
              Juliette Khoo
              </h1>
            </a>
          </div>
          <div className="flex justify-end w-[30%]">
            {
              !isLoginPage ? (!loggedIn ? (
              <a className="place-self-center m-4" href="/login" rel="noopener noreferrer">
                Login
              </a>
            ) : (
              <button className="place-self-center m-4" onClick={handleLogOut} rel="noopener noreferrer">
                Logout
              </button>
                )
              ) : <a></a>
            }
          </div>
        </div>
      </header>) : (
        <header className=" w-[100vw] pr-2 h-fit fixed z-10 bg-orange-50 flex flex-col justify-center border-b-2 border-neutral-400">
          <div className="flex justify-between w-full">
            <div className="flex justify-center w-full">
              <a href="/" rel="noopener noreferrer">
                <h1 className="text-center text-blue-500 text-[40px] font-normal font-['Junicode'] p-1">
                Juliette Khoo
                </h1>
              </a>
            </div>
          </div>
      </header>
      )
    )
  }
  
  export default HeaderComponent