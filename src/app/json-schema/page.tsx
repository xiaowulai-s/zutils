'use client'

import { useState, useMemo } from 'react'
import { Braces, Copy, Check, ArrowRightLeft, AlertCircle, Download } from 'lucide-react'

export default function JsonSchemaGeneratorPage() {
  const [jsonInput, setJsonInput] = useState(`{
  "name": "张三",
  "age": 28,
  "email": "zhangsan@example.com",
  "isActive": true,
  "tags": ["developer", "designer"],
  "address": {
    "city": "北京",
    "zipCode": "100000"
  },
  "createdAt": "2024-01-15T10:30:00Z"
}`)
  const [schema, setSchema] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const generateSchema = () => {
    setError(null)
    try {
      const parsed = JSON.parse(jsonInput)
      const generatedSchema = generateSchemaFromJson(parsed)
      setSchema(JSON.stringify(generatedSchema, null, 2))
    } catch (e) {
      setError(e instanceof Error ? e.message : '无效的 JSON')
    }
  }

  const generateSchemaFromJson = (obj: unknown, root = true): object => {
    if (obj === null) {
      return { type: 'null' }
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return { type: 'array', items: {} }
      }
      const itemTypes = new Set<string>()
      const itemSchemas: object[] = []
      
      obj.forEach(item => {
        const itemSchema = generateSchemaFromJson(item, false)
        itemTypes.add(itemSchema.type as string)
        itemSchemas.push(itemSchema)
      })

      if (itemTypes.size === 1) {
        return { type: 'array', items: itemSchemas[0] }
      }
      
      return { type: 'array', items: { oneOf: itemSchemas } }
    }

    const type = typeof obj

    if (type === 'object') {
      const properties: Record<string, object> = {}
      const required: string[] = []
      
      Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
        properties[key] = generateSchemaFromJson(value, false)
        if (value !== null && value !== undefined) {
          required.push(key)
        }
      })

      const schema: Record<string, unknown> = {
        type: 'object',
        properties
      }

      if (required.length > 0) {
        schema.required = required
      }

      if (root) {
        schema['$schema'] = 'http://json-schema.org/draft-07/schema#'
      }

      return schema
    }

    if (type === 'string') {
      const str = obj as string
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(str)) {
        return { type: 'string', format: 'date-time' }
      }
      if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(str)) {
        return { type: 'string', format: 'email' }
      }
      if (/^https?:\/\//.test(str)) {
        return { type: 'string', format: 'uri' }
      }
      return { type: 'string' }
    }

    if (type === 'number') {
      return Number.isInteger(obj) ? { type: 'integer' } : { type: 'number' }
    }

    if (type === 'boolean') {
      return { type: 'boolean' }
    }

    return {}
  }

  const copySchema = async () => {
    await navigator.clipboard.writeText(schema)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadSchema = () => {
    const blob = new Blob([schema], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'schema.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const validateJson = useMemo(() => {
    try {
      JSON.parse(jsonInput)
      return true
    } catch {
      return false
    }
  }, [jsonInput])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Braces className="w-7 h-7" />
            JSON Schema 生成器
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            从 JSON 数据自动生成 JSON Schema，支持类型推断
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <span className="font-medium text-gray-700 dark:text-gray-200">JSON 输入</span>
              {!validateJson && (
                <span className="flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  格式错误
                </span>
              )}
            </div>
            <div className="p-4">
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full h-96 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="粘贴 JSON 数据..."
                spellCheck={false}
              />
            </div>
            <div className="px-4 pb-4">
              <button
                onClick={generateSchema}
                disabled={!validateJson}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRightLeft className="w-4 h-4" />
                生成 Schema
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <span className="font-medium text-gray-700 dark:text-gray-200">JSON Schema</span>
              {schema && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={copySchema}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title="复制"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={downloadSchema}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title="下载"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <div className="p-4">
              {error ? (
                <div className="h-96 flex items-center justify-center text-red-500">
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <p>{error}</p>
                  </div>
                </div>
              ) : schema ? (
                <textarea
                  value={schema}
                  onChange={(e) => setSchema(e.target.value)}
                  className="w-full h-96 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  spellCheck={false}
                />
              ) : (
                <div className="h-96 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <div className="text-center">
                    <Braces className="w-12 h-12 mx-auto mb-4" />
                    <p>输入 JSON 并点击"生成 Schema"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">功能说明</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">类型推断</h3>
              <p>自动识别 string、number、integer、boolean、array、object、null 类型</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">格式识别</h3>
              <p>自动识别 date-time、email、uri 等常见格式</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">必填字段</h3>
              <p>自动标记非空字段为 required</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
