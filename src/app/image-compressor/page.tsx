'use client'

import { useState, useRef } from 'react'
import { ToolShell } from '@/components/tools'
import { ImageDown, Download, Trash2, Settings, ZoomIn } from 'lucide-react'

export default function ImageCompressorPage() {
  const [images, setImages] = useState<{
    id: string
    original: { name: string; size: number; dataUrl: string }
    compressed: { size: number; dataUrl: string } | null
    quality: number
  }[]>([])
  const [globalQuality, setGlobalQuality] = useState(0.8)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        setImages(prev => [...prev, {
          id: Date.now().toString() + Math.random(),
          original: { name: file.name, size: file.size, dataUrl },
          compressed: null,
          quality: globalQuality
        }])
      }
      reader.readAsDataURL(file)
    })
  }

  const compressImage = async (id: string) => {
    const image = images.find(i => i.id === id)
    if (!image) return

    const img = new window.Image()
    img.src = image.original.dataUrl
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      ctx.drawImage(img, 0, 0)
      
      canvas.toBlob((blob) => {
        if (!blob) return
        
        const reader = new FileReader()
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string
          setImages(prev => prev.map(i => 
            i.id === id 
              ? { ...i, compressed: { size: blob.size, dataUrl } }
              : i
          ))
        }
        reader.readAsDataURL(blob)
      }, 'image/jpeg', image.quality)
    }
  }

  const compressAll = () => {
    images.forEach(img => compressImage(img.id))
  }

  const downloadImage = (id: string) => {
    const image = images.find(i => i.id === id)
    if (!image?.compressed) return

    const link = document.createElement('a')
    link.download = `compressed_${image.original.name.replace(/\.[^/.]+$/, '')}.jpg`
    link.href = image.compressed.dataUrl
    link.click()
  }

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(i => i.id !== id))
  }

  const clearAll = () => {
    setImages([])
  }

  const updateQuality = (id: string, quality: number) => {
    setImages(prev => prev.map(i => 
      i.id === id ? { ...i, quality } : i
    ))
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const getCompressionRatio = (original: number, compressed: number) => {
    return Math.round((1 - compressed / original) * 100)
  }

  return (
    <ToolShell title="图片压缩" icon={<ImageDown className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            <ImageDown className="w-4 h-4" />
            选择图片
          </button>
          <div className="flex items-center gap-2">
            <label className="text-sm">默认质量:</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={globalQuality}
              onChange={(e) => setGlobalQuality(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-sm w-10">{Math.round(globalQuality * 100)}%</span>
          </div>
          {images.length > 0 && (
            <>
              <button
                onClick={compressAll}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
              >
                <Settings className="w-4 h-4" />
                压缩全部
              </button>
              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Trash2 className="w-4 h-4" />
                清空
              </button>
            </>
          )}
        </div>

        {images.length === 0 ? (
          <div className="border-2 border-dashed rounded-lg p-12 text-center text-gray-400">
            <ImageDown className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>点击上方按钮或拖拽图片到此处</p>
          </div>
        ) : (
          <div className="space-y-4">
            {images.map(image => (
              <div key={image.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 flex-shrink-0 border rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={image.compressed?.dataUrl || image.original.dataUrl}
                      alt={image.original.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{image.original.name}</div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-gray-500">
                        原始: <span className="font-mono">{formatSize(image.original.size)}</span>
                      </span>
                      {image.compressed && (
                        <>
                          <span className="text-gray-500">
                            压缩后: <span className="font-mono text-green-600">{formatSize(image.compressed.size)}</span>
                          </span>
                          <span className="text-green-600 font-medium">
                            -{getCompressionRatio(image.original.size, image.compressed.size)}%
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <label className="text-sm">质量:</label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={image.quality}
                        onChange={(e) => updateQuality(image.id, Number(e.target.value))}
                        className="w-24"
                      />
                      <span className="text-sm w-10">{Math.round(image.quality * 100)}%</span>
                      <button
                        onClick={() => compressImage(image.id)}
                        className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        压缩
                      </button>
                      {image.compressed && (
                        <button
                          onClick={() => downloadImage(image.id)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
                        >
                          <Download className="w-3 h-3" />
                          下载
                        </button>
                      )}
                      <button
                        onClick={() => removeImage(image.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>图片压缩工具</strong> 使用 Canvas API 在浏览器本地压缩图片，无需上传到服务器。</p>
          <p className="mt-1">支持 JPG、PNG、WebP 等格式，压缩后输出为 JPG 格式。</p>
        </div>
      </div>
    </ToolShell>
  )
}
