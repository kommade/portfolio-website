import { FooterComponent, HeaderComponent, MessageDisplayComponent } from "@/components"
import React from 'react'

export const experimental_ppr = true

const notFound = () =>
    <main className="flex flex-col items-center justify-between overflow-x-clip">
        <div className="w-screen relative flex flex-col">
            <HeaderComponent />
            <MessageDisplayComponent/>
            <FooterComponent/>
        </div>
    </main>

export default notFound