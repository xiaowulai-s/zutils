'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Download, RotateCw, FlipHorizontal, FlipVertical, Crop, ZoomIn, ZoomOut, Trash2, Image as ImageIcon, RefreshCw } from 'lucide-react'

interface ImageState {
  file: File | null
  url: string | null
  width: number
  height: number
  rotation: number
  flipH: boolean
  flipV: boolean
  brightness: number
  contrast: number
  saturation: number
  quality: number
  format: string
}

export default function ImageProcessorPage() {
  const [image, setImage] = useState<ImageState>({
    file: null,
    url: null,
    width: 0,
    height: 0,
    rotation: 0,
    flipH: false,
    flipV: false,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    quality: 90,
    format: 'image/png'
  })
  const [processedUrl, setProcessedUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      setImage(prev => ({
        ...prev,
        file,
        url,
        width: img.width,
        height: img.height,
        rotation: 0,
        flipH: false,
        flipV: false,
        brightness: 100,
        contrast: 100,
        saturation: 100
      }))
      setProcessedUrl(null)
    }
    img.src = url
  }

  const processImage = useCallback(() => {
    if (!image.url || !canvasRef.current) return

    setIsProcessing(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      const radians = (image.rotation * Math.PI) / 180
      const sin = Math.abs(Math.sin(radians))
      const cos = Math.abs(Math.cos(radians))
      
      const newWidth = img.width * cos + img.height * sin
      const newHeight = img.width * sin + img.height * cos

      canvas.width = newWidth
      canvas.height = newHeight

      ctx.translate(newWidth / 2, newHeight / 2)
      ctx.rotate(radians)
      ctx.scale(
        image.flipH ? -1 : 1,
        image.flipV ? -1 : 1
      )
      ctx.filter = `brightness(${image.brightness}%) contrast(${image.contrast}%) saturate(${image.saturation}%)`
      ctx.drawImage(img, -img.width / 2, -img.height / 2)

      const quality = image.format === 'image/png' ? undefined : image.quality / 100
      const dataUrl = canvas.toDataURL(image.format, quality)
      setProcessedUrl(dataUrl)
      setIsProcessing(false)
    }
    img.src = image.url
  }, [image])

  const downloadImage = () => {
    if (!processedUrl) return
    const link = document.createElement('a')
    link.href = processedUrl
    const ext = image.format.split('/')[1]
    link.download = `processed-image.${ext}`
    link.click()
  }

  const resetFilters = () => {
    setImage(prev => ({
      ...prev,
      rotation: 0,
      flipH: false,
      flipV: false,
      brightness: 100,
      contrast: 100,
      saturation: 100
    }))
    setProcessedUrl(null)
  }

  const clearImage = () => {
    if (image.url) URL.revokeObjectURL(image.url)
    setImage({
      file: null,
      url: null,
      width: 0,
      height: 0,
      rotation: 0,
      flipH: false,
      flipV: false,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      quality: 90,
      format: 'image/png'
    })
    setProcessedUrl(null)
  }

  const rotate = (degrees: number) => {
    setImage(prev => ({ ...prev, rotation: (prev.rotation + degrees) % 360 }))
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-7 h-7" />
            图片处理工具
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            图片裁剪、旋转、翻转、调整亮度/对比度/饱和度，格式转换
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <span className="font-medium text-gray-700 dark:text-gray-200">图片预览</span>
                {image.url && (
                  <button
                    onClick={clearImage}
                    className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    清除
                  </button>
                )}
              </div>
              <div className="p-4">
                {!image.url ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                  >
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      点击或拖拽图片到此处上传
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      支持 JPG、PNG、GIF、WebP 格式
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center min-h-[300px]">
                      <img
                        src={processedUrl || image.url}
                        alt="Preview"
                        className="max-w-full max-h-[400px] object-contain"
                        style={{
                          transform: `rotate(${image.rotation}deg) scaleX(${image.flipH ? -1 : 1}) scaleY(${image.flipV ? -1 : 1})`,
                          filter: `brightness(${image.brightness}%) contrast(${image.contrast}%) saturate(${image.saturation}%)`
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>原始尺寸: {image.width} × {image.height}</span>
                      {image.file && <span>文件大小: {formatSize(image.file.size)}</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>

          {image.url && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <span className="font-medium text-gray-700 dark:text-gray-200">变换操作</span>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      旋转: {image.rotation}°
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => rotate(-90)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                      >
                        <RotateCw className="w-4 h-4 -scale-x-100" />
                        -90°
                      </button>
                      <button
                        onClick={() => rotate(90)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                      >
                        <RotateCw className="w-4 h-4" />
                        +90°
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">翻转</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setImage(prev => ({ ...prev, flipH: !prev.flipH }))}
                        className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg ${
                          image.flipH
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <FlipHorizontal className="w-4 h-4" />
                        水平
                      </button>
                      <button
                        onClick={() => setImage(prev => ({ ...prev, flipV: !prev.flipV }))}
                        className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg ${
                          image.flipV
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <FlipVertical className="w-4 h-4" />
                        垂直
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <span className="font-medium text-gray-700 dark:text-gray-200">调整参数</span>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      亮度: {image.brightness}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={image.brightness}
                      onChange={(e) => setImage(prev => ({ ...prev, brightness: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      对比度: {image.contrast}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={image.contrast}
                      onChange={(e) => setImage(prev => ({ ...prev, contrast: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      饱和度: {image.saturation}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={image.saturation}
                      onChange={(e) => setImage(prev => ({ ...prev, saturation: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <span className="font-medium text-gray-700 dark:text-gray-200">导出设置</span>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">输出格式</label>
                    <select
                      value={image.format}
                      onChange={(e) => setImage(prev => ({ ...prev, format: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      <option value="image/png">PNG (无损)</option>
                      <option value="image/jpeg">JPEG (压缩)</option>
                      <option value="image/webp">WebP (高效)</option>
                    </select>
                  </div>

                  {image.format !== 'image/png' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        质量: {image.quality}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={image.quality}
                        onChange={(e) => setImage(prev => ({ ...prev, quality: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={resetFilters}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  重置
                </button>
                <button
                  onClick={processImage}
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  应用并下载
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
