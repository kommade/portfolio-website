import { HeaderComponent } from "."
import { Skeleton } from "./ui/skeleton"

const spanMap = [
    { row: 1, col: 1 },
    { row: 1, col: 1 },
    { row: 2, col: 1 },
    { row: 1, col: 2 },
    { row: 1, col: 1 },
    { row: 1, col: 1 },
    { row: 2, col: 1 },
    { row: 1, col: 1 },
    { row: 1, col: 1 }
]

const LoadingComponent = () => {
    return (
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen relative flex flex-col">
                <HeaderComponent />
                <h2 className="w-full h-[34px] mt-[80px] lg:mt-[110px] text-center">I’m a dreamer and a UX designer, currently based in Singapore. Here’s some of my work:</h2>
                <div className="w-full min-h-[calc(100vh_-_108px)] lg:min-h-[calc(100vh_-_138px)] relative items-center justify-center flex flex-col">
                    <section className={`work-display w-[85%] h-fit min-h-[calc(100vh_-_108px)] lg:min-h-[calc(100vh_-_138px)] relative justify-center mt-[30px] grid grid-cols-1 lg:grid-cols-3 grid-flow-row gap-y-6 gap-x-0 lg:gap-x-6`}>
                        {
                            spanMap.map((span, index) => (
                                <Skeleton key={`main-skeleton-${index}`} className={`bg-white relative shadow-sm ${span.row === 2 ? 'grid-long' : span.col === 2 ? 'grid-wide' : 'aspect-square'}`}>   
                                    <section className='absolute inset-[15px] bottom-[25%] group'>
                                        <Skeleton
                                            className="w-full h-full absolute"
                                        />
                                    </section>
                                    <section className="top-[75%] translate-y-[5%] absolute left-4">
                                        <Skeleton className="w-[200px] h-[36px]"/>
                                        <Skeleton className="mt-[3px] text-warm-grey w-[60px] h-[23px]"/>
                                    </section>
                                </Skeleton>
                            ))
                        }
                    </section>
                </div>
            </div>
        </main>
    )
}

export default LoadingComponent