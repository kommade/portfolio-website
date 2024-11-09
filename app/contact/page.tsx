import { LoadingComponent } from "@/components"
import React, { Suspense } from 'react'
import Contact from "./page-client"

export const experimental_ppr = true

const ContactWrapper = () => {
    return (
        <Suspense fallback={<LoadingComponent />}>
            <Contact />
        </Suspense>
        )
    }
    
    export default ContactWrapper