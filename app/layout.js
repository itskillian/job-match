import '@/app/globals.css';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata = {
  title: 'ResumeMatch',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='dark:bg-gray-900'>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
