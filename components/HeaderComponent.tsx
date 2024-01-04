const HeaderComponent = () => {
  return (
    <header className="title-header w-full h-fit fixed z-10 bg-orange-50 flex flex-col justify-center border-b-2 border-neutral-400">
        <a href="/" rel="noopener noreferrer">
            <h1 className="text-center text-blue-500 text-[40px] font-normal font-['Junicode'] p-1">
                Juliette Khoo
            </h1>
        </a>
    </header>
  )
}

export default HeaderComponent