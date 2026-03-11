'use client'

import { useState } from 'react'
import { Card, Button, Input } from '@/components/ui'
import { Search, ExternalLink, FileText, Download } from 'lucide-react'

interface DatasheetResult {
  name: string
  manufacturer: string
  description: string
  url: string
}

export default function DatasheetPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<DatasheetResult[]>([])
  const [loading, setLoading] = useState(false)
  
  const handleSearch = () => {
    if (!query.trim()) return
    
    setLoading(true)
    
    // 模拟搜索结果
    setTimeout(() => {
      setResults([
        {
          name: 'STM32F103C8T6',
          manufacturer: 'STMicroelectronics',
          description: 'ARM Cortex-M3 32-bit MCU, 72 MHz, 64 KB Flash, 20 KB SRAM',
          url: 'https://www.st.com/resource/en/datasheet/stm32f103c8.pdf'
        },
        {
          name: 'ESP32-WROOM-32',
          manufacturer: 'Espressif Systems',
          description: 'WiFi + Bluetooth + Bluetooth LE MCU, 240 MHz dual-core, 4 MB Flash',
          url: 'https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32_datasheet_en.pdf'
        },
        {
          name: 'ATmega328P',
          manufacturer: 'Microchip Technology',
          description: '8-bit AVR MCU, 20 MHz, 32 KB Flash, 2 KB SRAM',
          url: 'https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf'
        }
      ])
      setLoading(false)
    }, 500)
  }
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">芯片手册查询</h1>
        <p className="text-muted-foreground mt-1">电子元器件 datasheet 数据手册查询下载，支持数百万种芯片规格书</p>
      </div>
      
      <Card title="搜索芯片" className="mb-6">
        <div className="flex gap-3">
          <Input
            placeholder="输入芯片型号，如 STM32F103、ESP32、NE555..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            搜索
          </Button>
        </div>
      </Card>
      
      {results.length > 0 && (
        <Card title="搜索结果">
          <div className="space-y-4">
            {results.map((item, index) => (
              <div key={index} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.manufacturer}</p>
                    <p className="text-sm mt-2">{item.description}</p>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Download className="h-4 w-4" />
                    下载
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="https://www.alldatasheet.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
        >
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h3 className="font-medium">Alldatasheet</h3>
            <p className="text-sm text-muted-foreground">全球最大的 datasheet 数据库</p>
          </div>
          <ExternalLink className="h-5 w-5 ml-auto text-muted-foreground" />
        </a>
        
        <a
          href="https://www.datasheetcatalog.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
        >
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h3 className="font-medium">DatasheetCatalog</h3>
            <p className="text-sm text-muted-foreground">电子元器件数据手册目录</p>
          </div>
          <ExternalLink className="h-5 w-5 ml-auto text-muted-foreground" />
        </a>
        
        <a
          href="https://lcsc.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
        >
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h3 className="font-medium">LCSC 立创商城</h3>
            <p className="text-sm text-muted-foreground">国产元器件数据手册</p>
          </div>
          <ExternalLink className="h-5 w-5 ml-auto text-muted-foreground" />
        </a>
        
        <a
          href="https://www.digikey.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
        >
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h3 className="font-medium">Digi-Key 得捷</h3>
            <p className="text-sm text-muted-foreground">电子元器件分销商</p>
          </div>
          <ExternalLink className="h-5 w-5 ml-auto text-muted-foreground" />
        </a>
      </div>
    </div>
  )
}
