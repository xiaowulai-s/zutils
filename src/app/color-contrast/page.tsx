'use client'

import { useState, useMemo } from 'react'
import { ToolShell } from '@/components/tools'
import { Contrast, Copy, Check, AlertTriangle, CheckCircle } from 'lucide-react'

export default function ColorContrastPage() {
  const [foreground, setForeground] = useState('#000000')
  const [background, setBackground] = useState('#FFFFFF')
  const [copySuccess, setCopySuccess] = useState(false)

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const contrast = useMemo(() => {
    const fg = hexToRgb(foreground)
    const bg = hexToRgb(background)
    
    if (!fg || !bg) return null

    const fgLum = getLuminance(fg.r, fg.g, fg.b)
    const bgLum = getLuminance(bg.r, bg.g, bg.b)

    const lighter = Math.max(fgLum, bgLum)
    const darker = Math.min(fgLum, bgLum)

    return (lighter + 0.05) / (darker + 0.05)
  }, [foreground, background])

  const wcagResults = useMemo(() => {
    if (!contrast) return null

    return {
      aaNormal: contrast >= 4.5,
      aaLarge: contrast >= 3,
      aaaNormal: contrast >= 7,
      aaaLarge: contrast >= 4.5,
    }
  }, [contrast])

  const copyContrast = async () => {
    if (!contrast) return
    await navigator.clipboard.writeText(contrast.toFixed(2))
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const swapColors = () => {
    const temp = foreground
    setForeground(background)
    setBackground(temp)
  }

  const presetCombos = [
    { fg: '#000000', bg: '#FFFFFF', name: '黑白' },
    { fg: '#FFFFFF', bg: '#000000', name: '白黑' },
    { fg: '#1F2937', bg: '#F3F4F6', name: '深灰浅灰' },
    { fg: '#DC2626', bg: '#FFFFFF', name: '红色白底' },
    { fg: '#2563EB', bg: '#FFFFFF', name: '蓝色白底' },
    { fg: '#FFFFFF', bg: '#2563EB', name: '白字蓝底' },
  ]

  return (
    <ToolShell title="颜色对比度检测" icon={<Contrast className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">前景色 (文字)</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={foreground}
                onChange={(e) => setForeground(e.target.value)}
                className="w-12 h-10 border rounded cursor-pointer"
              />
              <input
                type="text"
                value={foreground}
                onChange={(e) => setForeground(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md bg-background font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">背景色</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="w-12 h-10 border rounded cursor-pointer"
              />
              <input
                type="text"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md bg-background font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={swapColors}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            交换颜色
          </button>
          {presetCombos.map(combo => (
            <button
              key={combo.name}
              onClick={() => { setForeground(combo.fg); setBackground(combo.bg); }}
              className="px-3 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            >
              {combo.name}
            </button>
          ))}
        </div>

        <div
          className="border rounded-lg p-8 text-center"
          style={{ backgroundColor: background, color: foreground }}
        >
          <div className="text-2xl font-bold mb-2">预览文字</div>
          <div className="text-sm">这是一段示例文本，用于预览颜色对比效果。</div>
          <div className="text-xs mt-2 opacity-75">小号文字预览</div>
        </div>

        {contrast && wcagResults && (
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b flex items-center justify-between">
              <span className="text-sm font-medium">对比度检测结果</span>
              <button
                onClick={copyContrast}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                对比度: {contrast.toFixed(2)}:1
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-2">WCAG AA 标准</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {wcagResults.aaNormal ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">普通文字 (≥4.5:1)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {wcagResults.aaLarge ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">大号文字 (≥3:1)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-2">WCAG AAA 标准</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {wcagResults.aaaNormal ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">普通文字 (≥7:1)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {wcagResults.aaaLarge ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">大号文字 (≥4.5:1)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>颜色对比度检测</strong> 根据 WCAG 标准检测前景色和背景色的对比度是否满足无障碍要求。</p>
          <p className="mt-1">WCAG AA 是最低标准，AAA 是增强标准。大号文字指 18px 以上或 14px 加粗。</p>
        </div>
      </div>
    </ToolShell>
  )
}
