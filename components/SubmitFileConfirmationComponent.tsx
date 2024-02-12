import React from 'react'

const SubmitFileConfirmationComponent =
    ({ item, callback }:
        {
            item: { name: string },
            callback: (message: string) => void
        }
    ) => {

    return (
        <div className="fixed w-screen h-screen bg-[rgba(0,0,0,0.4)] z-[9999]">
            <div className="fixed w-[350px] h-[150px] rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pale-butter opacity-100 flex flex-col items-center justify-evenly">
                <div className="flex flex-col justify-center items-center gap-4">
                    <h4 className="">Do you want to upload {item.name}?</h4>
                    <h4 className="">This action may take a while.</h4>
                </div>
                <div className="s-regular w-full flex justify-evenly">
                    <button className="bg-red-500 rounded-lg px-4 py-2" onClick={() => callback('cancel')}>Cancel</button>
                    <button className="bg-green-500 rounded-lg px-4 py-2" onClick={() => callback('upload')}>Upload</button>
                </div>
            </div>
        </div>
    )
}

export default SubmitFileConfirmationComponent