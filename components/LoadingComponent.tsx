import Image from "next/image"
import { HeaderComponent } from "."

const LoadingComponent = () => {
    return (
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen relative flex flex-col">
                <HeaderComponent/>
                <div className="w-full min-h-[calc(100vh_-_108px)] lg:min-h-[calc(100vh_-_138px)] relative items-center justify-center mt-[40px] lg:mt-[70px] flex flex-col">
                    <h2>
                        Almost done...
                    </h2>
                    <Image
                        className=" animate-spin"
                        width={24}
                        height={24}
                        src="/icons/loading.png"
                        alt="Loading..."
                        priority={true}
                    />
                </div>
            </div>
        </main>
    )
}

export default LoadingComponent