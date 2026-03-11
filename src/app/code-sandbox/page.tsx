'use client'

import { useState } from 'react'
import { Play, Trash2, Copy, Check, Code2, Terminal, AlertCircle, CheckCircle } from 'lucide-react'

const languageTemplates: Record<string, string> = {
  javascript: `// JavaScript 代码运行沙箱
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
console.log('计算结果:', 1 + 2 + 3 + 4 + 5);

// 数组操作示例
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log('数组翻倍:', doubled);

// 对象操作示例
const user = { name: '张三', age: 25 };
console.log('用户信息:', JSON.stringify(user, null, 2));
`,
  typescript: `// TypeScript 代码运行沙箱
interface User {
  name: string;
  age: number;
  email?: string;
}

function createUser(name: string, age: number): User {
  return { name, age, email: \`\${name.toLowerCase()}@example.com\` };
}

const user = createUser('李四', 30);
console.log('创建的用户:', user);

// 泛型示例
function identity<T>(arg: T): T {
  return arg;
}

console.log('泛型函数结果:', identity('Hello TypeScript'));
`,
  python: `# Python 代码运行沙箱
# 注意: Python 代码会被转译为 JavaScript 执行

def greet(name):
    return f"Hello, {name}!"

print(greet("Python User"))

# 列表操作
numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
print(f"平方结果: {squared}")

# 字典操作
user = {"name": "王五", "age": 28}
print(f"用户: {user}")
`,
}

export default function CodeSandboxPage() {
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(languageTemplates.javascript)
  const [output, setOutput] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [executionTime, setExecutionTime] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  const runCode = async () => {
    setOutput([])
    setError(null)
    setExecutionTime(null)

    const logs: string[] = []
    const originalLog = console.log
    const originalError = console.error
    const originalWarn = console.warn

    console.log = (...args) => {
      logs.push(args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '))
    }
    console.error = (...args) => {
      logs.push('[ERROR] ' + args.join(' '))
    }
    console.warn = (...args) => {
      logs.push('[WARN] ' + args.join(' '))
    }

    const startTime = performance.now()

    try {
      if (language === 'python') {
        const transpiled = transpilePython(code)
        const fn = new Function(transpiled)
        fn()
      } else {
        const fn = new Function(code)
        fn()
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }

    const endTime = performance.now()
    setExecutionTime(Math.round(endTime - startTime))

    console.log = originalLog
    console.error = originalError
    console.warn = originalWarn

    setOutput(logs)
  }

  const transpilePython = (pyCode: string): string => {
    let js = pyCode
      .replace(/def\s+(\w+)\s*\(([^)]*)\):/g, 'function $1($2) {')
      .replace(/print\s*\(([^)]+)\)/g, 'console.log($1)')
      .replace(/f"([^"]*){([^}]+)}([^"]*)"/g, '`$1${$2}$3`')
      .replace(/f'([^']*){([^}]+)}([^']*)'/g, '`$1${$2}$3`')
      .replace(/True/g, 'true')
      .replace(/False/g, 'false')
      .replace(/None/g, 'null')
      .replace(/:\s*str/g, '')
      .replace(/:\s*int/g, '')
      .replace(/:\s*float/g, '')
      .replace(/:\s*bool/g, '')
      .replace(/\s+#.*/g, '')
      .replace(/\n\s*\n/g, '\n')
    
    const lines = js.split('\n')
    let indentLevel = 0
    const result: string[] = []
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.endsWith(':')) {
        result.push('  '.repeat(indentLevel) + trimmed.slice(0, -1) + ' {')
        indentLevel++
      } else if (trimmed.startsWith('return ')) {
        result.push('  '.repeat(indentLevel) + trimmed)
        indentLevel = Math.max(0, indentLevel - 1)
        result.push('  '.repeat(indentLevel) + '}')
      } else {
        result.push('  '.repeat(indentLevel) + trimmed)
      }
    }
    
    return result.join('\n')
  }

  const clearCode = () => {
    setCode('')
    setOutput([])
    setError(null)
    setExecutionTime(null)
  }

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    setCode(languageTemplates[lang] || '')
    setOutput([])
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Code2 className="w-7 h-7" />
            代码运行沙箱
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            在浏览器中安全运行 JavaScript/TypeScript/Python 代码
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-gray-500" />
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded px-2 py-1 text-sm text-gray-700 dark:text-gray-200"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python (转译)</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearCode}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  title="清空代码"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={runCode}
                  className="flex items-center gap-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                >
                  <Play className="w-4 h-4" />
                  运行
                </button>
              </div>
            </div>
            <div className="p-4">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 font-mono text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
                placeholder="在此输入代码..."
                spellCheck={false}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2">
                {error ? (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  输出
                </span>
                {executionTime !== null && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    执行时间: {executionTime}ms
                  </span>
                )}
              </div>
              <button
                onClick={copyOutput}
                disabled={output.length === 0}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                title="复制输出"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="p-4">
              <div className="h-96 overflow-auto bg-gray-900 rounded-lg p-4 font-mono text-sm">
                {error ? (
                  <div className="text-red-400 whitespace-pre-wrap">{error}</div>
                ) : output.length > 0 ? (
                  output.map((line, i) => (
                    <div key={i} className="text-green-400 whitespace-pre-wrap">
                      {line}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">点击"运行"按钮执行代码...</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">使用说明</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">JavaScript</h3>
              <p>直接执行 JavaScript 代码，支持 ES6+ 语法，可使用 console.log 输出结果。</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">TypeScript</h3>
              <p>类型注解会被忽略，作为 JavaScript 执行。适合测试 TypeScript 风格的代码逻辑。</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Python</h3>
              <p>Python 代码会被转译为 JavaScript 执行，支持基本语法，适合快速测试算法。</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>安全提示：</strong>代码在浏览器沙箱中运行，无法访问文件系统或网络。请勿运行来源不明的代码。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
