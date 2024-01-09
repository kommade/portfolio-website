import Image from "next/image"

const LoadingComponent = () => {
  return (
    <div className="w-full h-[68vh] relative items-center justify-center mt-28 flex flex-col">
      <h1 className="font-['Epilogue'] text-3xl text-center">
      Almost done...
      </h1>
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