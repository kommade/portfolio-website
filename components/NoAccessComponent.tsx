import React from 'react'

const NoAccessComponent = (
  { text = "You do not have permission to view this page." }
    : { text?: string }) => {
  return (
      <div className="w-full min-h-[calc(100vh_-_128px)] relative items-center justify-center mt-[60px] flex flex-col font-['Epilogue'] text-3xl text-center">
          {text}
      </div>
  )
}

export default NoAccessComponent