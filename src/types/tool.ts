export interface ToolCategory {
  id: string
  name: string
  icon: string
  description?: string
}

export interface ToolMeta {
  id: string
  name: string
  description: string
  category: ToolCategory
  icon: string
  path: string
  keywords: string[]
}

export interface ToolCardProps {
  tool: ToolMeta
}
