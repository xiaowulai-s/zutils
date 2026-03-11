import type { Metadata } from 'next'
import './globals.css'
import { Header, Footer } from '@/components/layout'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: '开发工具箱',
  description: '提供 PCB 计算、电阻计算、滤波器设计等电子工程工具',
  keywords: ['PCB', '电阻', 'LED', '滤波器', '电子工程', '计算器'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="system">
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
