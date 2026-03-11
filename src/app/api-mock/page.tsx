'use client'

import { useState, useCallback } from 'react'
import { Play, Plus, Trash2, Copy, Check, Server, Send, Clock, AlertCircle, CheckCircle } from 'lucide-react'

interface MockEndpoint {
  id: string
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  status: number
  contentType: string
  body: string
  delay: number
}

interface RequestLog {
  id: string
  timestamp: Date
  method: string
  path: string
  body?: string
  response: string
  status: number
}

const defaultEndpoints: MockEndpoint[] = [
  {
    id: '1',
    path: '/api/users',
    method: 'GET',
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      users: [
        { id: 1, name: '张三', email: 'zhangsan@example.com' },
        { id: 2, name: '李四', email: 'lisi@example.com' },
        { id: 3, name: '王五', email: 'wangwu@example.com' }
      ],
      total: 3
    }, null, 2),
    delay: 100
  },
  {
    id: '2',
    path: '/api/user/:id',
    method: 'GET',
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com',
      age: 28,
      role: 'admin'
    }, null, 2),
    delay: 50
  },
  {
    id: '3',
    path: '/api/users',
    method: 'POST',
    status: 201,
    contentType: 'application/json',
    body: JSON.stringify({
      success: true,
      message: '用户创建成功',
      data: { id: 4, name: '新用户' }
    }, null, 2),
    delay: 200
  }
]

export default function ApiMockPage() {
  const [endpoints, setEndpoints] = useState<MockEndpoint[]>(defaultEndpoints)
  const [selectedEndpoint, setSelectedEndpoint] = useState<MockEndpoint | null>(null)
  const [logs, setLogs] = useState<RequestLog[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const addEndpoint = () => {
    const newEndpoint: MockEndpoint = {
      id: Date.now().toString(),
      path: '/api/new-endpoint',
      method: 'GET',
      status: 200,
      contentType: 'application/json',
      body: '{\n  "message": "Hello World"\n}',
      delay: 0
    }
    setEndpoints([...endpoints, newEndpoint])
    setSelectedEndpoint(newEndpoint)
  }

  const deleteEndpoint = (id: string) => {
    setEndpoints(endpoints.filter(e => e.id !== id))
    if (selectedEndpoint?.id === id) {
      setSelectedEndpoint(null)
    }
  }

  const updateEndpoint = (id: string, updates: Partial<MockEndpoint>) => {
    setEndpoints(endpoints.map(e => 
      e.id === id ? { ...e, ...updates } : e
    ))
    if (selectedEndpoint?.id === id) {
      setSelectedEndpoint({ ...selectedEndpoint, ...updates })
    }
  }

  const simulateRequest = useCallback(async (endpoint: MockEndpoint) => {
    const startTime = Date.now()
    
    if (endpoint.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, endpoint.delay))
    }
    
    const log: RequestLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      method: endpoint.method,
      path: endpoint.path,
      response: endpoint.body,
      status: endpoint.status
    }
    
    setLogs(prev => [log, ...prev].slice(0, 50))
    return log
  }, [])

  const testEndpoint = async (endpoint: MockEndpoint) => {
    setIsRunning(true)
    await simulateRequest(endpoint)
    setIsRunning(false)
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Server className="w-7 h-7" />
            API Mock 服务器
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            创建模拟 API 端点，用于前端开发和测试
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <span className="font-medium text-gray-700 dark:text-gray-200">端点列表</span>
              <button
                onClick={addEndpoint}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                添加
              </button>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {endpoints.map(endpoint => (
                <div
                  key={endpoint.id}
                  onClick={() => setSelectedEndpoint(endpoint)}
                  className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    selectedEndpoint?.id === endpoint.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        endpoint.method === 'GET' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                        endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                        endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                        endpoint.method === 'DELETE' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                        'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                      }`}>
                        {endpoint.method}
                      </span>
                      <span className="text-sm font-mono text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                        {endpoint.path}
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteEndpoint(endpoint.id) }}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    状态: {endpoint.status} | 延迟: {endpoint.delay}ms
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {selectedEndpoint ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <span className="font-medium text-gray-700 dark:text-gray-200">端点配置</span>
                  <button
                    onClick={() => testEndpoint(selectedEndpoint)}
                    disabled={isRunning}
                    className="flex items-center gap-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
                  >
                    <Play className="w-4 h-4" />
                    测试
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        请求方法
                      </label>
                      <select
                        value={selectedEndpoint.method}
                        onChange={(e) => updateEndpoint(selectedEndpoint.id, { method: e.target.value as MockEndpoint['method'] })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        状态码
                      </label>
                      <select
                        value={selectedEndpoint.status}
                        onChange={(e) => updateEndpoint(selectedEndpoint.id, { status: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                      >
                        <option value="200">200 OK</option>
                        <option value="201">201 Created</option>
                        <option value="204">204 No Content</option>
                        <option value="400">400 Bad Request</option>
                        <option value="401">401 Unauthorized</option>
                        <option value="403">403 Forbidden</option>
                        <option value="404">404 Not Found</option>
                        <option value="500">500 Internal Server Error</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      路径
                    </label>
                    <input
                      type="text"
                      value={selectedEndpoint.path}
                      onChange={(e) => updateEndpoint(selectedEndpoint.id, { path: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-mono"
                      placeholder="/api/endpoint"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Content-Type
                      </label>
                      <select
                        value={selectedEndpoint.contentType}
                        onChange={(e) => updateEndpoint(selectedEndpoint.id, { contentType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                      >
                        <option value="application/json">application/json</option>
                        <option value="text/plain">text/plain</option>
                        <option value="text/html">text/html</option>
                        <option value="application/xml">application/xml</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        延迟 (ms)
                      </label>
                      <input
                        type="number"
                        value={selectedEndpoint.delay}
                        onChange={(e) => updateEndpoint(selectedEndpoint.id, { delay: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                        min="0"
                        max="10000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      响应体
                    </label>
                    <textarea
                      value={selectedEndpoint.body}
                      onChange={(e) => updateEndpoint(selectedEndpoint.id, { body: e.target.value })}
                      className="w-full h-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-mono text-sm resize-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                <Server className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">选择一个端点进行编辑，或创建新端点</p>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <span className="font-medium text-gray-700 dark:text-gray-200">请求日志</span>
                <button
                  onClick={clearLogs}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  清空
                </button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {logs.length > 0 ? logs.map(log => (
                  <div key={log.id} className="p-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          log.status < 300 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                          log.status < 400 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {log.status}
                        </span>
                        <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                          {log.method} {log.path}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        {log.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-2 rounded overflow-x-auto text-gray-600 dark:text-gray-400">
                      {log.response}
                    </pre>
                  </div>
                )) : (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    暂无请求日志
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
