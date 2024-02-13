import React from 'react'
import { ProjectData } from "@/app/projects/[id]/page-client";
import Image from "next/image";

const textThatBecomesLinks = {
    "5 things I wish I knew before I conducted my first usability test":
        <a key="usabilitytest" className="underline" href="https://bootcamp.uxdesign.cc/5-things-i-wish-i-knew-before-conducting-my-first-usability-test-8f0d1540f5bf" target="_blank" rel="noopener noreferrer"> 5 things I wish I knew before I conducted my first usability test</a>,
}
const checkForLinks = (text: string) => {
    for (const key in textThatBecomesLinks) {
        if (text.includes(key)) {
            return [
                <React.Fragment key="link-text">{text.replace(key, "")}</React.Fragment>,
                textThatBecomesLinks[key as keyof typeof textThatBecomesLinks]!
            ];
        }
    }
    return text;
}

const renderMainBody = (component: any, index: number, editMode: boolean,  handleImageClick: (e: React.MouseEvent) => void) => {
    let state = component.text === "" ? (component.header === "" ? "none" : "header only") : "header and text";
    if (editMode) state = "header and text";
    return (
        
        <section key={`body-${index}`} className="w-[90%] flex-col justify-center items-start flex">
            {state === "none" ? (
                <div className="h-[24px]"></div>
            ) : (
                <div className={`my-[24px] flex flex-col ${state === "header only" ? "" : "gap-[10px]"} w-[100%]`}>
                    <h4 data-key={`main.body.normal[${index}].header`} className={`editable ${editMode ? "border min-w-[20px]" : ""}`}>
                        {component.header}
                    </h4>
                    <p data-key={`main.body.normal[${index}].text`} className={`editable s-regular ${editMode ? "border min-w-[20px]" : ""}`}>
                        {checkForLinks(component.text.replaceAll("<br>", "\n"))}
                    </p>
                </div>
            )}
            <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                alt=""
                data-key={`main.body.normal[${index}].image`}
                className="editable w-full h-full lg:min-h-[400px] object-cover"
                src={component.image}
                onClick={handleImageClick}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
            />
        </section>
    );
};

const BodyDisplayComponent = ({ body, handleImageClick, editMode }: { body: ProjectData["data"]["main"]["body"]; handleImageClick: (e: React.MouseEvent) => void; editMode: boolean }) => {
    
    if (body.grid.use) {
        let gridState = body.grid.text === "" ? (body.grid.header === "" ? "none" : "header only") : "header and text";
        if (editMode) gridState = "header and text";
        return (
            <>
                {body.normal.map((component, index) => renderMainBody(component, index, editMode, handleImageClick))}
                <section className="w-[90%] flex-col justify-center items-start flex">
                    {gridState === "none" ? (
                        <div className="h-0 my-[12px]"></div>
                    ) : (
                        <div className={`my-[24px] flex flex-col ${gridState === "header only" ? "" : "gap-[10px]"} w-[100%]`}>
                            <h4 data-key={`main.body.grid.header`} className={`editable ${editMode ? "border" : ""}`}>
                                {body.grid.header}
                            </h4>
                            <p data-key={`main.body.grid.text`} className={`editable s-regular ${editMode ? "border" : ""}`}>
                                {checkForLinks(body.grid.text.replaceAll("<br>", "\n"))}
                            </p>
                        </div>
                    )}
                    <div className="lg:min-h-[400px] lg:aspect-[11/9] flex flex-col gap-4 lg:gap-6">
                        <div className="w-full justify-start items-stretch gap-4 lg:gap-6 inline-flex flex-col lg:flex-row">
                            <div className="lg:w-[63%] aspect-[17/12]">
                                <Image
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    loading="lazy"
                                    alt=""
                                    data-key={`main.body.grid.images[0]`}
                                    className="editable w-full h-full object-cover"
                                    src={body.grid.images[0]}
                                    onClick={handleImageClick}
                                    draggable={false}
                                    onContextMenu={(e) => e.preventDefault()}
                                />
                            </div>
                            <div className="lg:w-[37%] aspect-[14/17]">
                                <Image
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    loading="lazy"
                                    alt=""
                                    data-key={`main.body.grid.images[1]`}
                                    className="editable w-full h-full object-cover"
                                    src={body.grid.images[1]}
                                    onClick={handleImageClick}
                                    draggable={false}
                                    onContextMenu={(e) => e.preventDefault()}
                                />
                            </div>
                        </div>
                        <div className="w-full justify-start items-stretch gap-4 lg:gap-6 inline-flex flex-col lg:flex-row">
                            <div className="lg:w-[50%] aspect-[7/5]">
                                <Image
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    loading="lazy"
                                    alt=""
                                    data-key={`main.body.grid.images[2]`}
                                    className="editable w-full h-full object-cover"
                                    src={body.grid.images[2]}
                                    onClick={handleImageClick}
                                    draggable={false}
                                    onContextMenu={(e) => e.preventDefault()}
                                />
                            </div>
                            <div className="lg:w-[50%] aspect-[7/5]">
                                <Image
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    loading="lazy"
                                    alt=""
                                    data-key={`main.body.grid.images[3]`}
                                    className="editable w-full h-full object-cover"
                                    src={body.grid.images[3]}
                                    onClick={handleImageClick}
                                    draggable={false}
                                    onContextMenu={(e) => e.preventDefault()}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    } else {
        return <>{body.normal.map((component, index) => renderMainBody(component, index, editMode, handleImageClick))}</>;
    }
};

export default BodyDisplayComponent