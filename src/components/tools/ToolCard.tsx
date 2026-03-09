import Link from 'next/link'
import { 
  Cpu, 
  CircuitBoard, 
  Zap, 
  Battery, 
  Lightbulb, 
  Resistor,
  Filter,
  FileBinary,
  BookOpen,
  Microchip,
  ChevronRight
} from 'lucide-react'
import { Card } from '@/components/ui'
import type { ToolMeta } from '@/types'

const iconMap: Record<string, React.ReactNode> = {
  'cpu': <Cpu className="h-6 w-6" />,
  'circuit-board': <CircuitBoard className="h-6 w-6" />,
  'zap': <Zap className="h-6 w-6" />,
  'battery': <Battery className="h-6 w-6" />,
  'lightbulb': <Lightbulb className="h-6 w-6" />,
  'resistor': <Resistor className="h-6 w-6" />,
  'filter': <Filter className="h-6 w-6" />,
  'file-binary': <FileBinary className="h-6 w-6" />,
  'book-open': <BookOpen className="h-6 w-6" />,
  'microchip': <Microchip className="h-6 w-6" />,
}

interface ToolCardProps {
  tool: ToolMeta
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={tool.path}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {iconMap[tool.icon]}
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {tool.category.name}
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
            {tool.description}
          </p>
        </div>
      </Card>
    </Link>
  )
}
