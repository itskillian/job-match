import Resume from '@/components/resume';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-w-[320px] max-w-[480px] p-4 mx-auto h-screen">
      <Resume />
    </div>
  )
}