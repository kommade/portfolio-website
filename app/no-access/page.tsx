import HeaderComponent from "@/components/HeaderComponent";
import FooterComponent from "@/components/FooterComponent";
import MessageDisplayComponent from "@/components/MessageDisplayComponent";
import React from 'react'

const notFound = () =>
    <main className="flex flex-col items-center justify-between overflow-x-clip">
        <div className="w-screen relative flex flex-col">
            <HeaderComponent />
            <MessageDisplayComponent/>
            <FooterComponent/>
        </div>
    </main>

export default notFound