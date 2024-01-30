"use client";

import { usePathname, useRouter } from "next/navigation";
import isLoggedIn, { getToken, logout } from "./AuthContext";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { isAllowedToAccess } from "@/actions/actions";
import { PopUpComponent, usePopUp } from "./PopUpComponent";

const HeaderComponent = ({ isLoginPage = false, isNewPage = false }) => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false)
	const [isAdmin, setIsAdmin] = useState(false)
	const [dropdown, setDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const [popUp, setPopUp] = usePopUp();

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
		
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
          // TODO: header shifts cuz of scrollbar
      <header className=" w-[100vw] pr-2 h-[40px] lg:h-[70px] fixed z-10 bg-[#FBFBF1] flex flex-col justify-center shadow">
          <div className="fixed left-0">
          {( loggedIn  && !isNewPage && isAdmin) && (           
            <>
                    <button className="place-self-center m-6 cursor-pointer flex justify-center items-center" onClick={() => {setDropdown(!dropdown)}}>
                        <h5>NEW</h5>
                        <Image
                            src="/icons/dropdown.svg"
                            alt="v"
                            width={32}
                            height={32}
                        />
                    </button>
                    <div ref={dropdownRef} className={`absolute top-[70px] bg-[#FBFBF1] shadow opacity-70 w-[160px] xs-regular rounded-lg p-2 ${dropdown ? "" : "hidden"}`}>
                                    <Link className="w-full flex justify-start items-center gap-2 p-2 rounded-lg hover:bg-white hover:cursor-pointer" href="/new?type=project" rel="noopener noreferrer">
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"/>
                                        </svg>
                                        New project
                                    </Link>
                                    <Link className="w-full flex justify-start items-center gap-2 p-2 rounded-lg hover:bg-white hover:cursor-pointer" href="/edit" rel="noopener noreferrer">
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 50 50">
                                            <path d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z"/>
                                        </svg>							
                                        Edit item
                                    </Link>
                                    <Link className="w-full flex justify-start items-center gap-2 p-2 rounded-lg hover:bg-white hover:cursor-pointer" href="/new?type=funstuff" rel="noopener noreferrer">
                                        <Image
                                            src="/icons/party.png"
                                            alt="party"
                                            width={16}
                                            height={16}
                                        />
                                        New fun stuff
                                    </Link>
                    </div>
            </>
            )}
          </div>
        <div className="fixed left-[50%] transform -translate-x-1/2">
          <Link className="" href="/" rel="noopener noreferrer">
            <h1 className="p-1 hover:cursor-pointer">
            Juliette Khoo
            </h1>
          </Link>
        </div>
        <div className="fixed right-0">
          {
            !isLoginPage ? (!loggedIn ? (
            <Link className="place-self-center m-6 hover:cursor-pointer" href={pathname === "/" ? "/login" : `/login?redirect=${pathname}`} rel="noopener noreferrer">
              <h5>LOGIN</h5>
            </Link>
          ) : (
            <button className="place-self-center m-6 " onClick={handleLogOut} rel="noopener noreferrer">
              <h5>LOGOUT</h5>
            </button>
              )
            ) : <></>
          }
        </div>
      </header>) : (
        <>
            <header className=" w-[100vw] pr-2 h-[40px] lg:h-[70px] fixed z-10 bg-[#FBFBF1] flex flex-col justify-center shadow">
                <div className="fixed left-[50%] transform -translate-x-1/2">
                  <Link href="/" rel="noopener noreferrer">
                    <h1 className="p-1 hover:cursor-pointer">
                    Juliette Khoo
                    </h1>
                  </Link>
                </div>
            </header>
            <PopUpComponent popUpProps={popUp}/>      
        </>
      )
    )
  }
  
  export default HeaderComponent