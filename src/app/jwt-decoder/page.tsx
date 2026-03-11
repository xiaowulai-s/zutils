'use client'

import { useState } from 'react'
import { ToolShell } from '@/components/tools'
import { KeyRound, Copy, Check, AlertCircle } from 'lucide-react'

interface JWTHeader {
  alg: string
  typ: string
  [key: string]: string
}

interface JWTPayload {
  [key: string]: unknown
}

export default function JWTDecoderPage() {
  const [token, setToken] = useState('')
  const [header, setHeader] = useState<JWTHeader | null>(null)
  const [payload, setPayload] = useState<JWTPayload | null>(null)
  const [signature, setSignature] = useState('')
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState<string | null>(null)

  const decode = () => {
    if (!token.trim()) {
      setHeader(null)
      setPayload(null)
      setSignature('')
      setError('')
      return
    }

    try {
      const parts = token.trim().split('.')
      if (parts.length !== 3) {
        throw new Error('JWT 格式错误：应包含 3 个部分（用 . 分隔）')
      }

      const decodeBase64 = (str: string) => {
        const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
        const jsonStr = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        )
        return JSON.parse(jsonStr)
      }

      const headerData = decodeBase64(parts[0])
      const payloadData = decodeBase64(parts[1])

      setHeader(headerData)
      setPayload(payloadData)
      setSignature(parts[2])
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : '解析失败')
      setHeader(null)
      setPayload(null)
      setSignature('')
    }
  }

  const copyValue = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopySuccess(key)
      setTimeout(() => setCopySuccess(null), 2000)
    } catch (e) {
      console.error('复制失败:', e)
    }
  }

  const isExpired = () => {
    if (!payload?.exp) return null
    const exp = (payload.exp as number) * 1000
    return Date.now() > exp
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('zh-CN')
  }

  return (
    <ToolShell title="JWT 解码器" icon={<KeyRound className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">JWT Token</label>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onInput={decode}
            placeholder="粘贴 JWT Token..."
            className="w-full h-24 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {payload && (
          <>
            {payload.exp && (
              <div className={`p-3 rounded-md ${
                isExpired() 
                  ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
                  : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              }`}>
                <span className={isExpired() ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                  {isExpired() ? '⚠️ Token 已过期' : '✓ Token 有效'}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  过期时间: {formatTime(payload.exp as number)}
                </span>
              </div>
            )}

            {payload.iat && (
              <div className="text-sm text-gray-500">
                签发时间: {formatTime(payload.iat as number)}
              </div>
            )}
          </>
        )}

        {header && (
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Header (JOSE)</span>
              <button
                onClick={() => copyValue('header', JSON.stringify(header, null, 2))}
                className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded"
              >
                {copySuccess === 'header' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
            <pre className="p-4 text-sm font-mono overflow-x-auto bg-gray-50 dark:bg-gray-800">
              {JSON.stringify(header, null, 2)}
            </pre>
          </div>
        )}

        {payload && (
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 border-b flex items-center justify-between">
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Payload (Claims)</span>
              <button
                onClick={() => copyValue('payload', JSON.stringify(payload, null, 2))}
                className="p-1 hover:bg-green-100 dark:hover:bg-green-800 rounded"
              >
                {copySuccess === 'payload' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
            <pre className="p-4 text-sm font-mono overflow-x-auto bg-gray-50 dark:bg-gray-800">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        )}

        {signature && (
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 border-b flex items-center justify-between">
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Signature</span>
              <button
                onClick={() => copyValue('signature', signature)}
                className="p-1 hover:bg-purple-100 dark:hover:bg-purple-800 rounded"
              >
                {copySuccess === 'signature' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
            <div className="p-4 text-sm font-mono break-all bg-gray-50 dark:bg-gray-800">
              {signature}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>JWT</strong> (JSON Web Token) 是一种开放标准，用于在各方之间安全传输信息。</p>
          <p className="mt-1">此工具仅解码 JWT，不验证签名。请勿将敏感 Token 分享给他人。</p>
        </div>
      </div>
    </ToolShell>
  )
}
