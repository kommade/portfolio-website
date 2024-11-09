import Image from "next/image"
import Link from "@/components/ui/link"

const FooterComponent = () => {
  return (
    <footer className="w-full h-[68px] relative flex justify-between items-end px-4 lg:px-10 bg-pale-butter">
        <section className="h-[40%] flex flex-col items-start my-2 lg:my-4">
            <p className="xs-regular text-eggplant-purple">
                ©2024 Juliette Khoo<br/>Designed and built by Juliette and <Link href="https://github.com/kommade" target="_blank" rel="noopener noreferrer"> <u>Jarrell Khoo</u> </Link>
            </p>
        </section>
        <ul className="items-center inline-flex my-2 lg:my-4 justify-between max-w-[145px] gap-[10%]">
            <li className="relative w-[24px] h-[24px] lg:w-[32px] lg:h-[32px]">
                <Link href={"/contact"} rel="noopener noreferrer">
                    <Image
                        src="/icons/email.svg"
                        alt="email svg"
                        fill
                    />
                </Link>
            </li>
            <li className="relative w-[24px] h-[24px] lg:w-[32px] lg:h-[32px]">
                <Link href="https://www.instagram.com/JUEKO_/" target="_blank" rel="noopener noreferrer">
                    <Image
                        src="/icons/instagram.svg"
                        alt="insta svg"
                        fill
                    />
                </Link>
            </li>
            <li className="relative w-[24px] h-[24px] lg:w-[32px] lg:h-[32px]">
                <Link href="https://www.linkedin.com/in/juliette-khoo/" target="_blank" rel="noopener noreferrer">
                    <Image
                        src="/icons/linkedin.svg"
                        alt="linkedin svg"
                        fill
                    />
                </Link>
            </li>
            <li className="relative w-[24px] h-[24px] lg:w-[32px] lg:h-[32px]">
                <Link href="https://medium.com/@khoo.juliette" target="_blank" rel="noopener noreferrer">
                    <Image
                        src="/icons/m.svg"
                        alt="medium svg"
                        fill
                    />
                </Link>
            </li>
        </ul>
    </footer>
  )
}

export default FooterComponent