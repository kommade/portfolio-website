import { deleteItem } from "@/functions/db"
import React from 'react'

const DeleteWarningComponent =
    ({ item, callback }:
        {
            item: { id: string, name: string },
            callback: (message: 'cancel' | 'success' | 'error') => void
        }
    ) => {
    
    const handleDelete = async () => {
        const res = await deleteItem(item.id);
        if (res.success) {
            callback('success')
        } else {
            callback('error')
        }
    }

    return (
        <div className="fixed w-screen h-screen bg-[rgba(0,0,0,0.4)] z-9999">
            <div className="fixed w-[350px] h-[150px] rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pale-butter opacity-100 flex flex-col items-center justify-evenly">
                <div className="flex flex-col justify-center items-center gap-4">
                    <h4 className="w-[250px] text-center">Are you sure you want to delete {item.name}?</h4>
                    <h4 className="text-red-500">This action is not reversible.</h4>
                </div>
                <div className="s-regular w-full flex justify-evenly">
                    <button className="bg-warm-grey rounded-lg px-4 py-2" onClick={() => callback('cancel')}>Cancel</button>
                    <button className="bg-red-500 rounded-lg px-4 py-2" onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteWarningComponent