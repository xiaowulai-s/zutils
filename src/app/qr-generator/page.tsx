'use client'

import { useState, useEffect, useRef } from 'react'
import { ToolShell } from '@/components/tools'
import { QrCode, Download, RotateCcw, Link2 } from 'lucide-react'

export default function QRGeneratorPage() {
  const [text, setText] = useState('')
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#FFFFFF')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateQR = async () => {
    if (!text || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size, size)

    try {
      const QRCode = await import('qrcode')
      await QRCode.toCanvas(canvas, text, {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      })
    } catch (err) {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, size, size)
      ctx.fillStyle = '#FF0000'
      ctx.font = '14px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('文本过长或包含不支持的字符', size / 2, size / 2)
    }
  }

  useEffect(() => {
    generateQR()
  }, [text, size, fgColor, bgColor])

  const downloadQR = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  const clearAll = () => {
    setText('')
  }

  return (
    <ToolShell title="二维码生成器" icon={<QrCode className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm">尺寸:</label>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="px-3 py-1.5 border rounded-md bg-background"
            >
              <option value={128}>128px</option>
              <option value={256}>256px</option>
              <option value={512}>512px</option>
              <option value={1024}>1024px</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">前景色:</label>
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="w-8 h-8 border rounded cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">背景色:</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-8 h-8 border rounded cursor-pointer"
            />
          </div>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            清空
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">输入内容</span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="输入文本、网址或任意内容..."
              className="w-full h-48 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={() => setText('https://example.com')}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                网址示例
              </button>
              <button
                onClick={() => setText('这是一段中文测试文本')}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                中文示例
              </button>
              <button
                onClick={() => setText('WIFI:T:WPA;S:网络名称;P:密码;;')}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                WiFi 示例
              </button>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">生成结果</span>
              {text && (
                <button
                  onClick={downloadQR}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
                >
                  <Download className="w-4 h-4" />
                  下载
                </button>
              )}
            </div>
            <div className="flex items-center justify-center h-48 border rounded-lg bg-gray-50 dark:bg-gray-800">
              {text ? (
                <canvas ref={canvasRef} className="max-w-full max-h-full" />
              ) : (
                <div className="text-gray-400 text-sm">输入内容后生成二维码</div>
              )}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>二维码生成器</strong> 可以将文本、网址、WiFi 信息等内容转换为二维码图片。</p>
          <p className="mt-1">支持自定义尺寸和颜色，生成的二维码可直接下载使用。</p>
        </div>
      </div>
    </ToolShell>
  )
}
