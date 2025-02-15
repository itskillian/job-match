import ThemeToggle from '@/components/theme-toggle';
import ResumeForm from '@/components/resume-form';

export default function Home() {
  return (
    <div className='min-w-[320px] py-4 px-8 h-full max-w-[640px] mx-auto'>
      <div className='flex justify-end w-full'>
          <ThemeToggle /> 
      </div>
      <h1 className='
        flex justify-center pb-2 m-4
        text-4xl font-bold 
        bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent
        tracking-wider
        transition-transform duration-1000 hover:scale-105
        '
      >Job Match</h1>
      <div className='flex flex-col items-center justify-center mx-auto h-4/5'>  
        <div className='flex items-center w-full h-full'>
          <ResumeForm />
        </div>
      </div>
    </div>
  )
}