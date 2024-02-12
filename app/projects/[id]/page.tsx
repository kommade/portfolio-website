"use client";

import { getProjectKey, isAllowedToAccess, getProjectData, saveNewProjectData, uploadNewProjectImage, deleteUnusedImages } from "@/functions/actions";
import { getToken, logout } from "@/functions/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import { FooterComponent, HeaderComponent, LoadingComponent, MessageDisplayComponent, PopUpComponent, ScrollComponent, usePopUp } from "@/components";
import SubmitFileConfirmationComponent from "@/components/SubmitFileConfirmationComponent";
import BodyDisplayComponent from "@/components/BodyDisplayComponent";
import Image from "next/image";

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
    }
}

function ProjectPage({
    params,
}: {
    params: { id: string };
    }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [data, setData] = useState<ProjectData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [access, setAccess] = useState(false);
    const [adminAcess, setAdminAccess] = useState(false);
    const editMode = searchParams.get("edit") === "true";
    const [projectKey, setProjectKey] = useState("");
    const [popUp, setPopUp] = usePopUp();
    const fileInputRef = useRef(null);
    const fileSubmitRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedImageName, setSelectedImageName] = useState("");
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    useEffect(() => {
        const checkAccess = async () => {
            const allowed = await isAllowedToAccess(getToken(), 'admin');
            switch (allowed) {
                case "expired":
                    logout();
                    router.push("/expired=true")
                    return;
                case "yes":
                    setAdminAccess(true);
                    return;
                default:
                    return;
            }
        }
        const fetchData = async () => {
            const token = getToken();
            const allowed = await isAllowedToAccess(token, params.id)
            switch (allowed) {
                case "expired":
                    logout();
                    router.push("/expired=true");
                    return;
                case "yes":
                    setAccess(true);
                    break;
                default:
                    setIsLoading(false);
                    return;
            }
            let res = await getProjectKey(params.id);
            if (!res.success) {
                return;
            }
            const projectKey = res.data as string;
            if (!projectKey) {
                return;
            }
            setProjectKey(projectKey);
            res = await getProjectData(projectKey);
            if (!res.success) {
                return;
            }
            setData(res.data as ProjectData | null);
            setIsLoading(false);
        };
        if (editMode) {
            checkAccess();
        }
        fetchData();
    }, [params.id, editMode, router]);
    
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
                            ];
                        } else if (key.startsWith("main.cover")) {
                            newData.data!.main.cover.text = el.innerText;
                        } else if (key.startsWith("main.body")) {
                            const index = parseInt(getIndex(key));
                            if (key.endsWith("header")) {
                                newData.data!.main.body.normal[index].header = el.innerText;
                            } else if (key.endsWith("text")) {
                                newData.data!.main.body.normal[index].text = el.innerText;
                            }
                        }
                    } else {
                        if (key.startsWith("main.body.grid")) {
                            const index = parseInt(getIndex(key));
                            (newData.data!.main.body.grid as any).images[index] = parseUrl(el.src);
                        } else if (key === "main.cover.image") {
                            newData.data!.main.cover.image = parseUrl(el.src);
                        } else {
                            const index = parseInt(getIndex(key));
                            (newData.data!.main.body.normal[index] as any).image = parseUrl(el.src);
                        }
                    }
                }
            }
        });
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
                router.push(`/projects/${params.id}`);
            }, 1000)
        } else {
            setPopUp({ message: "Error saving project!", type: "warning", duration: 1000 });
        }
    }

    const handleImageClick = (e: React.MouseEvent) => {
        if (!editMode) return;
        if (fileInputRef.current) {
            const dataKey = e.currentTarget.getAttribute("data-key") as string;
            setSelectedImage(dataKey);
            (fileInputRef.current as HTMLInputElement).click();
        }
    }

    if (!adminAcess && editMode && !isLoading) {
        return (
            <main className="flex flex-col items-center justify-between overflow-x-clip">
                <div className="w-screen relative flex flex-col">
                    <HeaderComponent />
                    <MessageDisplayComponent/>
                </div>
            </main>
        )
    } else if (adminAcess && editMode && !isLoading) { 
        document.querySelectorAll(".editable").forEach((el) => {
            if (el instanceof HTMLElement && el.tagName !== "IMG") {
                el.contentEditable = "true";
                el.spellcheck = false;
            }
        })
    }
    if (!access && !isLoading) {
        return (
            <main className="flex flex-col items-center justify-between overflow-x-clip">
                <div className="w-screen relative flex flex-col">
                    <HeaderComponent/>
                    <MessageDisplayComponent text="This project is private. Please login to proceed!"/>
                </div>
            </main>
        )
    }
    if (isLoading) {
        return <LoadingComponent />
    } else if (data === null) {
        return (
            <main className="flex flex-col items-center justify-between overflow-x-clip">
                <div className="w-screen relative flex flex-col">
                    <HeaderComponent/>
                    <MessageDisplayComponent text="Whoops! Something went wrong. "/>
                </div>
            </main>
        );
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
                        formData.append("id", params.id)
                        const res = await uploadNewProjectImage(formData);
                        if (res.success) {
                            setPopUp({ message: "Image uploaded!", type: "success", duration: 1000 });
                            const newData = { ...data };
                            if (selectedImage === "main.cover.image") {
                                newData.data.main.cover.image = res.data!;
                            } else {
                                const index = parseInt(selectedImage.split("[")[1].split("]")[0]);
                                newData.data.main.body.normal[index].image = res.data!;
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
                <section className="w-[100%] min-h-[calc(100vh_-_108px)] lg:min-h-[calc(100vh_-_138px)] relative justify-between items-start mt-[40px] lg:mt-[70px] lg:mx-auto flex flex-col lg:flex-row">
                    {editMode &&
                        <div className="fixed left-10 top-[20px] z-[2025] flex justify-center items-center" >
                            <h4 className="w-[100px]">Edit mode</h4>
                            <button className="s-regular rounded-2xl border-2 py-2 px-4 hover:bg-white" onClick={handleSave}>Save</button>
                        </div>
                    }
                    <div className={`flex w-full my-4 lg:mt-0 lg:w-[300px] border-y lg:border-none`}>
                        <article className={`h-fit s-regular flex flex-col justify-start items-start ml-[5vw] lg:ml-[30px] py-4 lg:py-[24px]`}>
                            <ul className="flex-col justify-start items-start inline-flex">
                                <h2 data-key="name" className={`editable mb-[10px] lg:mb-[15px] ${editMode ? "border" : ""}`}>{data.name}</h2>
                                <h5 data-key="year" className={`editable ${editMode ? "border" : ""}`}>{data.year}</h5>
                            </ul>
                            <ul className="flex-col justify-start items-start inline-flex mt-[20px] lg:mt-[30px]">
                                <h4 className="text-air-force-blue text-[14px] mb-[5px]">PROJECT TYPE</h4>
                                {data.data.sidebar["project-type"].map((string, index) => <li data-key="sidebar.project-type" className={`editable ${editMode ? "border" : ""}`} key={`pt-${index}`}>{string}</li>)}
                            </ul>
                            <ul className="flex-col justify-start items-start inline-flex mt-[22px] lg:mt-[35px]">
                                <h4 className=" text-air-force-blue text-[14px] mb-[5px]">TEAM</h4>
                                {data.data.sidebar["team"].map((string, index) => <li data-key="sidebar.team" className={`editable ${editMode ? "border" : ""}`} key={`t-${index}`}>{string}</li>)}
                            </ul>
                            <ul className="flex-col justify-start items-start inline-flex mt-[22px] lg:mt-[35px]">
                                <h4 className=" text-air-force-blue text-[14px] mb-[5px]">SKILLSET</h4>
                                {data.data.sidebar["skillset"].map((string, index) => <li data-key="sidebar.skillset" className={`editable ${editMode ? "border" : ""}`} key={`s-${index}`}>{string}</li>)}
                            </ul>
                            <ul className="flex-col justify-start items-start inline-flex mt-[22px] lg:mt-[35px]">
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
                                className="editable w-full h-full lg:min-h-[400px] object-cover"
                                src={data.data.main.cover.image}
                                onClick={handleImageClick}
                                priority={true}
                            />
                        </div>
                        <section className="w-[90%] flex-col justify-center items-start flex">
                            <div className="my-[24px] flex flex-col">
                                <h4>BRIEF</h4>
                                <p data-key={`main.cover.text`} className={`editable s-regular ${editMode ? "border" : ""}`}>
                                    {data.data.main.cover.text}
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

export default function ProjectPageWrapper({ params }: { params: { id: string } }) {
    return (
        <Suspense fallback={<LoadingComponent />}>
            <ProjectPage params={params} />
        </Suspense>
    )
}