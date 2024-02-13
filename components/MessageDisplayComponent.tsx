import React from 'react'
import Image from "next/image"

const MessageDisplayComponent = (
  { text = "You do not have permission to view this page" }
    : { text?: string }) => {
  return (
      <h2 className="w-full min-h-[calc(100vh_-_108px)] lg:min-h-[calc(100vh_-_138px)] relative items-center justify-center mt-[40px] lg:mt-[70px] flex flex-col">
          <Image src="/images/cat 404.png" alt="404" width={300} height={300} priority draggable={false} onContextMenu={(e) => e.preventDefault()}/>
          {text}
      </h2>
  )
}

export default MessageDisplayComponent