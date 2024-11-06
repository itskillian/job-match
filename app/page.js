import Image from "next/image";
import Chat from "@/components/chat"
import Resume from "@/components/resume"

export default function Home() {
  return (
    <div className="flex justify-center items-center min-w-[320px] mx-auto h-screen">
      {/* <Chat /> */}
      <Resume />
    </div>
  )
}
