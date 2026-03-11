'use client'

import { useState, useRef, useEffect } from 'react'
import { ToolShell } from '@/components/tools'
import { Terminal, Play, Square, RotateCcw, Settings, Send } from 'lucide-react'

export default function WebSerialPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [baudRate, setBaudRate] = useState(115200)
  const [dataBits, setDataBits] = useState(8)
  const [stopBits, setStopBits] = useState(1)
  const [parity, setParity] = useState('none')
  const [autoScroll, setAutoScroll] = useState(true)
  const [showTimestamp, setShowTimestamp] = useState(true)
  const [sendMode, setSendMode] = useState('text')
  const [inputText, setInputText] = useState('')
  const [receiveText, setReceiveText] = useState('')
  
  const portRef = useRef<SerialPort | null>(null)
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null)
  const writerRef = useRef<WritableStreamDefaultWriter | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const connect = async () => {
    try {
      if (!('serial' in navigator)) {
        alert('您的浏览器不支持 Web Serial API，请使用 Chrome 或 Edge 浏览器')
        return
      }

      const port = await navigator.serial.requestPort()
      await port.open({
        baudRate: baudRate,
        dataBits: dataBits,
        stopBits: stopBits,
        parity: parity as any
      })

      portRef.current = port
      setIsConnected(true)
      startReading(port)
    } catch (error) {
      console.error('连接失败:', error)
    }
  }

  const disconnect = async () => {
    try {
      if (readerRef.current) {
        await readerRef.current.cancel()
        readerRef.current = null
      }
      if (writerRef.current) {
        await writerRef.current.close()
        writerRef.current = null
      }
      if (portRef.current) {
        await portRef.current.close()
        portRef.current = null
      }
      setIsConnected(false)
    } catch (error) {
      console.error('断开连接失败:', error)
    }
  }

  const startReading = async (port: SerialPort) => {
    const textDecoder = new TextDecoderStream()
    const readableStreamClosed = port.readable?.pipeThrough(textDecoder)
    const reader = readableStreamClosed?.getReader()
    readerRef.current = reader || null

    while (port.readable && isConnected) {
      try {
        const { value, done } = await reader!.read()
        if (done) break
        if (value) {
          const timestamp = showTimestamp ? `[${new Date().toLocaleTimeString()}] ` : ''
          setReceiveText(prev => prev + timestamp + value)
        }
      } catch (error) {
        console.error('读取错误:', error)
        break
      }
    }
  }

  const sendData = async () => {
    if (!inputText || !portRef.current?.writable) return

    try {
      const writer = writerRef.current || portRef.current.writable.getWriter()
      writerRef.current = writer

      let dataToSend = inputText
      if (sendMode === 'text') {
        dataToSend += '\n'
      } else if (sendMode === 'hex') {
        const hex = inputText.replace(/\s/g, '')
        const bytes = []
        for (let i = 0; i < hex.length; i += 2) {
          bytes.push(parseInt(hex.substr(i, 2), 16))
        }
        await writer.write(new Uint8Array(bytes))
        setInputText('')
        return
      }

      await writer.write(dataToSend)
      setInputText('')
    } catch (error) {
      console.error('发送失败:', error)
    }
  }

  const clearReceive = () => {
    setReceiveText('')
  }

  useEffect(() => {
    if (textareaRef.current && autoScroll) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight
    }
  }, [receiveText, autoScroll])

  return (
    <ToolShell title="Web 串口助手" icon={<Terminal className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-4 items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">波特率:</label>
            <select
              value={baudRate}
              onChange={(e) => setBaudRate(Number(e.target.value))}
              disabled={isConnected}
              className="px-3 py-1.5 border rounded-md text-sm bg-white dark:bg-gray-700"
            >
              <option value={9600}>9600</option>
              <option value={19200}>19200</option>
              <option value={38400}>38400</option>
              <option value={57600}>57600</option>
              <option value={115200}>115200</option>
              <option value={230400}>230400</option>
              <option value={460800}>460800</option>
              <option value={921600}>921600</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">数据位:</label>
            <select
              value={dataBits}
              onChange={(e) => setDataBits(Number(e.target.value))}
              disabled={isConnected}
              className="px-3 py-1.5 border rounded-md text-sm bg-white dark:bg-gray-700"
            >
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">停止位:</label>
            <select
              value={stopBits}
              onChange={(e) => setStopBits(Number(e.target.value))}
              disabled={isConnected}
              className="px-3 py-1.5 border rounded-md text-sm bg-white dark:bg-gray-700"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">校验位:</label>
            <select
              value={parity}
              onChange={(e) => setParity(e.target.value)}
              disabled={isConnected}
              className="px-3 py-1.5 border rounded-md text-sm bg-white dark:bg-gray-700"
            >
              <option value="none">无</option>
              <option value="odd">奇校验</option>
              <option value="even">偶校验</option>
            </select>
          </div>

          {!isConnected ? (
            <button
              onClick={connect}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
            >
              <Play className="w-4 h-4" />
              连接串口
            </button>
          ) : (
            <button
              onClick={disconnect}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
            >
              <Square className="w-4 h-4" />
              断开连接
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">自动滚动</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showTimestamp}
              onChange={(e) => setShowTimestamp(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">显示时间戳</span>
          </label>
          <button
            onClick={clearReceive}
            className="flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            清空
          </button>
        </div>

        <div className="flex-1 min-h-[300px]">
          <textarea
            ref={textareaRef}
            value={receiveText}
            readOnly
            className="w-full h-full min-h-[300px] p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
            placeholder="接收区..."
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex gap-2 mb-2">
            <select
              value={sendMode}
              onChange={(e) => setSendMode(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-700"
            >
              <option value="text">文本模式</option>
              <option value="hex">HEX模式</option>
            </select>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendData()}
              placeholder="输入要发送的内容..."
              className="flex-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-700"
            />
            <button
              onClick={sendData}
              disabled={!isConnected}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors"
            >
              <Send className="w-4 h-4" />
              发送
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          <p><strong>提示:</strong> Web 串口助手需要使用 Chrome 或 Edge 浏览器。连接后即可与串口设备进行通信。</p>
        </div>
      </div>
    </ToolShell>
  )
}
