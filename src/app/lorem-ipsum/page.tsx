'use client'

import { useState } from 'react'
import { ToolShell } from '@/components/tools'
import { Type, Copy, Check, RotateCcw, RefreshCw } from 'lucide-react'

const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
]

const chineseWords = [
  '的', '一', '是', '在', '不', '了', '有', '和', '人', '这', '中', '大', '为',
  '上', '个', '国', '我', '以', '要', '他', '时', '来', '用', '们', '生', '到',
  '作', '地', '于', '出', '就', '分', '对', '成', '会', '可', '主', '发', '年',
  '动', '同', '工', '也', '能', '下', '过', '子', '说', '产', '种', '面', '而',
  '方', '后', '多', '定', '行', '学', '法', '所', '民', '得', '经', '十三', '之',
  '进', '着', '等', '部', '度', '家', '电', '力', '里', '如', '水', '化', '高',
  '自', '二', '理', '起', '小', '物', '现', '实', '加', '量', '都', '两', '体',
  '制', '机', '当', '使', '点', '从', '业', '本', '去', '把', '性', '好', '应'
]

export default function LoremIpsumPage() {
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs')
  const [count, setCount] = useState(3)
  const [language, setLanguage] = useState<'latin' | 'chinese'>('latin')
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [output, setOutput] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  const generateWord = (isChinese: boolean) => {
    const words = isChinese ? chineseWords : loremWords
    return words[Math.floor(Math.random() * words.length)]
  }

  const generateSentence = (isChinese: boolean, startWithLoremText: boolean = false) => {
    const wordCount = Math.floor(Math.random() * 10) + 8
    const words: string[] = []

    if (startWithLoremText && !isChinese) {
      words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet')
    }

    const remainingWords = startWithLoremText && !isChinese ? wordCount - 5 : wordCount

    for (let i = 0; i < remainingWords; i++) {
      words.push(generateWord(isChinese))
    }

    let sentence = words.join(' ')
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1)
    sentence += isChinese ? '。' : '.'

    return sentence
  }

  const generateParagraph = (isChinese: boolean, startWithLoremText: boolean = false) => {
    const sentenceCount = Math.floor(Math.random() * 4) + 4
    const sentences: string[] = []

    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence(isChinese, startWithLoremText && i === 0))
    }

    return sentences.join(' ')
  }

  const generate = () => {
    const isChinese = language === 'chinese'
    let result = ''

    if (type === 'words') {
      const words: string[] = []
      for (let i = 0; i < count; i++) {
        words.push(generateWord(isChinese))
      }
      result = words.join(' ')
    } else if (type === 'sentences') {
      const sentences: string[] = []
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence(isChinese, startWithLorem && i === 0))
      }
      result = sentences.join(' ')
    } else {
      const paragraphs: string[] = []
      for (let i = 0; i < count; i++) {
        paragraphs.push(generateParagraph(isChinese, startWithLorem && i === 0))
      }
      result = paragraphs.join('\n\n')
    }

    setOutput(result)
  }

  const copyOutput = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const clearAll = () => {
    setOutput('')
  }

  return (
    <ToolShell title="Lorem Ipsum 生成" icon={<Type className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setType('paragraphs')}
              className={`px-4 py-2 ${type === 'paragraphs' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              段落
            </button>
            <button
              onClick={() => setType('sentences')}
              className={`px-4 py-2 ${type === 'sentences' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              句子
            </button>
            <button
              onClick={() => setType('words')}
              className={`px-4 py-2 ${type === 'words' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              单词
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">数量:</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
              className="w-20 px-3 py-1.5 border rounded-md bg-background"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">语言:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'latin' | 'chinese')}
              className="px-3 py-1.5 border rounded-md bg-background"
            >
              <option value="latin">拉丁文</option>
              <option value="chinese">中文</option>
            </select>
          </div>
          {language === 'latin' && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">以 "Lorem ipsum" 开头</span>
            </label>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={generate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            <RefreshCw className="w-4 h-4" />
            生成
          </button>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            清空
          </button>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b flex items-center justify-between">
            <span className="text-sm font-medium">生成结果</span>
            {output && (
              <button
                onClick={copyOutput}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copySuccess ? '已复制' : '复制'}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="点击生成按钮生成占位文本..."
            className="w-full h-64 p-4 bg-gray-50 dark:bg-gray-800 resize-none border-0"
          />
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>Lorem Ipsum</strong> 是一种占位文本，常用于排版和设计预览。</p>
          <p className="mt-1">支持拉丁文和中文两种语言，可生成段落、句子或单词。</p>
        </div>
      </div>
    </ToolShell>
  )
}
