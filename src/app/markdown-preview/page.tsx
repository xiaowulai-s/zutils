'use client'

import { useState, useMemo } from 'react'
import { ToolShell } from '@/components/tools'
import { FileText, Copy, Check, RotateCcw, Eye, EyeOff } from 'lucide-react'

export default function MarkdownPreviewPage() {
  const [markdown, setMarkdown] = useState('')
  const [showPreview, setShowPreview] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)

  const html = useMemo(() => {
    if (!markdown) return ''
    
    return markdown
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`([^`]+)`/gim, '<code class="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">$1</code>')
      .replace(/```(\w*)\n([\s\S]*?)```/gim, '<pre class="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto my-2"><code>$2</code></pre>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-500 hover:underline" target="_blank">$1</a>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/\n/gim, '<br>')
  }, [markdown])

  const copyHtml = async () => {
    if (!html) return
    await navigator.clipboard.writeText(html)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const clearAll = () => setMarkdown('')

  const loadSample = () => {
    setMarkdown(`# Markdown 示例

## 标题语法

这是一段普通文本，支持 **粗体** 和 *斜体*。

### 代码

行内代码: \`const x = 1\`

代码块:
\`\`\`javascript
function hello() {
  console.log('Hello, World!')
}
\`\`\`

### 列表

- 列表项 1
- 列表项 2
- 列表项 3

### 链接

[访问 GitHub](https://github.com)

> 这是一个引用块`)
  }

  return (
    <ToolShell title="Markdown 预览" icon={<FileText className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? '隐藏预览' : '显示预览'}
          </button>
          <button
            onClick={copyHtml}
            disabled={!html}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            复制 HTML
          </button>
          <button
            onClick={loadSample}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            示例
          </button>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            清空
          </button>
        </div>

        <div className={`grid ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-4`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Markdown</span>
              <span className="text-xs text-gray-400">{markdown.length} 字符</span>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="输入 Markdown..."
              className="w-full h-96 p-4 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 resize-none"
            />
          </div>
          {showPreview && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">预览</span>
              </div>
              <div
                className="h-96 p-4 border rounded-lg bg-white dark:bg-gray-900 overflow-y-auto prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>Markdown 预览器</strong> 实时渲染 Markdown 语法，支持标题、粗体、斜体、代码、列表、链接等常用语法。</p>
        </div>
      </div>
    </ToolShell>
  )
}
