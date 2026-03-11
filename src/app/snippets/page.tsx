'use client'

import { useState, useEffect } from 'react'
import { ToolShell } from '@/components/tools'
import { Code2, Copy, Check, Plus, Trash2, FolderOpen, Search } from 'lucide-react'

interface Snippet {
  id: string
  title: string
  language: string
  code: string
  tags: string[]
  createdAt: number
}

const STORAGE_KEY = 'zutils_snippets'

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ title: '', language: 'javascript', code: '', tags: '' })
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setSnippets(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to load snippets:', e)
      }
    }
  }, [])

  const saveSnippets = (newSnippets: Snippet[]) => {
    setSnippets(newSnippets)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSnippets))
  }

  const createNew = () => {
    setSelectedSnippet(null)
    setEditForm({ title: '新代码片段', language: 'javascript', code: '', tags: '' })
    setIsEditing(true)
  }

  const saveSnippet = () => {
    const newSnippet: Snippet = {
      id: selectedSnippet?.id || Date.now().toString(),
      title: editForm.title,
      language: editForm.language,
      code: editForm.code,
      tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: selectedSnippet?.createdAt || Date.now(),
    }

    if (selectedSnippet) {
      saveSnippets(snippets.map(s => s.id === selectedSnippet.id ? newSnippet : s))
    } else {
      saveSnippets([newSnippet, ...snippets])
    }

    setSelectedSnippet(newSnippet)
    setIsEditing(false)
  }

  const deleteSnippet = (id: string) => {
    saveSnippets(snippets.filter(s => s.id !== id))
    if (selectedSnippet?.id === id) {
      setSelectedSnippet(null)
      setIsEditing(false)
    }
  }

  const copyCode = async () => {
    if (!selectedSnippet) return
    await navigator.clipboard.writeText(selectedSnippet.code)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const filteredSnippets = snippets.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
    s.language.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const languages = ['javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp', 'go', 'rust', 'html', 'css', 'sql', 'bash', 'json', 'markdown']

  return (
    <ToolShell title="代码片段管理" icon={<Code2 className="w-5 h-5" />}>
      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-200px)]">
        <div className="lg:w-64 flex-shrink-0 border rounded-lg overflow-hidden flex flex-col">
          <div className="p-3 border-b bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={createNew}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
              >
                <Plus className="w-4 h-4" />
                新建
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索片段..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-md bg-background"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredSnippets.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                {snippets.length === 0 ? '暂无代码片段' : '未找到匹配的片段'}
              </div>
            ) : (
              filteredSnippets.map(snippet => (
                <div
                  key={snippet.id}
                  onClick={() => { setSelectedSnippet(snippet); setIsEditing(false); }}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    selectedSnippet?.id === snippet.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate">{snippet.title}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteSnippet(snippet.id); }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{snippet.language}</span>
                    {snippet.tags.length > 0 && (
                      <span className="text-xs text-gray-400">
                        • {snippet.tags.slice(0, 2).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 border rounded-lg overflow-hidden flex flex-col">
          {isEditing ? (
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">标题</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">语言</label>
                  <select
                    value={editForm.language}
                    onChange={(e) => setEditForm({ ...editForm, language: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">标签 (逗号分隔)</label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                    placeholder="例如: react, hooks, 状态管理"
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">代码</label>
                  <textarea
                    value={editForm.code}
                    onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                    placeholder="在此输入代码..."
                    className="w-full h-64 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveSnippet}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          ) : selectedSnippet ? (
            <>
              <div className="px-4 py-3 border-b bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{selectedSnippet.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{selectedSnippet.language}</span>
                    {selectedSnippet.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyCode}
                    className="flex items-center gap-1 px-3 py-1.5 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  >
                    {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {copySuccess ? '已复制' : '复制'}
                  </button>
                  <button
                    onClick={() => {
                      setEditForm({
                        title: selectedSnippet.title,
                        language: selectedSnippet.language,
                        code: selectedSnippet.code,
                        tags: selectedSnippet.tags.join(', '),
                      })
                      setIsEditing(true)
                    }}
                    className="px-3 py-1.5 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  >
                    编辑
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <pre className="font-mono text-sm whitespace-pre-wrap">
                  <code>{selectedSnippet.code}</code>
                </pre>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Code2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>选择或创建一个代码片段</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  )
}
