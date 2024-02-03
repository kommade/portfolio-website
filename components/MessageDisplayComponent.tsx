import React from 'react'

const MessageDisplayComponent = (
  { text = "You do not have permission to view this page." }
    : { text?: string }) => {
  return (
      <h2 className="w-full min-h-[calc(100vh_-_108px)] lg:min-h-[calc(100vh_-_138px)] relative items-center justify-center mt-[40px] lg:mt-[70px] flex flex-col">
          {text}
      </h2>
  )
}

export default MessageDisplayComponent