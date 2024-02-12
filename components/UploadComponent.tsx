import { createNewProject, submitNewFunStuff } from "@/functions/actions";
import NoAccessComponent from "./MessageDisplayComponent";
import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import {PopUpComponent, usePopUp} from "./PopUpComponent";
import ReactSwitch from "react-switch";
import { create } from "domain";

const UploadComponent = ({ type }: { type: string | undefined }) => {
    const [dropdown, setDropdown] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [category, setCategory] = useState<"Sketchbook" | "Photography" | "Craft">("Sketchbook");
    const [gridEnabled, setGridEnabled] = useState(true)
    const [accessPublic, setAccessPublic] = useState(true)
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
                <>
                    <form
                        className="w-full min-h-[calc(100vh_-_128px)] mt-[60px] flex flex-col justify-center items-center"
                        action={async (formdata) => {
                            setSubmit(true);
                            if (acceptedFiles.length === 0) {
                                setPopUp({ message: "Select a file to upload!", type: "warning", duration: 1000 })
                                setSubmit(false)
                                return;
                            }
                            formdata.append("image", acceptedFiles.at(0)!)
                            formdata.append("grid", gridEnabled.toString())
                            formdata.append("access", accessPublic ? "public" : "member")
                            const out = await createNewProject(formdata);
                            if (out.success) {
                                setPopUp({ message: "Created new project!", type: "success", duration: 1000 })
                                setTimeout(() => {
                                    router.push(`/projects/${out.message}`);
                                    setSubmit(false)
                                }, 1000);
                            } else {
                                setPopUp({ message: "Error creating new projet", type: "warning", duration: 2000 })
                                setSubmit(false)
                            }
                        }
                    }>
                        <div className="flex flex-col m-2 ">
                            <section className="flex flex-row mt-2 gap-[20px]">
                                <div className="flex flex-col gap-2.5">
                                    <label className="xs-semibold text-start text-eggplant-purple">
                                        Name:
                                    </label>
                                    <input
                                        className={`w-[200px] h-[42px] bg-neutral-200 pl-2 s-regular focus:ring-2`}
                                        spellCheck={false}
                                        type="text"
                                        name="name"
                                        pattern="^[A-Z]{1}.*$"
                                        required
                                        onInput={(event) => {
                                            const input = event.target as HTMLInputElement;
                                            input.setCustomValidity(
                                                input.validity.patternMismatch ?
                                                `The first letter must be capitalised.` : ""
                                            );
                                        }}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="flex flex-col gap-2.5">
                                    <label className="xs-semibold text-start text-eggplant-purple">
                                        Year:
                                    </label>
                                    <input
                                        className={`w-[44px] h-[42px] bg-neutral-200 pl-2 s-regular focus:ring-2`}
                                        spellCheck={false}
                                        type="number"
                                        name="year"
                                        pattern="[0-9]{4}"
                                        min="2000"
                                        max="2099"
                                        required
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="flex flex-col gap-2.5">
                                    <label className="xs-semibold text-start text-eggplant-purple">
                                        ID:
                                    </label>
                                    <input
                                        className={`w-[116px] h-[42px] bg-neutral-200 pl-2 s-regular focus:ring-2`}
                                        spellCheck={false}
                                        type="text"
                                        name="id"
                                        pattern="^(?!-)[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$"
                                        required
                                        onInput={(event) => {
                                            const input = event.target as HTMLInputElement;
                                            input.setCustomValidity(
                                                input.validity.patternMismatch ?
                                                `This must:
                                                Start with any alphabet or number.
                                                Not start with a dash.
                                                Have one dash at a time, surrounded by other characters.
                                                Not consist of characters other than alphabets, numbers, and dashes.
                                                e.g. a-b-c` : ""
                                            );
                                        }}
                                        autoComplete="off"
                                    />
                                </div>
                                
                            </section>
                            <section className="flex flex-col mt-2 gap-2.5">
                                <label className="xs-semibold text-start text-eggplant-purple">
                                    Thumbnail:
                                </label>
                                <div {...getRootProps()} className={` w-[400px] h-[84px] bg-neutral-200 pl-2 font-['Epilogue'] text-sm flex justify-center items-center text-center rounded-lg ${fileRejections.length > 0 ? "border-2 border-red-600" : ""}`}>
                                    <input {...getInputProps()}/>
                                    <p className="s-regular">{ acceptedFiles.length > 0 ? acceptedFiles.at(0)!.name : "Drop file here or click to upload..." }</p>
                                </div>  
                            </section>
                            <section className="flex flex-col mt-2 gap-2.5">
                                <label className="xs-semibold text-start text-eggplant-purple">
                                    Thumbnail text:
                                </label>
                                <textarea
                                    className={`w-[400px] h-[63px] bg-neutral-200 pl-2 s-regular focus:ring-2 resize-none`}
                                    spellCheck={false}
                                    name="desc"
                                    required
                                />
                            </section>
                            <section className="flex mt-2 gap-2.5 justify-between w-full">
                                <div className="w-fit h-[42px] flex justify-start items-center">
                                    <label className="xs-semibold text-start text-eggplant-purple mr-[5px]">
                                        Use grid:
                                    </label>
                                    <ReactSwitch
                                        checked={gridEnabled}
                                        onChange={() => {setGridEnabled(!gridEnabled)}}
                                        onColor="#3688D4"
                                        offColor="#37344B"
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        height={16}
                                        width={32}
                                        handleDiameter={16}
                                    />
                                </div>
                                <div className="w-fit h-[42px] flex justify-start items-center">
                                    <label className="xs-semibold text-start text-eggplant-purple mr-[5px]">
                                        Public access:
                                    </label>
                                    <ReactSwitch
                                        checked={accessPublic}
                                        onChange={() => {setAccessPublic(!accessPublic)}}
                                        onColor="#3688D4"
                                        offColor="#37344B"
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        height={16}
                                        width={32}
                                        handleDiameter={16}
                                    />
                                </div>
                                <div className="-fit h-[42px] flex justify-start items-center">
                                    <label className="xs-semibold text-start text-eggplant-purple mr-[5px]">
                                        No. of images:
                                    </label>
                                    <input
                                        className={`w-[44px] h-[42px] bg-neutral-200 pl-2 s-regular focus:ring-2`}
                                        spellCheck={false}
                                        type="number"
                                        name="normal"
                                        pattern="[0-9]{1,2}"
                                        min="1"
                                        max={`${gridEnabled ? 10 : 14}`}
                                        required
                                        autoComplete="off"
                                    />
                                </div>
                            </section>
                            <p className="mb-2 h-[10px] text-red-600 xs-regular">{fileRejections.length > 0 ? fileRejections.at(-1)!.errors.at(0)!.message : ""}</p>
                        </div>
                        <input className={`w-[400px] h-[54px] bg-eggplant-purple rounded-xl px-6 py-1 hover:cursor-pointer text-center s-light active:bg-orange-50 active:border active:border-eggplant-purple active:text-eggplant-purple ${submit ? "bg-orange-50 border border-eggplant-purple text-eggplant-purple" : "text-white"}`} type="submit" value="Upload" disabled={submit}/>
                    </form>
                    <PopUpComponent popUpProps={popUp} />
                </>
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
                                <label className="xs-semibold text-start text-eggplant-purple">
                                    Name:
                                </label>
                                <input className={`w-[300px] h-[42px] bg-neutral-200 pl-2 s-regular focus:ring-2`} spellCheck={false} name="name" required autoComplete="off"/>
                            </section>
                            <section className="flex flex-col mt-2 gap-2.5">
                                <label className="xs-semibold text-start text-eggplant-purple">
                                    Type:
                                </label>
                                <div
                                    ref={parentDropdownRef}
                                    className={`w-[300px] h-[42px] bg-neutral-200 pl-2 rounded-lg text-start flex justify-start items-center z-[1]`}
                                    onClick={() => setDropdown(true)}>
                                    <p className="s-regular select-none ">{dropdown ? "..." : category}</p>
                                </div>
                                <div ref={dropdownRef} className={` absolute translate-y-1/2 w-[300px] h-[126px] bg-neutral-200 rounded-lg rounded-t-none p-2 z-0 ${dropdown ? "" : "hidden"}`}>
                                    <div
                                        className="s-regular w-full flex justify-start items-center gap-2 py-2 pl-2 rounded-lg hover:bg-white hover:cursor-pointer"
                                        onClick={() => {
                                            setCategory("Sketchbook")
                                            setDropdown(false)
                                        }}>
                                        Sketchbook
                                    </div>
                                    <div
                                        className="s-regular w-full flex justify-start items-center gap-2 py-2 pl-2 rounded-lg hover:bg-white hover:cursor-pointer"
                                        onClick={() => {
                                            setCategory("Photography")
                                            setDropdown(false)
                                        }}>
                                        Photography
                                    </div>
                                    <div
                                        className="s-regular w-full flex justify-start items-center gap-2 py-2 pl-2 rounded-lg hover:bg-white hover:cursor-pointer"
                                        onClick={() => {
                                            setCategory("Craft")
                                            setDropdown(false)
                                        }}>
                                        Craft
                                    </div>
                                </div>
                            </section>
                            <section className="flex flex-col mt-2 gap-2.5">
                                <label className="xs-semibold text-start text-eggplant-purple">
                                    Image:
                                </label>
                                <div {...getRootProps()} className={` w-[300px] h-[84px] bg-neutral-200 pl-2 font-['Epilogue'] text-sm flex justify-center items-center text-center rounded-lg ${fileRejections.length > 0 ? "border-2 border-red-600" : ""}`}>
                                    <input {...getInputProps()}/>
                                    <p className="s-regular">{ acceptedFiles.length > 0 ? acceptedFiles.at(0)!.name : "Drop file here or click to upload..." }</p>
                                </div>  
                                <p className="h-[10px] m-2 text-red-600 xs-regular">{fileRejections.length > 0 ? fileRejections.at(-1)!.errors.at(0)!.message : ""}</p>
                            </section>
                        </div>
                        <input className={`m-2 w-[300px] h-[54px] bg-eggplant-purple rounded-xl px-6 py-1 hover:cursor-pointer text-center s-light active:bg-orange-50 active:border active:border-eggplant-purple active:text-eggplant-purple ${submit ? "bg-orange-50 border border-eggplant-purple text-eggplant-purple" : "text-white"}`} type="submit" value="Upload" disabled={submit}/>
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