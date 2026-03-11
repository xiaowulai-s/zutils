import { ExternalLink, Usb, Download, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui'

export default function ESP32FlashPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">ESP32 在线烧录</h1>
        <p className="text-muted-foreground mt-1">乐鑫官方 Web Flash 工具，在线烧录固件到 ESP32 系列芯片</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="使用说明">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
              <div>
                <h3 className="font-medium">连接设备</h3>
                <p className="text-sm text-muted-foreground">使用 USB 数据线将 ESP32 开发板连接到电脑</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
              <div>
                <h3 className="font-medium">选择串口</h3>
                <p className="text-sm text-muted-foreground">在浏览器中选择对应的串口设备（需要支持 Web Serial API）</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
              <div>
                <h3 className="font-medium">选择固件</h3>
                <p className="text-sm text-muted-foreground">选择要烧录的固件文件（.bin 格式）</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">4</div>
              <div>
                <h3 className="font-medium">开始烧录</h3>
                <p className="text-sm text-muted-foreground">点击烧录按钮，等待烧录完成</p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card title="支持的芯片">
          <div className="grid grid-cols-2 gap-3">
            {['ESP32', 'ESP32-S2', 'ESP32-S3', 'ESP32-C3', 'ESP32-C6', 'ESP32-H2', 'ESP8266'].map((chip) => (
              <div key={chip} className="p-3 rounded-lg bg-muted/50 text-center">
                <Usb className="h-5 w-5 mx-auto mb-1 text-primary" />
                <span className="text-sm font-medium">{chip}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      <Card title="浏览器要求" className="mb-6">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 text-yellow-600">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium">Web Serial API 支持</p>
            <p className="mt-1">此功能需要浏览器支持 Web Serial API。推荐使用 Chrome 89+、Edge 89+ 或 Opera 76+ 浏览器。</p>
          </div>
        </div>
      </Card>
      
      <div className="flex gap-4">
        <a
          href="https://espressif.github.io/esptool-js/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <ExternalLink className="h-5 w-5" />
          打开乐鑫官方烧录工具
        </a>
        
        <a
          href="https://www.espressif.com/zh-hans/support/download/at"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-input bg-background hover:bg-muted transition-colors"
        >
          <Download className="h-5 w-5" />
          下载官方固件
        </a>
      </div>
    </div>
  )
}
