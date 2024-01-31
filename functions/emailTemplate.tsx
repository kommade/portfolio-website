import React from 'react'

type emailProps = {
    name: string,
    email: string,
    message: string
}

const emailTemplate: React.FC<emailProps> = ({
    name,
    email,
    message,
}) => (
    <div>
        <h2>Contact Form Submission</h2>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Message:</strong> {message}</p>
    </div>
);


export default emailTemplate