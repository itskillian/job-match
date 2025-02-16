'use client'

import ReactMarkdown from 'react-markdown'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

// const FILESIZELIMIT = 10 * 1024 * 1024;

const formSchema = z.object({
  file: typeof window === 'undefined' ? z.any() : z.instanceof(FileList)
    .refine((fileList) =>
      fileList.length === 1 &&
      fileList[0] &&
      [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/markdown'
      ].includes(fileList[0].type),
      {
        message: 'Please upload a PDF, DOC, DOCX, TXT, or MD file' 
      }
    ),
    // .refine((file) => file.size <= FILESIZELIMIT, {
    //   message: `File must be less than ${FILESIZELIMIT / 1024 / 1024}MB`
    // }),
  desc: z.string().min(10, {
    message: 'Description must be at least 10 characters long',
  }),
})

export default function ResumeForm() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      desc: '',
    },
  });

  const fileRef = form.register('file');

  async function handleFile(event) {
    let selectedFile = event.target.files[0];
    setFile(selectedFile);
  }

  async function onSubmit (data) {
    console.log(data);
    
    const formData = new FormData();
    formData.append('file', data.file[0]);
    formData.append('desc', data.desc);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        console.log(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setMessage(result.data[0].content[0].text.value);
    } catch (err) {
      console.error('Error submitting form:', err);
      setMessage('An error occurred. Please try again');
    }
  }
  
  return (
    <div className='flex flex-col items-center justify-center w-full'>
      <Form {...form}>
        <form 
          action='/api/assistant' 
          method='post' 
          onSubmit={form.handleSubmit(onSubmit)} 
          encType='multipart/form-data'
          className='space-y-2 w-full'
          // target='hiddenFrame'
        >
          <FormField
            control={form.control}
            name='file'
            render={({ field }) => {
              return (
                <FormItem>
                  {/* <FormLabel>Upload Resume</FormLabel> */}
                  <FormControl>
                    <Input 
                      type='file'
                      {...fileRef}
                      accept='.pdf, .doc, .docx, .md, .txt'
                      className='
                        w-full h-full rounded-3xl
                        dark:bg-slate-950
                        text-slate-500 text-sm
                        file:ml-[-6px] file:mr-4 file:py-2 file:px-4
                        file:border-0 file:rounded-3xl
                        file:text-sm file:font-semibold
                        file:bg-slate-100 file:text-gray-700
                        dark:file:bg-slate-400 dark:file:text-gray-900
                        file:transition-all file:duration-300
                        hover:file:bg-slate-200 dark:hover:file:bg-slate-300
                        active:file:scale-95 active:file:bg-slate-300
                      '
                    />
                  </FormControl>
                  <FormDescription>Upload a .pdf, .doc, .docx, .md or .txt file</FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name='desc'
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Enter Job Description</FormLabel> */}
                <FormControl>
                  <Textarea
                    className='
                      h-20 resize-none rounded-3xl px-4
                      dark:bg-slate-950
                      text-sm text-slate-500
                      transition-all
                      dark:placeholder:text-slate-500
                    '
                    placeholder='Paste a job description here'
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>Paste a job description here</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type='submit'
            className='
              w-full rounded-3xl py-6 
              text-md font-semibold
              transition-all duration-300
              bg-slate-700
            dark:bg-slate-400 dark:hover:bg-slate-300 
            hover:bg-slate-800 
              active:scale-95 active:bg-slate-600 
            '
          >
            Match Resume
          </Button>
          {/* <iframe name='hiddenFrame' className='hidden'></iframe> */}
        </form>
      </Form>
      <div className='w-full rounded-3xl mt-2'>
        <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className='text-blue-500' {...props} />,
              p: ({ node, ...props }) => <p className='text-slate-900 dark:text-slate-200 py-4' {...props} />,
              ul: ({ node, ...props }) => (
                <ul
                  className=
                  {
                    node.position.start.offset < message.indexOf('Missing:')
                      ? 'bg-green-50 dark:bg-slate-950 border border-green-500 rounded-3xl p-4 text-sm dark:text-slate-300'
                      : 'bg-red-50 dark:bg-slate-950 border border-red-500 rounded-3xl p-4 text-sm dark:text-slate-300'
                  }
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <li
                  className='list-disc list-inside py-1'
                  {...props}
                />
              )
            }}
            className=''
          >
          {message}
        </ReactMarkdown>
      </div>
    </div>
  )
}