import { HeaderComponent, MessageDisplayComponent, LoadingComponent, FooterComponent } from "@/components";
import { getFunStuff } from "@/functions/actions";
import { FunStuff } from "./page-client";

export const experimental_ppr = true

const FunStuffWrapper = async () => {
    "use cache";
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
        <FunStuff data={dataRes.data} />
    )
}

export default FunStuffWrapper