import UploadComponent from "@/components/UploadComponent";
import HeaderComponent from "@/components/HeaderComponent";
import FooterComponent from "@/components/FooterComponent";

export default function Projects() {
    return (
      <main className="flex flex-col items-center justify-between overflow-x-clip">
        <div className="w-screen relative flex flex-col">
          <HeaderComponent/>

          <div className="w-[85%] h-fit left-[7.5%] relative justify-center mt-28">
            <h1>
              Future see all page
            </h1>
          </div>
          <FooterComponent/>
        </div>
      </main>
    )
  }
  