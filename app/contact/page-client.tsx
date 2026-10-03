"use client";

import { useState } from "react";
import { submitContactForm } from "@/functions/actions";
import PortfolioShell, { DesignIcon } from "@/components/PortfolioShell";

export default function Contact() {
    const [sent, setSent] = useState(false);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    return <PortfolioShell title="Contact">
        <div className="contact-layout">
            <div className={`contact-card${sent ? " contact-success" : ""}`}>
                {sent ? <div role="status" className="key-intro"><DesignIcon name="sent" /><p className="l-regular">Your message has been sent</p></div> :
                    <form onSubmit={async event => {
                        event.preventDefault();
                        if (pending) return;
                        const formData = new FormData(event.currentTarget);
                        setPending(true); setError("");
                        try {
                            const result = await submitContactForm(formData);
                            if (result.success) setSent(true);
                            else setError(result.message === "invalid email" ? "Please enter a valid email address." : "Your message could not be sent. Please try again.");
                        } catch { setError("Your message could not be sent. Please try again."); }
                        finally { setPending(false); }
                    }} aria-busy={pending}>
                        <label className="l-regular">Name<input className="l-regular" name="name" autoComplete="name" required maxLength={200} /></label>
                        <label className="l-regular">Email Address<input className="l-regular" name="email" type="email" autoComplete="email" required maxLength={320} /></label>
                        <label className="l-regular">Message<textarea className="l-regular" name="message" required maxLength={10000} /></label>
                        {error && <p className="form-error xs-regular" role="alert">{error}</p>}
                        <button className="l-regular design-button" disabled={pending} type="submit">{pending ? "Sending…" : "Send Message"}<DesignIcon name="send" /></button>
                    </form>}
            </div>
            <aside className="contact-copy">
                <h2 className="h5 section-heading">Thanks for dropping by!</h2>
                <p className="l-regular">If you’d like to get in touch, please use the form and I’ll get back to you within 3-5 working days. In the meantime, connect with me on</p>
                <p className="l-regular"><a className="l-regular" href="https://www.linkedin.com/in/juliette-khoo/" target="_blank" rel="noopener noreferrer">LinkedIn<DesignIcon name="external" /></a> and <a className="l-regular" href="https://medium.com/@khoo.juliette" target="_blank" rel="noopener noreferrer">Medium<DesignIcon name="external" /></a>.</p>
            </aside>
        </div>
    </PortfolioShell>;
}
