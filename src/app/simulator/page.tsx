import { ExternalLink, Play, Cpu, Zap } from 'lucide-react'
import { Card } from '@/components/ui'

export default function SimulatorPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">电路在线仿真</h1>
        <p className="text-muted-foreground mt-1">在线电路仿真工具，支持 Arduino、ESP32、STM32 等多种开发板</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="功能特性">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Cpu className="h-5 w-5 text-primary" />
              <span>支持多种开发板：Arduino、ESP32、STM32、Raspberry Pi Pico</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Zap className="h-5 w-5 text-primary" />
              <span>实时电路仿真，可视化输出</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Play className="h-5 w-5 text-primary" />
              <span>在线编写代码，一键编译运行</span>
            </div>
          </div>
        </Card>
        
        <Card title="支持的开发板">
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Arduino Uno', desc: 'ATmega328P' },
              { name: 'Arduino Nano', desc: 'ATmega328P' },
              { name: 'Arduino Mega', desc: 'ATmega2560' },
              { name: 'ESP32', desc: 'Xtensa dual-core' },
              { name: 'ESP8266', desc: 'Xtensa L106' },
              { name: 'STM32F103', desc: 'ARM Cortex-M3' },
              { name: 'Raspberry Pi Pico', desc: 'RP2040' },
              { name: 'ATtiny85', desc: '8-bit AVR' },
            ].map((board) => (
              <div key={board.name} className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium text-sm">{board.name}</p>
                <p className="text-xs text-muted-foreground">{board.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      <Card title="使用说明" className="mb-6">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Wokwi 是一个免费的在线电子仿真器，可以在浏览器中模拟 Arduino、ESP32、STM32 等开发板。
            你可以编写代码、连接电路、实时查看仿真结果。
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>无需安装任何软件，直接在浏览器中使用</li>
            <li>支持多种传感器和电子元件</li>
            <li>可以分享你的项目给其他人</li>
            <li>支持 C/C++ 和 MicroPython 编程</li>
          </ul>
        </div>
      </Card>
      
      <div className="flex gap-4">
        <a
          href="https://wokwi.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <ExternalLink className="h-5 w-5" />
          打开 Wokwi 仿真器
        </a>
        
        <a
          href="https://docs.wokwi.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-input bg-background hover:bg-muted transition-colors"
        >
          <Play className="h-5 w-5" />
          查看文档
        </a>
      </div>
    </div>
  )
}
