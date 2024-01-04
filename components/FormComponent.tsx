import React, { useState } from 'react';
import { kv } from "@vercel/kv";
import { put } from "@vercel/blob";

const FormComponent: React.FC = () => {
    const handleSubmit = async (formData: FormData) => {
        "use server";
        const keys = await kv.keys("project:*");
        const nextId = keys.length;
        const image = formData.get("image") as File;
        const imageURL = await put(image.name, image, { access: "public"})
        await kv.hmset(`project:${nextId}`, {
            name: formData.get("title"),
            desc: formData.get("desc"),
            image: imageURL.url
        })
    };
    
    return (
        <form className="flex flex-col justify-center items-center" action={handleSubmit}>
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
}
    
export default FormComponent;