import { LoadingComponent } from "@/components"
import React, { Suspense } from 'react'
import Contact from "./page-client"

const ContactWrapper = () => {
    return (
        <Suspense fallback={<LoadingComponent />}>
            <Contact />
        </Suspense>
        )
    }
    
    export default ContactWrapper