import { submitNewFunStuff } from "@/actions/actions";
import NoAccessComponent from "./NoAccessComponent";
import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import {PopUpComponent, usePopUp} from "./PopUpComponent";

const UploadComponent = ({ type }: { type: string | undefined }) => {
    const [dropdown, setDropdown] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [category, setCategory] = useState<"Sketchbook" | "Photography" | "Craft">("Sketchbook");
    const [popUp, setPopUp] = usePopUp();
    const parentDropdownRef = useRef(null)
    const dropdownRef = useRef(null)
    const router = useRouter();
    const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/png': [],
            'image/jpeg': []
        },
        maxFiles: 1
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target) && !(parentDropdownRef.current as any).contains(event.target)) {
                setDropdown(false);
            }
        };
            document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [])

    switch (type) {
        case "project":
            return (
                <form className="w-full min-h-[calc(100vh_-_128px)] mt-[60px] flex flex-col justify-center items-center" action={()=>{}}>
                    <label>
                        Title:
                        <input type="text" name="title" defaultValue='placeholder'/>
                    </label>
                    <label>
                        Description:
                        <input type="text" name="desc" defaultValue='placeholder'/>
                    </label>
                    <label>
                        Image:
                        <input type="file" name="image" accept="image/*"/>
                    </label>
                    <button className=" bg-white" type="submit">Submit</button>
                </form>
            );
        case "funstuff":
            return (
                <>
                    <form
                        className="w-full min-h-[calc(100vh_-_128px)] mt-[60px] flex flex-col justify-center items-center"
                        action={async (formdata) => {
                            setSubmit(true)
                            if (acceptedFiles.length === 0) {
                                setPopUp({ message: "Select a file to upload!", type: "warning", duration: 1000 })
                                setSubmit(false)
                                return;
                            }
                            formdata.append("type", category.toLowerCase())
                            formdata.append("image", acceptedFiles.at(0)!)
                            const out = await submitNewFunStuff(formdata)
                            if (out.success) {
                                setPopUp({ message: "Upload successful!", type: "success", duration: 1000 })
                                setTimeout(() => {
                                    router.push("/fun-stuff");
                                    setSubmit(false)
                                }, 1000);
                            } else {
                                setPopUp({ message: out.message!, type: "warning", duration: 2000 })
                                setSubmit(false)
                            }
                        }
                    }>
                        <div className="flex flex-col m-4 ">
                            <section className="flex flex-col gap-2.5">
                                <label className="text-start text-gray-700 text-sm font-semibold font-['Epilogue'] leading-[17.40px] tracking-tight">
                                    Name:
                                </label>
                                <input className={`w-[300px] h-[42px] bg-neutral-200 pl-2 font-['Epilogue'] text-sm focus:ring-2`} spellCheck={false} name="name" required/>
                            </section>
                            <section className="flex flex-col mt-2 gap-2.5">
                                <label className="text-start text-gray-700 text-sm font-semibold font-['Epilogue'] leading-[17.40px] tracking-tight">
                                    Type:
                                </label>
                                <div
                                    ref={parentDropdownRef}
                                    className={`w-[300px] h-[42px] bg-neutral-200 pl-2 font-['Epilogue'] text-sm rounded-lg text-start flex justify-start items-center z-[1]`}
                                    onClick={() => setDropdown(true)}>
                                    <h1 className="select-none ">{dropdown ? "..." : category}</h1>
                                </div>
                                <div ref={dropdownRef} className={` absolute translate-y-1/2 w-[300px] h-[126px] bg-neutral-200 text-sm rounded-lg rounded-t-none font-['Epilogue'] p-2 z-0 ${dropdown ? "" : "hidden"}`}>
                                    <div
                                        className="w-full flex justify-start items-center gap-2 py-2 rounded-lg hover:bg-white hover:cursor-pointer"
                                        onClick={() => {
                                            setCategory("Sketchbook")
                                            setDropdown(false)
                                        }}>
                                        Sketchbook
                                    </div>
                                    <div
                                        className="w-full flex justify-start items-center gap-2 py-2 rounded-lg hover:bg-white hover:cursor-pointer"
                                        onClick={() => {
                                            setCategory("Photography")
                                            setDropdown(false)
                                        }}>
                                        Photography
                                    </div>
                                    <div
                                        className="w-full flex justify-start items-center gap-2 py-2 rounded-lg hover:bg-white hover:cursor-pointer"
                                        onClick={() => {
                                            setCategory("Craft")
                                            setDropdown(false)
                                        }}>
                                        Craft
                                    </div>
                                </div>
                            </section>
                            <section className="flex flex-col mt-2 gap-2.5">
                                <label className="text-start text-gray-700 text-sm font-semibold font-['Epilogue'] leading-[17.40px] tracking-tight">
                                    Image:
                                </label>
                                <div {...getRootProps()} className={` w-[300px] h-[84px] bg-neutral-200 pl-2 font-['Epilogue'] text-sm flex justify-center items-center text-center rounded-lg ${fileRejections.length > 0 ? "border-2 border-red-600" : ""}`}>
                                    <input {...getInputProps()}/>
                                    <h1>{ acceptedFiles.length > 0 ? acceptedFiles.at(0)!.name : "Drop file here or click to upload..." }</h1>
                                </div>  
                                <h1 className="h-[10px] m-2 text-red-600 font-['Epilogue'] text-xs">{fileRejections.length > 0 ? fileRejections.at(-1)!.errors.at(0)!.message : ""}</h1>
                            </section>
                        </div>
                        <input className={`m-2 w-[300px] h-[54px] bg-gray-700 rounded-xl px-6 py-1 hover:cursor-pointer text-center text-base font-light font-['Epilogue'] leading-normal tracking-tight active:bg-orange-50 active:border active:border-gray-700 active:text-gray-700 ${submit ? "bg-orange-50 border border-gray-700 text-gray-700" : "text-white"}`} type="submit" value="Upload" disabled={submit}/>
                    </form>
                    <PopUpComponent popUpProps={popUp} />
                </>
            );
        default:
            return (
                <NoAccessComponent text="404 Not found"/>
                );

    }
}
    
export default UploadComponent;