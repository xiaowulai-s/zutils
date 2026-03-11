'use client'

import { useState, useMemo } from 'react'
import { ToolShell } from '@/components/tools'
import { ShieldCheck, Copy, Check, RotateCcw } from 'lucide-react'

interface CRCAlgorithm {
  name: string
  width: number
  poly: number
  init: number
  refIn: boolean
  refOut: boolean
  xorOut: number
  check: string
}

const crcAlgorithms: CRCAlgorithm[] = [
  { name: 'CRC-8', width: 8, poly: 0x07, init: 0x00, refIn: false, refOut: false, xorOut: 0x00, check: '0xF4' },
  { name: 'CRC-8/CDMA2000', width: 8, poly: 0x9B, init: 0xFF, refIn: false, refOut: false, xorOut: 0x00, check: '0xDA' },
  { name: 'CRC-8/DARC', width: 8, poly: 0x39, init: 0x00, refIn: true, refOut: true, xorOut: 0x00, check: '0x15' },
  { name: 'CRC-8/DVB-S2', width: 8, poly: 0xD5, init: 0x00, refIn: false, refOut: false, xorOut: 0x00, check: '0xBC' },
  { name: 'CRC-8/EBU', width: 8, poly: 0x1D, init: 0xFF, refIn: true, refOut: true, xorOut: 0x00, check: '0x97' },
  { name: 'CRC-8/I-CODE', width: 8, poly: 0x1D, init: 0xFD, refIn: false, refOut: false, xorOut: 0x00, check: '0x7E' },
  { name: 'CRC-8/MAXIM', width: 8, poly: 0x31, init: 0x00, refIn: true, refOut: true, xorOut: 0x00, check: '0xA1' },
  { name: 'CRC-8/ROHC', width: 8, poly: 0x07, init: 0xFF, refIn: true, refOut: true, xorOut: 0x00, check: '0xD0' },
  { name: 'CRC-8/WCDMA', width: 8, poly: 0x9B, init: 0x00, refIn: true, refOut: true, xorOut: 0x00, check: '0x25' },
  { name: 'CRC-16', width: 16, poly: 0x8005, init: 0x0000, refIn: true, refOut: true, xorOut: 0x0000, check: '0xBB3D' },
  { name: 'CRC-16/CCITT', width: 16, poly: 0x1021, init: 0x0000, refIn: true, refOut: true, xorOut: 0x0000, check: '0x2189' },
  { name: 'CRC-16/CCITT-FALSE', width: 16, poly: 0x1021, init: 0xFFFF, refIn: false, refOut: false, xorOut: 0x0000, check: '0x29B1' },
  { name: 'CRC-16/CDMA2000', width: 16, poly: 0xC867, init: 0xFFFF, refIn: false, refOut: false, xorOut: 0x0000, check: '0x4C06' },
  { name: 'CRC-16/DECT-R', width: 16, poly: 0x0589, init: 0x0000, refIn: false, refOut: false, xorOut: 0x0001, check: '0x007E' },
  { name: 'CRC-16/DECT-X', width: 16, poly: 0x0589, init: 0x0000, refIn: false, refOut: false, xorOut: 0x0000, check: '0x007F' },
  { name: 'CRC-16/DNP', width: 16, poly: 0x3D65, init: 0x0000, refIn: true, refOut: true, xorOut: 0xFFFF, check: '0xEA82' },
  { name: 'CRC-16/GENIBUS', width: 16, poly: 0x1021, init: 0xFFFF, refIn: false, refOut: false, xorOut: 0xFFFF, check: '0xD64E' },
  { name: 'CRC-16/MAXIM', width: 16, poly: 0x8005, init: 0x0000, refIn: true, refOut: true, xorOut: 0xFFFF, check: '0x44C2' },
  { name: 'CRC-16/MCRF4XX', width: 16, poly: 0x1021, init: 0xFFFF, refIn: true, refOut: true, xorOut: 0x0000, check: '0x6F91' },
  { name: 'CRC-16/RIELLO', width: 16, poly: 0x1021, init: 0xB2AA, refIn: true, refOut: true, xorOut: 0x0000, check: '0x63D0' },
  { name: 'CRC-16/TMS37157', width: 16, poly: 0x1021, init: 0x89EC, refIn: true, refOut: true, xorOut: 0x0000, check: '0x26B1' },
  { name: 'CRC-16/USB', width: 16, poly: 0xA001, init: 0xFFFF, refIn: true, refOut: true, xorOut: 0xFFFF, check: '0xB4C8' },
  { name: 'CRC-16/X-25', width: 16, poly: 0x1021, init: 0xFFFF, refIn: true, refOut: true, xorOut: 0xFFFF, check: '0x906E' },
  { name: 'CRC-16/XMODEM', width: 16, poly: 0x1021, init: 0x0000, refIn: false, refOut: false, xorOut: 0x0000, check: '0x31C3' },
  { name: 'CRC-16/MODBUS', width: 16, poly: 0x8005, init: 0xFFFF, refIn: true, refOut: true, xorOut: 0x0000, check: '0x4B37' },
  { name: 'CRC-32', width: 32, poly: 0x04C11DB7, init: 0xFFFFFFFF, refIn: true, refOut: true, xorOut: 0xFFFFFFFF, check: '0xCBF43926' },
  { name: 'CRC-32/BZIP2', width: 32, poly: 0x04C11DB7, init: 0xFFFFFFFF, refIn: false, refOut: false, xorOut: 0xFFFFFFFF, check: '0xFC891918' },
  { name: 'CRC-32C', width: 32, poly: 0x1EDC6F41, init: 0xFFFFFFFF, refIn: true, refOut: true, xorOut: 0xFFFFFFFF, check: '0xE3069283' },
  { name: 'CRC-32D', width: 32, poly: 0xA833982B, init: 0xFFFFFFFF, refIn: true, refOut: true, xorOut: 0xFFFFFFFF, check: '0x87315576' },
  { name: 'CRC-32/MPEG-2', width: 32, poly: 0x04C11DB7, init: 0xFFFFFFFF, refIn: false, refOut: false, xorOut: 0x00000000, check: '0x0376E6E7' },
  { name: 'CRC-32/POSIX', width: 32, poly: 0x04C11DB7, init: 0x00000000, refIn: false, refOut: false, xorOut: 0xFFFFFFFF, check: '0x765E7680' },
  { name: 'CRC-32Q', width: 32, poly: 0x814141AB, init: 0x00000000, refIn: false, refOut: false, xorOut: 0x00000000, check: '0x3010BF7F' },
]

function reflectBits(value: number, width: number): number {
  let result = 0
  for (let i = 0; i < width; i++) {
    if (value & (1 << i)) {
      result |= 1 << (width - 1 - i)
    }
  }
  return result
}

function calculateCRC(data: Uint8Array, algorithm: CRCAlgorithm): number {
  const { width, poly, init, refIn, refOut, xorOut } = algorithm
  const mask = width === 8 ? 0xFF : width === 16 ? 0xFFFF : 0xFFFFFFFF
  const msbMask = width === 8 ? 0x80 : width === 16 ? 0x8000 : 0x80000000

  let crc = init

  for (let i = 0; i < data.length; i++) {
    let byte = data[i]
    if (refIn) {
      byte = reflectBits(byte, 8)
    }
    
    if (width === 8) {
      crc ^= byte
    } else if (width === 16) {
      crc ^= (byte << 8) & 0xFFFF
    } else {
      crc ^= (byte << 24) >>> 0
    }

    for (let j = 0; j < 8; j++) {
      if (crc & (width === 32 ? 0x80000000 : width === 16 ? 0x8000 : 0x80)) {
        crc = ((crc << 1) ^ poly) & mask
      } else {
        crc = (crc << 1) & mask
      }
    }
  }

  if (refOut) {
    crc = reflectBits(crc, width)
  }

  return (crc ^ xorOut) & mask
}

function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.replace(/\s+/g, '')
  const bytes = new Uint8Array(cleanHex.length / 2)
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16)
  }
  return bytes
}

export default function CRCCalculatorPage() {
  const [input, setInput] = useState('')
  const [inputType, setInputType] = useState<'text' | 'hex'>('text')
  const [selectedWidth, setSelectedWidth] = useState<'all' | '8' | '16' | '32'>('all')
  const [copySuccess, setCopySuccess] = useState<string | null>(null)

  const inputBytes = useMemo(() => {
    if (!input) return new Uint8Array(0)
    if (inputType === 'hex') {
      return hexToBytes(input)
    }
    return new TextEncoder().encode(input)
  }, [input, inputType])

  const results = useMemo(() => {
    if (inputBytes.length === 0) return []
    
    const filteredAlgos = crcAlgorithms.filter(algo => {
      if (selectedWidth === 'all') return true
      return algo.width.toString() === selectedWidth
    })

    return filteredAlgos.map(algo => ({
      ...algo,
      result: calculateCRC(inputBytes, algo)
    }))
  }, [inputBytes, selectedWidth])

  const copyResult = async (name: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopySuccess(name)
      setTimeout(() => setCopySuccess(null), 2000)
    } catch (e) {
      console.error('复制失败:', e)
    }
  }

  const clearAll = () => {
    setInput('')
  }

  const formatHex = (value: number, width: number): string => {
    const hexDigits = Math.ceil(width / 4)
    return '0x' + value.toString(16).toUpperCase().padStart(hexDigits, '0')
  }

  return (
    <ToolShell title="CRC 计算器" icon={<ShieldCheck className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value as 'text' | 'hex')}
            className="px-4 py-2 border rounded-md bg-background"
          >
            <option value="text">文本输入</option>
            <option value="hex">十六进制</option>
          </select>
          <select
            value={selectedWidth}
            onChange={(e) => setSelectedWidth(e.target.value as any)}
            className="px-4 py-2 border rounded-md bg-background"
          >
            <option value="all">全部算法</option>
            <option value="8">CRC-8 系列</option>
            <option value="16">CRC-16 系列</option>
            <option value="32">CRC-32 系列</option>
          </select>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            清空
          </button>
        </div>

        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputType === 'text' ? '输入文本...' : '输入十六进制（如：01 02 03 FF）...'}
            className="w-full h-32 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
          />
        </div>

        {input && results.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b">
              <span className="text-sm font-medium">计算结果 ({results.length} 个算法)</span>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">算法名称</th>
                    <th className="px-4 py-2 text-left font-medium">宽度</th>
                    <th className="px-4 py-2 text-left font-medium">多项式</th>
                    <th className="px-4 py-2 text-right font-medium">结果</th>
                    <th className="px-4 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {results.map((algo) => (
                    <tr key={algo.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-2 font-mono">{algo.name}</td>
                      <td className="px-4 py-2">{algo.width}-bit</td>
                      <td className="px-4 py-2 font-mono text-xs">{formatHex(algo.poly, algo.width)}</td>
                      <td className="px-4 py-2 font-mono text-right font-medium text-primary">
                        {formatHex(algo.result, algo.width)}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => copyResult(algo.name, formatHex(algo.result, algo.width))}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          title="复制"
                        >
                          {copySuccess === algo.name ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!input && (
          <div className="text-center py-8 text-muted-foreground">
            <p>输入文本或十六进制数据以计算 CRC 校验值</p>
          </div>
        )}

        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
          <p><strong>支持的算法:</strong> 包含 9 种 CRC-8、16 种 CRC-16、7 种 CRC-32 标准算法</p>
          <p><strong>测试用例:</strong> 输入 "123456789" 可以验证算法正确性（Check 值）</p>
          <p><strong>提示:</strong> CRC（循环冗余校验）是一种常用的数据校验方法，广泛用于通信和存储领域。</p>
        </div>
      </div>
    </ToolShell>
  )
}
