'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { ToolCard } from '@/components/tools'
import { tools, toolsByCategory } from '@/config/tools'
import { Search, Sparkles, X, Heart, History, Star, Keyboard } from 'lucide-react'
import { useUserPreferences } from '@/components/UserPreferences'
import { useGlobalShortcuts } from '@/hooks/useKeyboardShortcuts'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showShortcuts, setShowShortcuts] = useState(false)
  const { favorites, history, addToHistory } = useUserPreferences()
  const searchInputRef = useRef<HTMLInputElement>(null)

  useGlobalShortcuts(() => {
    searchInputRef.current?.focus()
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?') {
        setShowShortcuts(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return null

    const query = searchQuery.toLowerCase()
    return tools.filter(tool => 
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.keywords.some(keyword => keyword.toLowerCase().includes(query))
    )
  }, [searchQuery])

  const filteredCategories = useMemo(() => {
    if (filteredTools) return null

    if (!searchQuery.trim()) return toolsByCategory

    const query = searchQuery.toLowerCase()
    const result: Record<string, { name: string; icon: string; tools: typeof tools }> = {}

    for (const [categoryId, category] of Object.entries(toolsByCategory)) {
      const matchedTools = category.tools.filter(tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.keywords.some(keyword => keyword.toLowerCase().includes(query))
      )

      if (matchedTools.length > 0) {
        result[categoryId] = {
          ...category,
          tools: matchedTools
        }
      }
    }

    return result
  }, [searchQuery, filteredTools])

  const clearSearch = () => setSearchQuery('')

  const favoriteTools = tools.filter(t => favorites.includes(t.id))
  const historyTools = history.map(id => tools.find(t => t.id === id)).filter(Boolean)

  const handleToolClick = (toolId: string) => {
    addToHistory(toolId)
  }

  return (
    <div className="container py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          开发工具箱
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          提供 PCB 设计、电路计算、电子元器件选型等专业工具，助力硬件开发
        </p>
        
        <div className="mt-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索工具... (按 / 或 Ctrl+K 聚焦)"
              className="w-full h-10 pl-10 pr-20 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-muted rounded">
                <Keyboard className="w-3 h-3" /> /
              </kbd>
            </div>
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-muted-foreground">
              {filteredTools ? (
                <>找到 <span className="font-medium text-foreground">{filteredTools.length}</span> 个相关工具</>
              ) : (
                '输入关键词搜索工具'
              )}
            </p>
          )}
        </div>
      </section>

      {!searchQuery && favoriteTools.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Heart className="h-5 w-5 text-red-500" />
            <h2 className="text-2xl font-bold">收藏工具</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteTools.map((tool) => (
              <div key={tool.id} onClick={() => handleToolClick(tool.id)}>
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        </section>
      )}

      {!searchQuery && historyTools.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <History className="h-5 w-5 text-gray-500" />
            <h2 className="text-2xl font-bold">最近使用</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {historyTools.map((tool) => tool && (
              <div key={tool.id} onClick={() => handleToolClick(tool.id)}>
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        </section>
      )}

      {filteredTools ? (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">搜索结果</h2>
          </div>
          
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <div key={tool.id} onClick={() => handleToolClick(tool.id)}>
                  <ToolCard tool={tool} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>未找到匹配的工具</p>
              <p className="text-sm mt-2">尝试使用其他关键词搜索</p>
            </div>
          )}
        </section>
      ) : (
        Object.entries(filteredCategories || {}).map(([categoryId, category]) => (
          <section key={categoryId} id={categoryId} className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">{category.name}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.tools.map((tool) => (
                <div key={tool.id} onClick={() => handleToolClick(tool.id)}>
                  <ToolCard tool={tool} />
                </div>
              ))}
            </div>
          </section>
        ))
      )}
      
      <section className="mt-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          更多工具开发中，欢迎提交建议...
        </div>
      </section>

      {showShortcuts && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShortcuts(false)}>
          <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">键盘快捷键</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>聚焦搜索框</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-sm">/</kbd>
              </div>
              <div className="flex justify-between">
                <span>聚焦搜索框</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-sm">Ctrl+K</kbd>
              </div>
              <div className="flex justify-between">
                <span>显示/隐藏快捷键</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-sm">?</kbd>
              </div>
            </div>
            <button
              onClick={() => setShowShortcuts(false)}
              className="mt-4 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
