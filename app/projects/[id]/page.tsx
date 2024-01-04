import HeaderComponent from "@/components/HeaderComponent";
import { kv } from "@vercel/kv";

export default async function ProjectPage({
    params,
}: {
    params: { id: string };
    }) {
    const key = await kv.get<string>(params.id);
    if (!key) {
        return (
            <div>
                ERROR
            </div>
        )
    }
    const data = await kv.hgetall(key);
    if (!data) {
        return (
            <div>
                ERROR
            </div>
        )
    }

    return (
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen relative flex flex-col">
                <HeaderComponent/>

                <div className="w-[85%] h-fit left-[7.5%] relative justify-center mt-28 flex flex-col">
                    <h1>
                        {data.name as string}     
                    </h1>
                    <h1>
                        {data.desc as string}     
                    </h1>
                    <h1>
                        {data.year as string}
                    </h1>
                </div>
            
            </div>
      </main>
    )
}