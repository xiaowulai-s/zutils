import type { Metadata } from 'next'
import './globals.css'
import { Header, Footer } from '@/components/layout'
import { ThemeProvider } from '@/components/ThemeProvider'
import { UserPreferencesProvider } from '@/components/UserPreferences'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'

export const metadata: Metadata = {
  title: '开发工具箱 - 电子工程师的在线工具集',
  description: '提供 PCB 计算、电阻计算、滤波器设计、CRC校验、JSON格式化等专业电子工程和开发工具',
  keywords: ['PCB', '电阻', 'LED', '滤波器', '电子工程', '计算器', 'CRC', 'JSON', '正则表达式'],
  authors: [{ name: '开发工具箱' }],
  openGraph: {
    title: '开发工具箱',
    description: '电子工程师的在线工具集',
    type: 'website',
    locale: 'zh_CN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body>
        <ThemeProvider defaultTheme="system">
          <UserPreferencesProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <ServiceWorkerRegistration />
          </UserPreferencesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
