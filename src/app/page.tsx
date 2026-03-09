import { ToolCard } from '@/components/tools'
import { toolsByCategory } from '@/config/tools'
import { Search, Sparkles } from 'lucide-react'

export default function HomePage() {
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
              placeholder="搜索工具..."
              className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </section>
      
      {Object.entries(toolsByCategory).map(([categoryId, category]) => (
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
      ))}
      
      <section className="mt-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          更多工具开发中，欢迎提交建议...
        </div>
      </section>
    </div>
  )
}
