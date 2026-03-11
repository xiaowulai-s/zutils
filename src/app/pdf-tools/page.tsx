'use client'

import { useState, useRef } from 'react'
import { FileUp, Download, Trash2, FileText, Merge, Split, Compress, Image, AlertCircle, CheckCircle } from 'lucide-react'

interface PDFFile {
  id: string
  name: string
  size: number
  file: File
  pages?: number
}

export default function PDFToolsPage() {
  const [files, setFiles] = useState<PDFFile[]>([])
  const [activeTab, setActiveTab] = useState<'merge' | 'split' | 'compress' | 'images'>('merge')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const pdfFiles = selectedFiles.filter(f => f.type === 'application/pdf')
    
    const newFiles: PDFFile[] = pdfFiles.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      file
    }))
    
    setFiles(prev => [...prev, ...newFiles])
    setResult(null)
  }

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id))
  }

  const clearFiles = () => {
    setFiles([])
    setResult(null)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const simulateProcess = async () => {
    if (files.length === 0) {
      setResult({ type: 'error', message: '请先上传 PDF 文件' })
      return
    }

    setProcessing(true)
    setResult(null)

    await new Promise(resolve => setTimeout(resolve, 2000))

    const messages: Record<string, string> = {
      merge: `成功合并 ${files.length} 个 PDF 文件`,
      split: `成功将 "${files[0].name}" 拆分为 ${Math.min(files[0].size / 10000, 10).toFixed(0)} 页`,
      compress: `成功压缩 "${files[0].name}"，压缩率约 40%`,
      images: `成功从 "${files[0].name}" 提取图片`
    }

    setResult({ type: 'success', message: messages[activeTab] })
    setProcessing(false)
  }

  const tabs = [
    { id: 'merge', label: 'PDF 合并', icon: Merge, desc: '将多个 PDF 文件合并为一个' },
    { id: 'split', label: 'PDF 拆分', icon: Split, desc: '将 PDF 按页拆分为多个文件' },
    { id: 'compress', label: 'PDF 压缩', icon: Compress, desc: '减小 PDF 文件体积' },
    { id: 'images', label: 'PDF 转图片', icon: Image, desc: '将 PDF 页面转换为图片' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-7 h-7" />
            PDF 工具套件
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            合并、拆分、压缩 PDF 文件，PDF 转图片
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as typeof activeTab); setResult(null) }}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {tabs.find(t => t.id === activeTab)?.desc}
            </p>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <FileUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                点击或拖拽 PDF 文件到此处上传
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                支持 .pdf 格式，单个文件最大 50MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                multiple={activeTab === 'merge'}
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <span className="font-medium text-gray-700 dark:text-gray-200">
                已上传文件 ({files.length})
              </span>
              <button
                onClick={clearFiles}
                className="text-sm text-red-500 hover:text-red-600"
              >
                清空全部
              </button>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {files.map((file, index) => (
                <div key={file.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-500">
                      {index + 1}
                    </span>
                    <FileText className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            result.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            {result.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            <span className={result.type === 'success' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
              {result.message}
            </span>
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={simulateProcess}
            disabled={files.length === 0 || processing}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                处理中...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                开始处理
              </>
            )}
          </button>
        </div>

        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">功能说明</h3>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• <strong>PDF 合并</strong>: 选择多个 PDF 文件，按顺序合并为一个文件</li>
            <li>• <strong>PDF 拆分</strong>: 上传单个 PDF，按页码范围拆分为多个文件</li>
            <li>• <strong>PDF 压缩</strong>: 减小 PDF 文件体积，适合网络传输</li>
            <li>• <strong>PDF 转图片</strong>: 将每一页转换为高质量图片</li>
          </ul>
          <p className="mt-3 text-xs text-yellow-600 dark:text-yellow-400">
            注意：当前为演示版本，实际 PDF 处理需要后端服务支持。完整功能建议使用专业 PDF 工具。
          </p>
        </div>
      </div>
    </div>
  )
}
