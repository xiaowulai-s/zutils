'use client'

import { useState } from 'react'
import { ArrowRightLeft, Copy, Check, Code2, FileJson, FileCode, AlertCircle } from 'lucide-react'

type ConversionType = 'json-yaml' | 'yaml-json' | 'json-csv' | 'csv-json' | 'ts-js' | 'js-ts'

export default function CodeConverterPage() {
  const [conversionType, setConversionType] = useState<ConversionType>('json-yaml')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const conversions: { id: ConversionType; label: string; from: string; to: string }[] = [
    { id: 'json-yaml', label: 'JSON → YAML', from: 'JSON', to: 'YAML' },
    { id: 'yaml-json', label: 'YAML → JSON', from: 'YAML', to: 'JSON' },
    { id: 'json-csv', label: 'JSON → CSV', from: 'JSON', to: 'CSV' },
    { id: 'csv-json', label: 'CSV → JSON', from: 'CSV', to: 'JSON' },
    { id: 'ts-js', label: 'TypeScript → JavaScript', from: 'TypeScript', to: 'JavaScript' },
    { id: 'js-ts', label: 'JavaScript → TypeScript', from: 'JavaScript', to: 'TypeScript' }
  ]

  const convert = () => {
    setError(null)
    setOutput('')

    if (!input.trim()) {
      setError('请输入内容')
      return
    }

    try {
      switch (conversionType) {
        case 'json-yaml':
          setOutput(jsonToYaml(JSON.parse(input)))
          break
        case 'yaml-json':
          setOutput(JSON.stringify(yamlToJson(input), null, 2))
          break
        case 'json-csv':
          setOutput(jsonToCsv(JSON.parse(input)))
          break
        case 'csv-json':
          setOutput(JSON.stringify(csvToJson(input), null, 2))
          break
        case 'ts-js':
          setOutput(tsToJs(input))
          break
        case 'js-ts':
          setOutput(jsToTs(input))
          break
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '转换失败')
    }
  }

  const jsonToYaml = (obj: unknown, indent = 0): string => {
    const spaces = '  '.repeat(indent)
    
    if (obj === null) return 'null'
    if (typeof obj === 'boolean' || typeof obj === 'number') return String(obj)
    if (typeof obj === 'string') {
      if (obj.includes('\n') || obj.includes(':') || obj.includes('#')) {
        return `"${obj.replace(/"/g, '\\"')}"`
      }
      return obj.includes(' ') ? `"${obj}"` : obj
    }
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]'
      return obj.map(item => {
        const value = jsonToYaml(item, indent + 1)
        if (typeof item === 'object' && item !== null) {
          return `- \n${jsonToYaml(item, indent + 1)}`
        }
        return `- ${value}`
      }).join('\n' + spaces)
    }
    
    if (typeof obj === 'object') {
      const entries = Object.entries(obj)
      if (entries.length === 0) return '{}'
      return entries.map(([key, value]) => {
        const yamlValue = jsonToYaml(value, indent + 1)
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          return `${key}:\n${yamlValue.split('\n').map(line => '  ' + line).join('\n')}`
        }
        if (Array.isArray(value) && value.length > 0) {
          return `${key}:\n${yamlValue.split('\n').map(line => spaces + '  ' + line).join('\n')}`
        }
        return `${key}: ${yamlValue}`
      }).join('\n' + spaces)
    }
    
    return String(obj)
  }

  const yamlToJson = (yaml: string): unknown => {
    const lines = yaml.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'))
    const result: Record<string, unknown> = {}
    let currentKey = ''
    let currentIndent = -1
    const stack: { obj: Record<string, unknown>; indent: number }[] = [{ obj: result, indent: -1 }]

    for (const line of lines) {
      const indent = line.search(/\S/)
      const trimmed = line.trim()
      
      if (trimmed.startsWith('- ')) {
        continue
      }
      
      const colonIndex = trimmed.indexOf(':')
      if (colonIndex > 0) {
        const key = trimmed.slice(0, colonIndex).trim()
        let value = trimmed.slice(colonIndex + 1).trim()
        
        if (value === '' || value === '|' || value === '>') {
          currentKey = key
          currentIndent = indent
          const newObj: Record<string, unknown> = {}
          
          while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
            stack.pop()
          }
          
          stack[stack.length - 1].obj[key] = newObj
          stack.push({ obj: newObj, indent })
        } else {
          if (value === 'true') value = 'true'
          else if (value === 'false') value = 'false'
          else if (value === 'null') value = 'null'
          else if (!isNaN(Number(value)) && value !== '') value = Number(value)
          else if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
          
          while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
            stack.pop()
          }
          stack[stack.length - 1].obj[key] = value
        }
      }
    }
    
    return result
  }

  const jsonToCsv = (data: unknown): string => {
    const arr = Array.isArray(data) ? data : [data]
    if (arr.length === 0) return ''
    
    const headers = Object.keys(arr[0] as Record<string, unknown>)
    const rows = arr.map(item => 
      headers.map(h => {
        const val = (item as Record<string, unknown>)[h]
        const str = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '')
        return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str
      }).join(',')
    )
    
    return [headers.join(','), ...rows].join('\n')
  }

  const csvToJson = (csv: string): unknown => {
    const lines = csv.split('\n').filter(line => line.trim())
    if (lines.length < 2) return []
    
    const parseRow = (row: string): string[] => {
      const result: string[] = []
      let current = ''
      let inQuotes = false
      
      for (let i = 0; i < row.length; i++) {
        const char = row[i]
        if (char === '"') {
          if (inQuotes && row[i + 1] === '"') {
            current += '"'
            i++
          } else {
            inQuotes = !inQuotes
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current)
          current = ''
        } else {
          current += char
        }
      }
      result.push(current)
      return result
    }
    
    const headers = parseRow(lines[0])
    return lines.slice(1).map(line => {
      const values = parseRow(line)
      const obj: Record<string, unknown> = {}
      headers.forEach((h, i) => {
        let val: unknown = values[i] ?? ''
        if (val === 'true') val = true
        else if (val === 'false') val = false
        else if (val === 'null') val = null
        else if (!isNaN(Number(val)) && val !== '') val = Number(val)
        obj[h] = val
      })
      return obj
    })
  }

  const tsToJs = (ts: string): string => {
    return ts
      .replace(/:\s*(string|number|boolean|any|void|unknown|never|object|symbol|bigint|null|undefined)(\[\])?/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/interface\s+\w+\s*\{[^}]*\}/g, '')
      .replace(/type\s+\w+\s*=\s*[^;]+;/g, '')
      .replace(/as\s+\w+/g, '')
      .replace(/:\s*\{[^}]+\}/g, '')
      .replace(/readonly\s+/g, '')
      .replace(/private\s+/g, '')
      .replace(/public\s+/g, '')
      .replace(/protected\s+/g, '')
      .replace(/\?\s*:/g, ':')
  }

  const jsToTs = (js: string): string => {
    let ts = js
      .replace(/function\s+(\w+)\s*\(([^)]*)\)/g, (match, name, params) => {
        const typedParams = params.split(',').map((p: string) => {
          const trimmed = p.trim()
          if (!trimmed) return ''
          if (trimmed.includes(':')) return trimmed
          return `${trimmed}: any`
        }).join(', ')
        return `function ${name}(${typedParams}): any`
      })
    
    ts = ts.replace(/const\s+(\w+)\s*=/g, 'const $1: any =')
    ts = ts.replace(/let\s+(\w+)\s*=/g, 'let $1: any =')
    ts = ts.replace(/var\s+(\w+)\s*=/g, 'var $1: any =')
    
    return ts
  }

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentConversion = conversions.find(c => c.id === conversionType)!

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ArrowRightLeft className="w-7 h-7" />
            代码转换器
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            JSON/YAML/CSV/TypeScript/JavaScript 格式互转
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
            {conversions.map(conv => (
              <button
                key={conv.id}
                onClick={() => { setConversionType(conv.id); setOutput(''); setError(null) }}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  conversionType === conv.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {conv.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <span className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                {currentConversion.from === 'JSON' && <FileJson className="w-4 h-4" />}
                {currentConversion.from === 'YAML' && <FileCode className="w-4 h-4" />}
                {currentConversion.from === 'CSV' && <FileCode className="w-4 h-4" />}
                {currentConversion.from === 'TypeScript' && <Code2 className="w-4 h-4" />}
                {currentConversion.from === 'JavaScript' && <Code2 className="w-4 h-4" />}
                {currentConversion.from}
              </span>
            </div>
            <div className="p-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-80 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-mono text-sm resize-none"
                placeholder={`输入 ${currentConversion.from} 内容...`}
                spellCheck={false}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <span className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                {currentConversion.to === 'JSON' && <FileJson className="w-4 h-4" />}
                {currentConversion.to === 'YAML' && <FileCode className="w-4 h-4" />}
                {currentConversion.to === 'CSV' && <FileCode className="w-4 h-4" />}
                {currentConversion.to === 'TypeScript' && <Code2 className="w-4 h-4" />}
                {currentConversion.to === 'JavaScript' && <Code2 className="w-4 h-4" />}
                {currentConversion.to}
              </span>
              {output && (
                <button
                  onClick={copyOutput}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
            <div className="p-4">
              {error ? (
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center text-red-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <p>{error}</p>
                  </div>
                </div>
              ) : (
                <textarea
                  value={output}
                  readOnly
                  className="w-full h-80 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-mono text-sm resize-none"
                  placeholder="转换结果将显示在这里..."
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={convert}
            className="flex items-center gap-2 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            <ArrowRightLeft className="w-4 h-4" />
            转换
          </button>
        </div>
      </div>
    </div>
  )
}
