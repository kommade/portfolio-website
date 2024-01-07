"use client";

import { useRouter } from "next/navigation";

const HeaderComponent = ({ isLoginPage = false }) => {
  const router = useRouter();
  let loggedIn = false;
  if (typeof localStorage !== 'undefined') {
    loggedIn = localStorage.getItem("token") !== null;
  }
  const logout = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem("token");
    }
    router.push("/");
  }
  return (
    <header className="title-header w-full h-fit fixed z-10 bg-orange-50 flex flex-col justify-center border-b-2 border-neutral-400">
      <div className="flex justify-between w-full">
        <div className="flex justify-center w-full">
          <a href="/" rel="noopener noreferrer">
            <h1 className="text-center text-blue-500 text-[40px] font-normal font-['Junicode'] p-1">
            Juliette Khoo
            </h1>
          </a>
        </div>
        {(!isLoginPage && !loggedIn) && (
          <div className="flex justify-end">
            <a className="place-self-end m-4" href="/login" rel="noopener noreferrer">
             Login
            </a>
          </div>
        )}
        {(!isLoginPage && loggedIn) && (
          <div className="flex justify-end">
            <a className="place-self-end m-4" onClick={logout} rel="noopener noreferrer">
             Logout
            </a>
          </div>
       )}
      </div>
    </header>
    
    )
  }
  
  export default HeaderComponent