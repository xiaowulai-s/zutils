'use client'

import { useState, useRef } from 'react'
import { ToolShell } from '@/components/tools'
import { ImageIcon, Copy, Check, RotateCcw, Download, Upload } from 'lucide-react'

export default function ImageBase64Page() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [base64Text, setBase64Text] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setBase64Text(result)
      setImagePreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handlePaste = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read()
      for (const item of clipboardItems) {
        const imageType = item.types.find(type => type.startsWith('image/'))
        if (imageType) {
          const blob = await item.getType(imageType)
          const reader = new FileReader()
          reader.onload = (event) => {
            const result = event.target?.result as string
            setBase64Text(result)
            setImagePreview(result)
          }
          reader.readAsDataURL(blob)
          break
        }
      }
    } catch (err) {
      console.error('粘贴失败:', err)
    }
  }

  const handleDecode = () => {
    if (!base64Text) return
    
    if (base64Text.startsWith('data:image')) {
      setImagePreview(base64Text)
    } else {
      setImagePreview(`data:image/png;base64,${base64Text}`)
    }
  }

  const copyBase64 = async () => {
    if (!base64Text) return
    try {
      await navigator.clipboard.writeText(base64Text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (e) {
      console.error('复制失败:', e)
    }
  }

  const downloadImage = () => {
    if (!imagePreview) return
    const link = document.createElement('a')
    link.download = 'image.png'
    link.href = imagePreview
    link.click()
  }

  const clearAll = () => {
    setBase64Text('')
    setImagePreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <ToolShell title="图片 Base64 转换" icon={<ImageIcon className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setMode('encode')}
              className={`px-4 py-2 ${mode === 'encode' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              图片 → Base64
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`px-4 py-2 ${mode === 'decode' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              Base64 → 图片
            </button>
          </div>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            清空
          </button>
        </div>

        {mode === 'encode' && (
          <div className="flex flex-wrap gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            >
              <Upload className="w-4 h-4" />
              选择图片
            </button>
            <button
              onClick={handlePaste}
              className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              从剪贴板粘贴
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{mode === 'encode' ? 'Base64 编码' : 'Base64 输入'}</span>
              {base64Text && (
                <button
                  onClick={copyBase64}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copySuccess ? '已复制' : '复制'}
                </button>
              )}
            </div>
            <textarea
              value={base64Text}
              onChange={(e) => setBase64Text(e.target.value)}
              placeholder={mode === 'encode' ? '选择图片后自动生成...' : '输入 Base64 编码（可带 data:image 前缀）...'}
              readOnly={mode === 'encode'}
              className="w-full h-48 p-4 font-mono text-xs border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
            />
            {mode === 'decode' && (
              <button
                onClick={handleDecode}
                className="mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
              >
                解码预览
              </button>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">图片预览</span>
              {imagePreview && (
                <button
                  onClick={downloadImage}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  <Download className="w-4 h-4" />
                  下载
                </button>
              )}
            </div>
            <div className="h-48 border rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="text-gray-400 text-sm">图片预览</span>
              )}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>图片 Base64 转换</strong> 可以将图片转换为 Base64 编码，或将 Base64 编码还原为图片。</p>
          <p className="mt-1">支持从文件选择或剪贴板粘贴图片，生成的 Base64 可直接用于 HTML/CSS。</p>
        </div>
      </div>
    </ToolShell>
  )
}
