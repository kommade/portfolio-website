import { ProjectData } from "@/app/projects/[id]/page-client"
import { changeProjectSettings } from "@/functions/db"
import React from 'react'
import ReactSwitch from "react-switch"

const ProjectSettingsComponent = ({ data, id, projectKey, callback }:
    {
        data: ProjectData,
        id: string,
        projectKey: string,
        callback: (message: 'cancel' | 'success' | 'error') => void
    }
) => {
    const [gridEnabled, setGridEnabled] = React.useState(data.data.main.body.grid.use);
    const [accessPublic, setAccessPublic] = React.useState<"member" | "public">(data.access);

    const calculateImageNumber = (data: ProjectData) => {
        const normalImages = data.data.main.body.normal.length;
        const gridImages = data.data.main.body.grid.use ? data.data.main.body.grid.images.length : 0;
        return normalImages + gridImages + 1;
    }

    return (
        <div className="fixed w-screen h-screen bg-[rgba(0,0,0,0.4)] z-9999">
            <div className="fixed w-[350px] h-[220px] rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pale-butter opacity-100 flex flex-col items-center justify-evenly">
                <div className="flex justify-center items-center gap-4">
                    <form
                        className="w-full flex flex-col justify-center items-center"
                        action={async (formData: FormData) => {
                            const res = await changeProjectSettings(
                                projectKey,
                                id,
                                data,
                                {
                                    id: formData.get("id") as string,
                                    imageNumber: parseInt(formData.get("normal") as string),
                                    grid: gridEnabled,
                                    access: accessPublic
                                }
                            )
                            if (res.success) {
                                callback('success')
                            } else {
                                callback('error')
                            }
                        }}>
                        <div className="flex flex-col m-2 ">
                            <section className="flex flex-row mt-2 gap-[20px]">
                                <div className="flex flex-col gap-2.5">
                                    <label className="xs-semibold text-start text-eggplant-purple">
                                        ID:
                                    </label>
                                    <input
                                        className={`w-[190px] h-[42px] bg-neutral-200 pl-2 s-regular focus:ring-2`}
                                        spellCheck={false}
                                        type="text"
                                        name="id"
                                        defaultValue={id}
                                        pattern="^(?!-)[a-z0-9]+(?:-[a-z0-9]+)*$"
                                        onInput={(event) => {
                                            const input = event.target as HTMLInputElement;
                                            input.setCustomValidity(
                                                input.validity.patternMismatch ?
                                                `This must:
                                                Start with any alphabet or number.
                                                Not start with a dash.
                                                Have one dash at a time, surrounded by other characters.
                                                Not consist of characters other than lowercase alphabets, numbers, and dashes.
                                                e.g. a-b-c` : ""
                                            );
                                        }}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="flex flex-col items-stretch gap-2.5">
                                    <label className="xs-semibold text-start text-eggplant-purple mr-[5px]">
                                        No. of images:
                                    </label>
                                    <input
                                        className={`h-[42px] bg-neutral-200 pl-2 s-regular focus:ring-2`}
                                        spellCheck={false}
                                        type="number"
                                        name="normal"
                                        defaultValue={calculateImageNumber(data).toString()}
                                        pattern="[0-9]{1,2}"
                                        min="1"
                                        max="30"
                                        autoComplete="off"
                                    />
                                </div>
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
                                        checked={accessPublic === "public"}
                                        onChange={() => {setAccessPublic(accessPublic === "member" ? "public" : "member")}}
                                        onColor="#3688D4"
                                        offColor="#37344B"
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        height={16}
                                        width={32}
                                        handleDiameter={16}
                                    />
                                </div>
                                
                            </section>
                        </div>
                        <div className="flex w-full justify-evenly s-regular">
                            <button className="bg-warm-grey rounded-lg px-4 py-2" onClick={(event) => { event.preventDefault(); callback('cancel') }}>Cancel</button>
                            <input className="bg-green-500 rounded-lg px-4 py-2 cursor-pointer" type="submit" value={"Save"} onClick={() => { }}></input>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProjectSettingsComponent