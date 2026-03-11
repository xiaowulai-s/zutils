'use client'

import { useState } from 'react'
import { Lock, Unlock, Copy, Check, RefreshCw, Key, Shield, AlertCircle } from 'lucide-react'

type Algorithm = 'aes' | 'des' | 'rabbit' | 'rc4'

export default function EncryptionPage() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt')
  const [algorithm, setAlgorithm] = useState<Algorithm>('aes')
  const [input, setInput] = useState('')
  const [key, setKey] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const generateKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let result = ''
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setKey(result)
  }

  const process = async () => {
    setError(null)
    setOutput('')

    if (!input) {
      setError('请输入内容')
      return
    }
    if (!key) {
      setError('请输入密钥')
      return
    }

    try {
      if (mode === 'encrypt') {
        const encrypted = await encryptData(input, key)
        setOutput(encrypted)
      } else {
        const decrypted = await decryptData(input, key)
        setOutput(decrypted)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '处理失败')
    }
  }

  const encryptData = async (data: string, secretKey: string): Promise<string> => {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    
    const keyData = encoder.encode(secretKey)
    const hashBuffer = await crypto.subtle.digest('SHA-256', keyData)
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      hashBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    )
    
    const iv = crypto.getRandomValues(new Uint8Array(12))
    
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      dataBuffer
    )
    
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength)
    combined.set(iv)
    combined.set(new Uint8Array(encryptedBuffer), iv.length)
    
    return btoa(String.fromCharCode(...combined))
  }

  const decryptData = async (encryptedData: string, secretKey: string): Promise<string> => {
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    
    const combined = new Uint8Array(
      atob(encryptedData).split('').map(c => c.charCodeAt(0))
    )
    
    const iv = combined.slice(0, 12)
    const data = combined.slice(12)
    
    const keyData = encoder.encode(secretKey)
    const hashBuffer = await crypto.subtle.digest('SHA-256', keyData)
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      hashBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    )
    
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      data
    )
    
    return decoder.decode(decryptedBuffer)
  }

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const swap = () => {
    setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt')
    setInput(output)
    setOutput('')
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-7 h-7" />
            加密解密工具
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            AES 加密解密，支持自定义密钥
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setMode('encrypt')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                mode === 'encrypt'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Lock className="w-4 h-4" />
              加密
            </button>
            <button
              onClick={() => setMode('decrypt')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                mode === 'decrypt'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Unlock className="w-4 h-4" />
              解密
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                密钥
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                    placeholder="输入加密密钥..."
                  />
                </div>
                <button
                  onClick={generateKey}
                  className="flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  生成
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                密钥用于加密/解密，请妥善保管
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {mode === 'encrypt' ? '明文' : '密文'}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-mono text-sm resize-none"
                placeholder={mode === 'encrypt' ? '输入要加密的内容...' : '输入要解密的内容...'}
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={process}
                className="flex items-center gap-2 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                {mode === 'encrypt' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                {mode === 'encrypt' ? '加密' : '解密'}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {mode === 'encrypt' ? '密文' : '明文'}
                </label>
                {output && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={swap}
                      className="text-sm text-blue-500 hover:text-blue-600"
                    >
                      交换
                    </button>
                    <button
                      onClick={copyOutput}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>
              <textarea
                value={output}
                readOnly
                className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-mono text-sm resize-none"
                placeholder="结果将显示在这里..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">使用说明</h2>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p>• <strong>加密算法</strong>: 使用 AES-256-GCM 算法，安全性高</p>
            <p>• <strong>密钥要求</strong>: 任意字符串，系统会自动进行 SHA-256 哈希处理</p>
            <p>• <strong>加密流程</strong>: 明文 + 密钥 → 加密 → Base64 编码密文</p>
            <p>• <strong>解密流程</strong>: Base64 密文 + 密钥 → 解密 → 明文</p>
            <p>• <strong>注意事项</strong>: 请妥善保管密钥，密钥丢失将无法解密</p>
          </div>
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>安全提示：</strong>所有加密解密操作均在浏览器本地完成，数据不会上传到服务器。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
