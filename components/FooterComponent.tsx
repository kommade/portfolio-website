import Image from "next/image"
import Link from "next/link"

const FooterComponent = () => {
  return (
    <footer className="w-full h-[68px] relative flex justify-between px-10 bg-pale-butter">
        <section className="h-[40%] flex flex-col items-start my-4">
            <article>
                <p className="xs-regular text-eggplant-purple">
                ©2024 Juliette Khoo<br/>Designed and built by Juliette and Jarrell Khoo
                </p>
            </article>
        </section>
        <ul className="items-center inline-flex my-4 lg:mr-0 justify-between max-w-[145px] gap-[10%]">
            <li>
                <Link href={"/contact"} rel="noopener noreferrer">
                <Image
                    src="/icons/email.svg"
                    alt="email svg"
                    width={32}
                    height={32}
                />
                </Link>
            </li>
            <li>
                <Link href="https://www.instagram.com/JUEKO_/" target="_blank" rel="noopener noreferrer">
                    <Image
                        src="/icons/instagram.svg"
                        alt="insta svg"
                        width={32}
                        height={32}
                    />
                </Link>
            </li>
            <li>
                <Link href="https://www.linkedin.com/in/juliette-khoo/" target="_blank" rel="noopener noreferrer">
                    <Image
                        src="/icons/linkedin.svg"
                        alt="linkedin svg"
                        width={32}
                        height={32}
                    />
                </Link>
            </li>
            <li>
                <Link href="https://medium.com/@khoo.juliette" target="_blank" rel="noopener noreferrer">
                    <Image
                        src="/icons/m.svg"
                        alt="medium svg"
                        width={32}
                        height={32}
                    />
                </Link>
            </li>
        </ul>
    </footer>
  )
}

export default FooterComponent