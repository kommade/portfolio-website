import React from 'react'

const NoAccessComponent = (
  { text = "You do not have permission to view this page." }
    : { text?: string }) => {
  return (
      <div className="w-full h-[68vh] relative items-center justify-center mt-28 flex flex-col font-['Epilogue'] text-3xl text-center">
          {text}
      </div>
  )
}

export default NoAccessComponent