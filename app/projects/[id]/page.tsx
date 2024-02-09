"use client";

import { getProjectKey, isAllowedToAccess, getProjectData, saveNewProjectData, saveNewProjectImage } from "@/functions/actions";
import { getToken, logout } from "@/functions/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FooterComponent, HeaderComponent, LoadingComponent, MessageDisplayComponent, PopUpComponent, ScrollComponent, usePopUp } from "@/components";
import SubmitFileConfirmationComponent from "@/components/SubmitFileConfirmationComponent";

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
            "brief": string,
            "problem-definition": string,
            "research-and-ideation": string
        },
        images: string[]
    }
}

export default function ProjectPage({
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
    const [selectedImage, setSelectedImage] = useState(-1);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedImageName, setSelectedImageName] = useState("");
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
                    return;
            }
            let res = await getProjectKey(params.id);
            console.log(res)
            if (!res.success) {
                return;
            }
            const projectKey = res.data as string;
            if (!projectKey) {
                return;
            }
            setProjectKey(projectKey);
            res = await getProjectData(projectKey);
            console.log(res)
            if (!res.success) {
                return;
            }
            setData(res.data as ProjectData | null);
            setIsLoading(false);
        };
        fetchData();
        if (editMode) {
            checkAccess();
        }
    }, [params.id, editMode, router]);
    
    const handleSave = async () => { 
        type possibleKeys = 'sidebar' | 'main' | 'project-type' | "team" | 'skillset' | 'approach' | 'brief' | 'problem-definition' | 'research-and-ideation';
        const newData = { ...data };
        newData.data!.sidebar = {
            "project-type": [],
            "team": [],
            "skillset": [],
            "approach": []
        }
        document.querySelectorAll(".editable").forEach((el) => {
            if (el instanceof HTMLElement && el.tagName !== "IMG") {
                const key = el.getAttribute("data-key");
                if (key) {
                    if (key === "name") {
                        (newData as any)[key] = el.innerText;
                    } else if (key === "year") {
                        (newData as any)[key] = parseInt(el.innerText);
                    } else {
                        // FORGIVE ME TYPESCRIPT GODS
                        const keys = key.split("['").map((str) => str.replace("']", "") as possibleKeys);
                        let current = newData.data;
                        for (let i = 0; i < keys.length - 1; i++) {
                            //@ts-ignore
                            current = current[keys[i]];
                        }
                        if (key.startsWith("sidebar")) {
                            //@ts-ignore
                            current[keys[keys.length - 1]].push(el.textContent || "");
                        } else {
                            //@ts-ignore
                            current[keys[keys.length - 1]] = el.textContent || "";
                        }
                    }
                }
            }
        });
        console.log(newData)
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
            setSelectedImage(parseInt(dataKey));
            (fileInputRef.current as HTMLInputElement).click();
        }
    }

    if (!adminAcess && editMode && !isLoading) {
        return (
            <main className="flex flex-col items-center justify-between overflow-x-clip">
                <div className="w-screen relative flex flex-col">
                    <HeaderComponent />
                    <MessageDisplayComponent text="e" />
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
        return (
            <main className="flex flex-col items-center justify-between overflow-x-clip">
                <div className="w-screen relative flex flex-col">
                    <HeaderComponent/>
                    <LoadingComponent/>
                </div>
            </main>
        )
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
                                setSelectedImage(-1);
                            }
                        }}
                    />
                }
                <form
                    className="hidden"
                    action={async (formData: FormData) => {
                        if (selectedImage === -1) return;
                        formData.append("key", projectKey);
                        formData.append("index", selectedImage.toString());
                        const res = await saveNewProjectImage(formData);
                        if (res.success) {
                            setPopUp({ message: "Image uploaded!", type: "success", duration: 1000 });
                            const newData = { ...data };
                            newData.data.images[selectedImage] = res.data as string;
                            setData(newData);
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
                {/* Magic input element for image upload */}
                <section className="w-[100%] min-h-[calc(100vh_-_108px)] lg:min-h-[calc(100vh_-_138px)] relative justify-between items-start mt-[40px] lg:mt-[70px] lg:mx-auto flex flex-col lg:flex-row">
                    {editMode &&
                        <div className="fixed left-10 top-[20px] z-[2002] flex justify-center items-center" >
                            <h4 className="w-[100px]">Edit mode</h4>
                            <button className="s-regular rounded-2xl border-2 py-2 px-4 hover:bg-white" onClick={handleSave}>Save</button>
                        </div>
                    }
                    <div className={`flex w-full my-4 lg:mt-0 lg:w-[300px] border-y lg:border-none`}>
                        <article className={`h-fit s-regular flex flex-col justify-start items-start mx-auto py-4 lg:py-[60px] px-20 lg:px-0 `}>
                            <ul className="flex-col justify-start items-start inline-flex">
                                <h2 data-key="name" className="editable mb-[15px]">{data.name}</h2>
                                <h5 data-key="year" className="editable">{data.year}</h5>
                            </ul>
                            <ul className="flex-col justify-start items-start inline-flex mt-[30px]">
                                <h4 className="text-air-force-blue text-[14px] mb-[5px]">PROJECT TYPE</h4>
                                {data.data.sidebar["project-type"].map((string, index) => <li data-key="sidebar['project-type']" className="editable" key={`pt-${index}`}>{string}</li>)}
                            </ul>
                            <ul className="flex-col justify-start items-start inline-flex mt-[35px]">
                                <h4 className=" text-air-force-blue text-[14px] mb-[5px]">TEAM</h4>
                                {data.data.sidebar["team"].map((string, index) => <li data-key="sidebar['team']" className="editable" key={`t-${index}`}>{string}</li>)}
                            </ul>
                            <ul className="flex-col justify-start items-start inline-flex mt-[35px]">
                                <h4 className=" text-air-force-blue text-[14px] mb-[5px]">SKILLSET</h4>
                                {data.data.sidebar["skillset"].map((string, index) => <li data-key="sidebar['skillset']" className="editable" key={`s-${index}`}>{string}</li>)}
                            </ul>
                            <ul className="flex-col justify-start items-start inline-flex mt-[35px]">
                                <h4 className="editable text-air-force-blue text-[14px] mb-[5px]">APPROACH</h4>
                                {data.data.sidebar["approach"].map((string, index) => <li data-key="sidebar['approach']" className="editable" key={`a-${index}`}>{string}</li>)}
                            </ul>
                        </article>
                    </div>
    
                    <article className={`mx-auto lg:py-[60px] lg:w-[calc(100vw_-_300px)] w-fit flex flex-col justify-center items-center`}>
                        <div className="w-[90%]">
                            <img data-key={0} className="editable w-full h-full object-cover" src={data.data.images[0]} onClick={handleImageClick}/>
                        </div>
                        <section className="w-[90%] flex-col justify-center items-start flex mt-[60px]">
                            <h4>BRIEF</h4>
                            <p data-key="main['brief']" className="editable s-regular my-[10px]">
                                {data.data.main["brief"]}
                            </p>
                        </section>
                        <section className="w-[90%] flex-col justify-center items-start flex mt-[60px]">
                            <h4>PROBLEM DEFINITION</h4>
                            <p data-key="main['problem-definition']" className="editable s-regular my-[10px]">
                                {data.data.main["problem-definition"]}
                            </p>  
                        </section>
                        <div className="w-[90%] mt-[20px]">
                            <img data-key={1} className="editable w-full object-cover" src={data.data.images[1]} onClick={handleImageClick}/>
                        </div>
                        <section className="w-[90%] flex-col justify-start items-start flex mt-[60px]">
                            <h4>RESEARCH AND IDEATION</h4>
                            <p data-key="main['research-and-ideation']" className="editable s-regular my-[10px]">
                                {data.data.main["research-and-ideation"]}
                            </p>
                            <article className="w-full lg:aspect-[11/9] flex flex-col gap-4 lg:gap-6 mt-[20px]">
                                <div className="w-full justify-start items-stretch gap-4 lg:gap-6 inline-flex flex-col lg:flex-row">
                                    <div className="lg:w-[63%] aspect-[17/12]">
                                        <img data-key={2} className="editable w-full h-full object-cover" src={data.data.images[2]} onClick={handleImageClick}/>
                                    </div>
                                    <div className="lg:w-[37%] aspect-[14/17]">
                                        <img data-key={3} className="editable w-full h-full object-cover" src={data.data.images[3]} onClick={handleImageClick}/>
                                    </div>
                                </div>
                                <div className="w-full justify-start items-stretch gap-4 lg:gap-6 inline-flex flex-col lg:flex-row">
                                    <div className="lg:w-[50%] aspect-[7/5]">
                                        <img data-key={4} className="editable w-full h-full object-cover" src={data.data.images[4]} onClick={handleImageClick}/>
                                    </div>
                                    <div className="lg:w-[50%] aspect-[7/5]">
                                        <img data-key={5} className="editable w-full h-full object-cover" src={data.data.images[5]} onClick={handleImageClick}/>
                                    </div>
                                </div>
                            </article>
                        </section>
                        <section className="w-[90%] flex-col justify-start items-start flex">
                            <h4 className="my-[60px]">PROTOTYPING, DESIGN AND PITCHING</h4>
                            <article className="w-full lg:aspect-[11/9] flex flex-col gap-4 lg:gap-6">
                                <div className="w-full justify-start items-stretch gap-4 lg:gap-6 inline-flex flex-col lg:flex-row">
                                    <div className="lg:w-[63%] aspect-[17/12]">
                                        <img data-key={6} className="editable w-full h-full object-cover" src={data.data.images[6]} onClick={handleImageClick}/>
                                    </div>
                                    <div className="lg:w-[37%] aspect-[14/17]">
                                        <img data-key={7} className="editable w-full h-full object-cover" src={data.data.images[7]} onClick={handleImageClick}/>
                                    </div>
                                </div>
                                <div className="w-full justify-start items-stretch gap-4 lg:gap-6 inline-flex flex-col lg:flex-row">
                                    <div className="lg:w-[50%] aspect-[7/5]">
                                        <img data-key={8} className="editable w-full h-full object-cover" src={data.data.images[8]} onClick={handleImageClick}/>
                                    </div>
                                    <div className="lg:w-[50%] aspect-[7/5]">
                                        <img data-key={9} className="editable w-full h-full object-cover" src={data.data.images[9]} onClick={handleImageClick}/>
                                    </div>
                                </div>
                            </article>
                        </section>
                    </article>
                    
                </section>
                <ScrollComponent />
                <PopUpComponent popUpProps={popUp}/>
                <FooterComponent/>
            </div>
      </main>
    )
}