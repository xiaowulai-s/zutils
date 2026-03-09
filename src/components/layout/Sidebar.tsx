'use client'

import Link from 'next/link'
import { 
  Cpu, 
  CircuitBoard, 
  Zap, 
  Battery, 
  Lightbulb, 
  Circle,
  Filter,
  FileCode,
  BookOpen,
  Microchip
} from 'lucide-react'
import { tools } from '@/config/tools'

const iconMap: Record<string, React.ReactNode> = {
  'cpu': <Cpu className="h-4 w-4" />,
  'circuit-board': <CircuitBoard className="h-4 w-4" />,
  'zap': <Zap className="h-4 w-4" />,
  'battery': <Battery className="h-4 w-4" />,
  'lightbulb': <Lightbulb className="h-4 w-4" />,
  'resistor': <Circle className="h-4 w-4" />,
  'filter': <Filter className="h-4 w-4" />,
  'file-binary': <FileCode className="h-4 w-4" />,
  'book-open': <BookOpen className="h-4 w-4" />,
  'microchip': <Microchip className="h-4 w-4" />,
}

export function Sidebar() {
  const categories = tools.reduce((acc, tool) => {
    if (!acc[tool.category.id]) {
      acc[tool.category.id] = {
        name: tool.category.name,
        icon: tool.category.icon,
        tools: []
      }
    }
    acc[tool.category.id].tools.push(tool)
    return acc
  }, {} as Record<string, { name: string; icon: string; tools: typeof tools }>)
  
  return (
    <aside className="hidden lg:block w-64 border-r bg-muted/30 min-h-[calc(100vh-4rem)]">
      <div className="sticky top-16 p-4 space-y-6">
        {Object.entries(categories).map(([categoryId, category]) => (
          <div key={categoryId}>
            <h3 className="flex items-center gap-2 px-2 py-1 text-sm font-semibold text-muted-foreground">
              {iconMap[category.icon]}
              {category.name}
            </h3>
            <nav className="mt-2 space-y-1">
              {category.tools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {iconMap[tool.icon]}
                  {tool.name}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  )
}
