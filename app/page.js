import Resume from '@/components/resume';
import ThemeToggle from '@/components/theme-toggle';
export default function Home() {
  return (
    <div className='flex flex-col items-center min-w-[320px] max-w-[480px] p-4 mx-auto h-screen'>
      <div className='flex justify-end w-full'>
        <ThemeToggle /> 
      </div>
      <div className='flex flex-col items-center justify-center w-full h-3/4'>
        <Resume />
      </div>
    </div>
  )
}