import Link from 'next/link'
import { Github, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-3">开发工具箱</h3>
            <p className="text-sm text-muted-foreground">
              提供各类电子工程计算工具
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">快速链接</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="/pcb-via-current" className="text-muted-foreground hover:text-foreground">
                PCB 过孔电流计算器
              </Link>
              <Link href="/resistor-color-code" className="text-muted-foreground hover:text-foreground">
                电阻色环计算器
              </Link>
              <Link href="/led-resistor" className="text-muted-foreground hover:text-foreground">
                LED 限流电阻计算器
              </Link>
            </nav>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">联系我们</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2024 开发工具箱. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
