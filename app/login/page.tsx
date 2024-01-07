import HeaderComponent from "@/components/HeaderComponent";
import LoginComponent from "@/components/LoginComponent";
import { kv } from "@vercel/kv";


export default async function Login() {
    return (
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen relative flex flex-col">
                <HeaderComponent isLoginPage={true} />
                <LoginComponent/>
            </div>
        </main>
    );
}
