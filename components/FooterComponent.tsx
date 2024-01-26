import Image from "next/image"
import Link from "next/link"

const FooterComponent = () => {
  return (
    <footer className="w-full h-fit relative flex bg-[#FBFBF1]">
        <section className="w-[40%] h-[40%] flex flex-col items-start my-4 ml-[10%]">
            <article>
                <p className="text-black text-[8px] lg:text-[10px] xl:text-[12px] font-normal font-['Epilogue']">
                ©2024 Juliette Khoo<br/>Designed and built by Juliette and Jarrell Khoo
                </p>
            </article>
        </section>
        <ul className="w-[90%] h-[10%] items-center inline-flex my-auto ml-[30%] mr-[10%] lg:mr-0 justify-between max-w-[145px] gap-[10%]">
            <li>
                <a target="_blank" rel="noopener noreferrer">
                <Image
                    src="/icons/email.svg"
                    alt="email svg"
                    width={24}
                    height={24}
                />
                </a>
            </li>
            <li>
                <Link href="https://www.instagram.com/JUEKO_/" target="_blank" rel="noopener noreferrer">
                    <Image
                        src="/icons/instagram.svg"
                        alt="insta svg"
                        width={24}
                        height={24}
                    />
                </Link>
            </li>
            <li>
                <Link href="https://www.linkedin.com/in/juliette-khoo/" target="_blank" rel="noopener noreferrer">
                    <Image
                        src="/icons/linkedin.svg"
                        alt="linkedin svg"
                        width={24}
                        height={24}
                    />
                </Link>
            </li>
            <li>
                <Link href="https://medium.com/@khoo.juliette" target="_blank" rel="noopener noreferrer">
                    <Image
                        src="/icons/m.svg"
                        alt="medium svg"
                        width={24}
                        height={24}
                    />
                </Link>
            </li>
        </ul>
    </footer>
  )
}

export default FooterComponent