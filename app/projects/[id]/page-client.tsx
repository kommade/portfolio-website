"use client";

import { saveNewProjectData, uploadNewProjectImage, deleteUnusedImages, logout, getRole } from "@/functions/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FooterComponent, HeaderComponent, MessageDisplayComponent, PopUpComponent, ScrollComponent, usePopUp } from "@/components";
import SubmitFileConfirmationComponent from "@/components/SubmitFileConfirmationComponent";
import BodyDisplayComponent from "@/components/BodyDisplayComponent";
import Image from "next/image";
import Link from "@/components/ui/link";
import React from "react";
import ProjectSettingsComponent from "@/components/ProjectSettingsComponent";
import FullScreenImageComponent from "@/components/FullScreenImageComponent";


export interface ProjectData {
    name: string,
    year: string,
    data: {
        sidebar: {
            "project-type": string[],
            "team": string[],
            "skillset": string[],
            "approach": string[]
        },
        main: {
            cover: {
                image: string,
                text: string
            },
            body: {
                normal: { image: string, header: string, text: string }[],
                grid: {
                    use: boolean,
                    images: string[],
                    header: string,
                    text: string
                }
            }
        }
    },
    access: "member" | "public"
}

export function ProjectPage({ projectKey, serverData, id, role }:
    { projectKey: string, serverData: ProjectData, id: string, role: string }
) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [data, setData] = useState<ProjectData>(serverData);
    const editMode = searchParams.get("edit") === "true";
    const [popUp, setPopUp] = usePopUp();
    const fileInputRef = useRef(null);
    const fileSubmitRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedImageName, setSelectedImageName] = useState("");
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState(false);
    const [fullScreenImageIndex, setFullScreenImageIndex] = useState(0);


    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle("animate-shown", entry.isIntersecting);
            });
        });
        
        const hiddenElements = document.querySelectorAll(".animate-hidden");
        hiddenElements.forEach((el) => {
            observer.observe(el);
        });

        return () => {
            hiddenElements.forEach((el) => {
                observer.unobserve(el);
            });
        }
    }, [])
    
    const handleSave = async () => {
        const getIndex = (key: string) => key.split("[")[1].split("]")[0];
        const parseUrl = (url: string) => {
            if (url.includes("url=")) {
                const regex = /url=(.*?)&/;
                const match = url.match(regex);
                const originalUrl = match ? decodeURIComponent(match[1]) : null;
                if (originalUrl) {
                    return originalUrl;
                } else {
                    throw new Error("Error parsing url! Please tell Jarrell!");
                }
            } else {
                return url;
            }
        }
        const newData = { ...data! };
        newData.data!.sidebar = {
            "project-type": [],
            "team": [],
            "skillset": [],
            "approach": []
        }
        if (typeof document !== "undefined") {
            document.querySelectorAll(".editable").forEach((el) => {
                if (el instanceof HTMLElement) {
                    const key = el.getAttribute("data-key");
                    if (key) {
                        if (!(el instanceof HTMLImageElement)) {
                            if (key === "name") {
                                newData[key] = el.innerText;
                            } else if (key === "year") {
                                newData[key] = el.innerText;
                            } else if (key.startsWith("sidebar")) {
                                const sidebarKey = key.split(".")[1] as keyof typeof newData.data.sidebar;
                                newData.data.sidebar[sidebarKey] = [
                                    ...newData.data.sidebar[sidebarKey],
                                    ...el.innerText.split("\n")
                                ].filter((item) => item !== "");
                            } else if (key.startsWith("main.cover")) {
                                newData.data!.main.cover.text = el.innerText.replaceAll("\n", "<br>");
                            } else if (key.startsWith("main.body.grid")) {
                                if (key.endsWith("header")) {
                                    newData.data!.main.body.grid.header = el.innerText;
                                } else if (key.endsWith("text")) {
                                    newData.data!.main.body.grid.text = el.innerText.replaceAll("\n", "<br>");
                                }
                            } else if (key.startsWith("main.body")) {
                                const index = parseInt(getIndex(key));
                                if (key.endsWith("header")) {
                                    newData.data!.main.body.normal[index].header = el.innerText;
                                } else if (key.endsWith("text")) {
                                    newData.data!.main.body.normal[index].text = el.innerText.replaceAll("\n", "<br>");
                                }
                            }
                        } else {
                            if (key.startsWith("main.body.grid")) {
                                const index = parseInt(getIndex(key));
                                console.log(el.src)
                                newData.data!.main.body.grid.images[index] = parseUrl(el.src);
                            } else if (key === "main.cover.image") {
                                newData.data!.main.cover.image = parseUrl(el.src);
                            } else {
                                const index = parseInt(getIndex(key));
                                newData.data!.main.body.normal[index].image = parseUrl(el.src);
                            }
                        }
                    }
                }
            });
        }
        const finalImages = [newData.data!.main.cover.image, ...newData.data!.main.body.normal.map((item) => item.image), ...newData.data!.main.body.grid.images];
        const unusedImages = uploadedImages.filter((image) => !finalImages.includes(image));
        if (unusedImages.length > 0) {
            const res = await deleteUnusedImages(unusedImages);
            if (!res.success) {
                setPopUp({ message: "Error deleting unused images! This is a serious error, please tell Jarrell!", type: "warning", duration: 5000 });
                return;
            }
        }
        const res = await saveNewProjectData(projectKey, newData as ProjectData);
        if (res.success) {
            setPopUp({ message: "Project saved!", type: "success", duration: 1000 });
            setTimeout(() => {
                window.location.href = window.location.href.split("?")[0];
            }, 1000)
        } else {
            setPopUp({ message: "Error saving project!", type: "warning", duration: 1000 });
        }
    }

    const handleSettingsChange = (message: string) => {
        if (message === "cancel") {
            setSettingsOpen(false);
        } else if (message === "success") {
            setSettingsOpen(false);
            setPopUp({ message: "Project settings saved!", type: "success", duration: 1000 });
            setTimeout(() => {
                window.location.href = window.location.href.split("?")[0];
            })
        } else {
            setSettingsOpen(false);
            setPopUp({ message: "Error saving project settings!", type: "warning", duration: 1000 });
        }
    }

    const handleImageClick = (e: React.MouseEvent) => {
        if (!editMode) {
            const dataKey = e.currentTarget.getAttribute("data-n-img");
            setFullScreenImageIndex(dataKey ? parseInt(dataKey) : 0);
            setFullScreenImage(true);
            return
        };
        if (fileInputRef.current) {
            const dataKey = e.currentTarget.getAttribute("data-key") as string;
            setSelectedImage(dataKey);
            (fileInputRef.current as HTMLInputElement).click();
        }
    }

    if (role === "admin" && editMode) {
        if (typeof document !== "undefined") {
            document.querySelectorAll(".editable").forEach((el) => {
                if (el instanceof HTMLElement && el.tagName !== "IMG") {
                    el.contentEditable = "true";
                    el.spellcheck = false;
                }
            })
        }
        
    }
    if (role === "none" && data.access === "member") {
        return (
            <main className="flex flex-col items-center justify-between overflow-x-clip">
                <div className="w-screen relative flex flex-col">
                    <HeaderComponent/>
                    <MessageDisplayComponent text="This project is private. Please login to proceed!"/>
                </div>
            </main>
        )
    }

    const textThatBecomesLinks = {
        "Click here to view the full thesis book.":
            <React.Fragment key="link-replace">Click <Link key="thesisbook" className="underline" href="https://www.yumpu.com/en/document/view/68308775/window-to-another-world-spreads" target="_blank" rel="noopener noreferrer">here</Link> to view the full thesis book.</React.Fragment>
    }
    const checkForLinks = (text: string) => {
        for (const key in textThatBecomesLinks) {
            if (text.includes(key)) {
                const split = text.split(key);
                return [
                    <React.Fragment key="link-text-f">{split[0]}</React.Fragment>,
                    textThatBecomesLinks[key as keyof typeof textThatBecomesLinks]!,
                    <React.Fragment key="link-text-b">{split[1]}</React.Fragment>,
                ];
            }
        }
        return text;
    }

    return (
        <main className="flex flex-col items-center justify-between overflow-x-clip">
            <div className="w-screen min-h-[100vh] relative flex flex-col">
                <HeaderComponent newHidden={editMode} />
                {
                    dialogOpen &&
                    <SubmitFileConfirmationComponent
                        item={{ name: selectedImageName }}
                        callback={(message) => {
                            setDialogOpen(false);
                            if (message === "upload") {
                                if (fileSubmitRef.current) {
                                    (fileSubmitRef.current as HTMLInputElement).click();
                                }
                            } else {
                                setSelectedImageName("");
                                setSelectedImage("");
                            }
                        }}
                    />
                }
                {/* Magic input element for image upload */}
                <form
                    className="hidden"
                    action={async (formData: FormData) => {
                        if (selectedImage === "") return;
                        formData.append("id", id)
                        const res = await uploadNewProjectImage(formData);
                        if (res.success) {
                            setPopUp({ message: "Image uploaded!", type: "success", duration: 1000 });
                            const newData = { ...data };
                            if (selectedImage === "main.cover.image") {
                                newData.data.main.cover.image = res.data!;
                            } else if (selectedImage.startsWith("main.body.normal")) {
                                const index = parseInt(selectedImage.split("[")[1].split("]")[0]);
                                newData.data.main.body.normal[index].image = res.data!;
                            } else if (selectedImage.startsWith("main.body.grid")) {
                                const index = parseInt(selectedImage.split("[")[1].split("]")[0]);
                                newData.data.main.body.grid.images[index] = res.data!;
                            }
                            setData(newData);
                            setUploadedImages([...uploadedImages, res.data!]);
                        } else {
                            setPopUp({ message: "Error uploading image!", type: "warning", duration: 1000 });
                        }
                    }}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files?.length > 0) {
                                setSelectedImageName(e.target.files[0].name);
                                setDialogOpen(true);
                            }
                        }} />
                    <input ref={fileSubmitRef} type="submit" />
                </form>
                {
                    fullScreenImage &&
                    <FullScreenImageComponent
                        images={[data.data.main.cover.image, ...data.data.main.body.normal.map((item) => item.image), ...data.data.main.body.grid.images].filter((image) => image !== "")}
                        index={fullScreenImageIndex}
                        close={() => setFullScreenImage(false)}
                    />
                }
                <section className="w-[100%] min-h-[calc(100vh_-_108px)] lg:min-h-[calc(100vh_-_138px)] relative justify-between items-start mt-[40px] lg:mt-[70px] lg:mx-auto flex flex-col lg:flex-row">
                    {
                        editMode &&
                        <>
                            <div className="fixed left-10 top-[20px] z-[2025] gap-4 flex justify-center items-center" >
                                <h4 className="w-fit">Edit mode</h4>
                                <button className="s-regular rounded-2xl border-2 py-2 px-4 hover:bg-white" onClick={() => setSettingsOpen(!settingsOpen)}>Settings</button>
                                <button className="s-regular rounded-2xl border-2 py-2 px-4 hover:bg-white" onClick={handleSave}>Save</button>
                            </div>
                            {settingsOpen &&
                                <ProjectSettingsComponent
                                    data={data}
                                    id={id}
                                    projectKey={projectKey}
                                    callback={handleSettingsChange}
                                />}
                        </>
                    }
                    <div className="flex w-full my-4 lg:mt-0 lg:w-[300px] border-y lg:border-none">
                        <article className="h-fit s-regular flex flex-col items-stretch justify-start ml-[5vw] lg:ml-[30px] py-4 lg:py-[24px]">
                            <ul className="animate-hidden left flex-col justify-start items-start inline-flex">
                                <h2 data-key="name" className={`editable mb-[10px] lg:mb-[15px] ${editMode ? "border" : ""}`}>{data.name}</h2>
                                <h5 data-key="year" className={`editable ${editMode ? "border" : ""}`}>{data.year}</h5>
                            </ul>
                            <ul className="animate-hidden left delay-100 flex-col justify-start items-start inline-flex mt-[20px] lg:mt-[30px]">
                                <h4 className="text-air-force-blue text-[14px] mb-[5px]">PROJECT TYPE</h4>
                                {data.data.sidebar["project-type"].map((string, index) => <li data-key="sidebar.project-type" className={`editable ${editMode ? "border" : ""}`} key={`pt-${index}`}>{string}</li>)}
                            </ul>
                            <ul className="animate-hidden left delay-200 flex-col justify-start items-start inline-flex mt-[22px] lg:mt-[35px]">
                                <h4 className=" text-air-force-blue text-[14px] mb-[5px]">TEAM</h4>
                                {data.data.sidebar["team"].map((string, index) => <li data-key="sidebar.team" className={`editable ${editMode ? "border" : ""}`} key={`t-${index}`}>{string}</li>)}
                            </ul>
                            <ul className="animate-hidden left delay-300 flex-col justify-start items-start inline-flex mt-[22px] lg:mt-[35px]">
                                <h4 className=" text-air-force-blue text-[14px] mb-[5px]">SKILLSET</h4>
                                {data.data.sidebar["skillset"].map((string, index) => <li data-key="sidebar.skillset" className={`editable ${editMode ? "border" : ""}`} key={`s-${index}`}>{string}</li>)}
                            </ul>
                            <ul className="animate-hidden left delay-[400ms] flex-col justify-start items-start inline-flex mt-[22px] lg:mt-[35px]">
                                <h4 className="editable text-air-force-blue text-[14px] mb-[5px]">APPROACH</h4>
                                {data.data.sidebar["approach"].map((string, index) => <li data-key="sidebar.approach" className={`editable ${editMode ? "border" : ""}`} key={`a-${index}`}>{string}</li>)}
                            </ul>
                        </article>
                    </div>
                    <article className={`mx-auto lg:py-[24px] lg:w-[calc(100vw_-_300px)] w-fit flex flex-col justify-center items-center`}>
                        <div className="w-[90%] mt-[20px]">
                            <Image
                                width={0}
                                height={0}
                                sizes="100vw"
                                alt="main.cover.image"
                                data-key="main.cover.image"
                                data-n-img={0}
                                className="editable w-full h-full lg:min-h-[400px] object-cover animate-hidden right"
                                src={data.data.main.cover.image}
                                onClick={handleImageClick}
                                priority={true}
                                loading="eager"
                                draggable={false}
                                onContextMenu={(e) => e.preventDefault()}
                            />
                        </div>
                        <section className="w-[90%] flex-col justify-center items-start flex">
                            <div className="my-[24px] flex flex-col">
                                <h4>BRIEF</h4>
                                <p data-key={`main.cover.text`} className={`editable s-regular ${editMode ? "border" : ""}`}>
                                    {checkForLinks(data.data.main.cover.text.replaceAll("<br>", "\n"))}
                                </p>
                            </div>
                        </section>
                        <BodyDisplayComponent body={data.data.main.body} handleImageClick={handleImageClick} editMode={editMode} />
                    </article>
                    
                </section>
                <ScrollComponent />
                <PopUpComponent popUpProps={popUp}/>
                <FooterComponent/>
            </div>
        </main>
    )
}