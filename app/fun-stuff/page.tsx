import { HeaderComponent, MessageDisplayComponent, FooterComponent } from "@/components";
import { getFunStuff } from "@/functions/db";
import { FunStuff } from "./page-client";
import { getRole } from "@/functions/actions";

const getData = async () => {
    "use cache";
    const dataRes = await getFunStuff();
    return dataRes;
}

const FunStuffWrapper = async () => {
    const dataRes = await getData();
    const access = await getRole();
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
        <FunStuff data={dataRes.data} role={access} />
    )
}

export default FunStuffWrapper