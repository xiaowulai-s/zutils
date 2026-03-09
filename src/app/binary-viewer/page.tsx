'use client'

import { useState, useRef } from 'react'
import { Card, Button } from '@/components/ui'
import { HexViewer } from '@/components/tools'
import { Upload, FileText, Trash2 } from 'lucide-react'

export default function BinaryViewerPage() {
  const [fileData, setFileData] = useState<Uint8Array | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [fileSize, setFileSize] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer
      setFileData(new Uint8Array(arrayBuffer))
      setFileName(file.name)
      setFileSize(file.size)
    }
    reader.readAsArrayBuffer(file)
  }
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer
      setFileData(new Uint8Array(arrayBuffer))
      setFileName(file.name)
      setFileSize(file.size)
    }
    reader.readAsArrayBuffer(file)
  }
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }
  
  const handleClear = () => {
    setFileData(null)
    setFileName('')
    setFileSize(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">二进制文件查看器</h1>
        <p className="text-muted-foreground mt-1">在线查看二进制文件，十六进制和 ASCII 视图，支持大文件虚拟滚动</p>
      </div>
      
      <div className="space-y-6">
        <Card>
          <div className="space-y-4">
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">点击或拖拽文件到此处</p>
              <p className="text-sm text-muted-foreground mt-1">支持任意文件类型</p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
            />
            
            {fileData && (
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{fileName}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(fileSize)}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClear}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </Card>
        
        <Card title="文件内容">
          <HexViewer data={fileData} />
        </Card>
      </div>
    </div>
  )
}
