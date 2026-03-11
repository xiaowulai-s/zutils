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
  Microchip,
  Heart,
  Binary,
  ShieldCheck,
  Lock,
  ArrowRightLeft,
  Type,
  Clock,
  Sparkles,
  FileDiff,
  Palette,
  QrCode,
  Braces,
  Regex,
  Key,
  Image,
  Link2,
  Terminal,
  Globe,
  Ruler,
  Fingerprint,
  KeyRound,
  Code2,
  Database,
  GitBranch,
  Radio,
  Contrast,
  ImageDown,
  Shuffle,
  TextCursor,
  Server
} from 'lucide-react'
import { Card } from '@/components/ui'
import type { ToolMeta } from '@/types'
import { useUserPreferences } from '@/components/UserPreferences'

const iconMap: Record<string, React.ReactNode> = {
  'cpu': <Cpu className="h-6 w-6" />,
  'circuit-board': <CircuitBoard className="h-6 w-6" />,
  'zap': <Zap className="h-6 w-6" />,
  'battery': <Battery className="h-6 w-6" />,
  'lightbulb': <Lightbulb className="h-6 w-6" />,
  'resistor': <Circle className="h-6 w-6" />,
  'filter': <Filter className="h-6 w-6" />,
  'file-binary': <FileCode className="h-6 w-6" />,
  'book-open': <BookOpen className="h-6 w-6" />,
  'microchip': <Microchip className="h-6 w-6" />,
  'terminal': <Terminal className="h-6 w-6" />,
  'globe': <Globe className="h-6 w-6" />,
  'binary': <Binary className="h-6 w-6" />,
  'shield-check': <ShieldCheck className="h-6 w-6" />,
  'lock': <Lock className="h-6 w-6" />,
  'arrow-right-left': <ArrowRightLeft className="h-6 w-6" />,
  'type': <Type className="h-6 w-6" />,
  'clock': <Clock className="h-6 w-6" />,
  'sparkles': <Sparkles className="h-6 w-6" />,
  'file-diff': <FileDiff className="h-6 w-6" />,
  'palette': <Palette className="h-6 w-6" />,
  'qr-code': <QrCode className="h-6 w-6" />,
  'braces': <Braces className="h-6 w-6" />,
  'regex': <Regex className="h-6 w-6" />,
  'key': <Key className="h-6 w-6" />,
  'image': <Image className="h-6 w-6" />,
  'link': <Link2 className="h-6 w-6" />,
  'ruler': <Ruler className="h-6 w-6" />,
  'fingerprint': <Fingerprint className="h-6 w-6" />,
  'key-round': <KeyRound className="h-6 w-6" />,
  'code-2': <Code2 className="h-6 w-6" />,
  'database': <Database className="h-6 w-6" />,
  'git-branch': <GitBranch className="h-6 w-6" />,
  'radio': <Radio className="h-6 w-6" />,
  'contrast': <Contrast className="h-6 w-6" />,
  'image-down': <ImageDown className="h-6 w-6" />,
  'shuffle': <Shuffle className="h-6 w-6" />,
  'text-cursor': <TextCursor className="h-6 w-6" />,
  'file-code': <FileCode className="h-6 w-6" />,
  'code': <FileCode className="h-6 w-6" />,
  'server': <Server className="h-6 w-6" />,
}

interface ToolCardProps {
  tool: ToolMeta
}

export function ToolCard({ tool }: ToolCardProps) {
  const { toggleFavorite, isFavorite } = useUserPreferences()
  const favorite = isFavorite(tool.id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(tool.id)
  }

  return (
    <Link href={tool.path}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group relative">
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors z-10 ${
            favorite 
              ? 'text-red-500 bg-red-50 dark:bg-red-900/30' 
              : 'text-gray-300 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          title={favorite ? '取消收藏' : '添加收藏'}
        >
          <Heart className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
        </button>
        <div className="p-6">
          <div className="flex items-start justify-between pr-8">
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
          </div>
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
            {tool.description}
          </p>
        </div>
      </Card>
    </Link>
  )
}
