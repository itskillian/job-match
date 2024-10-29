import Image from "next/image";
import Chat from "@/components/chat"
import Resume from "@/components/resume"

export default function Home() {
  return (
    <div className="min-w-[320px] sm:w-4/5 mx-auto">
      <Chat />
      <Resume />
    </div>
  )
}
