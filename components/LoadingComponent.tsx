import Image from "next/image"

const LoadingComponent = () => {
  return (
    <div className="w-full min-h-[calc(100vh_-_108px)] lg:min-h-[calc(100vh_-_138px)] relative items-center justify-center mt-[40px] lg:mt-[70px] flex flex-col">
      <h2>
      Almost done...
      </h2>
      <Image
        className=" animate-spin"
        width={24}
        height={24}
        src="/icons/loading.png"
        alt="loadingpng"
      />
    </div>
    )
  }
  
  export default LoadingComponent