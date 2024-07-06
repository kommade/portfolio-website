import React, { useEffect, useState } from 'react'

interface PopUpProps {
    type: "warning" | "message" | "success",
    message: string,
    duration: number
}

export const PopUpComponent = ({ popUpProps }: { popUpProps: PopUpProps }) => {
    let color = "bg-green-400";
    switch (popUpProps.type) {
        case "message":
            color = "bg-neutral-400"
            break;
        case "warning":
            color = "bg-red-400";
            break;
        default:
            break;
    }
    return (
        <div className={`bottom-[5vh] left-1/2 -translate-x-1/2 fixed h-[60px] px-4 w-fit ${color} rounded-lg z-[1000] flex justify-center items-center transition-opacity ease-in-out duration-500 ${popUpProps.duration === 0 ? "opacity-0" : "opacity-80"}`}>
            <p className="xs-regular p-2 text-center">{popUpProps.message}</p>
        </div>
    )
}

export const usePopUp = () => {
    const [popUp, setPopUp] = useState<PopUpProps>({ type: "message", message: "", duration: 0 })

    useEffect(() => {
        if (popUp.duration > 0) {
            setTimeout(() => {
                setPopUp((prevState) => ({ ...prevState, duration: 0 }));
            }, popUp.duration);
        }
    })

    return [popUp, setPopUp] as [PopUpProps, React.Dispatch<React.SetStateAction<PopUpProps>>]
}
