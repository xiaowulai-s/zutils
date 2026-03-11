'use client'

import { useState, useMemo } from 'react'
import { ToolCard } from '@/components/tools'
import { tools, toolsByCategory } from '@/config/tools'
import { Search, Sparkles, X } from 'lucide-react'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')

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
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索工具名称、描述或关键词..."
              className="w-full h-10 pl-10 pr-10 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
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

      {filteredTools ? (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">搜索结果</h2>
          </div>
          
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
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
                <ToolCard key={tool.id} tool={tool} />
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
    </div>
  )
}
