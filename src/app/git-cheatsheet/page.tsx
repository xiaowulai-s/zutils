'use client'

import { useState } from 'react'
import { ToolShell } from '@/components/tools'
import { GitBranch, Copy, Check, Search } from 'lucide-react'

interface GitCommand {
  category: string
  name: string
  command: string
  description: string
}

const gitCommands: GitCommand[] = [
  { category: '基础', name: '初始化仓库', command: 'git init', description: '在当前目录创建新的 Git 仓库' },
  { category: '基础', name: '克隆仓库', command: 'git clone <url>', description: '克隆远程仓库到本地' },
  { category: '基础', name: '配置用户名', command: 'git config --global user.name "name"', description: '设置全局用户名' },
  { category: '基础', name: '配置邮箱', command: 'git config --global user.email "email"', description: '设置全局邮箱' },
  
  { category: '分支', name: '查看分支', command: 'git branch', description: '列出所有本地分支' },
  { category: '分支', name: '创建分支', command: 'git branch <branch-name>', description: '创建新分支' },
  { category: '分支', name: '切换分支', command: 'git checkout <branch-name>', description: '切换到指定分支' },
  { category: '分支', name: '创建并切换', command: 'git checkout -b <branch-name>', description: '创建并切换到新分支' },
  { category: '分支', name: '合并分支', command: 'git merge <branch-name>', description: '合并指定分支到当前分支' },
  { category: '分支', name: '删除分支', command: 'git branch -d <branch-name>', description: '删除已合并的分支' },
  { category: '分支', name: '强制删除', command: 'git branch -D <branch-name>', description: '强制删除分支' },
  
  { category: '暂存', name: '查看状态', command: 'git status', description: '查看工作区和暂存区状态' },
  { category: '暂存', name: '添加文件', command: 'git add <file>', description: '添加文件到暂存区' },
  { category: '暂存', name: '添加全部', command: 'git add .', description: '添加所有修改到暂存区' },
  { category: '暂存', name: '取消暂存', command: 'git reset <file>', description: '取消文件暂存' },
  { category: '暂存', name: '暂存修改', command: 'git stash', description: '暂存当前修改' },
  { category: '暂存', name: '恢复暂存', command: 'git stash pop', description: '恢复最近暂存的修改' },
  
  { category: '提交', name: '提交', command: 'git commit -m "message"', description: '提交暂存区的修改' },
  { category: '提交', name: '追加提交', command: 'git commit --amend', description: '修改最近一次提交' },
  { category: '提交', name: '查看日志', command: 'git log', description: '查看提交历史' },
  { category: '提交', name: '简洁日志', command: 'git log --oneline', description: '单行显示提交历史' },
  
  { category: '远程', name: '查看远程', command: 'git remote -v', description: '查看远程仓库信息' },
  { category: '远程', name: '添加远程', command: 'git remote add origin <url>', description: '添加远程仓库' },
  { category: '远程', name: '拉取更新', command: 'git pull origin <branch>', description: '拉取远程分支更新' },
  { category: '远程', name: '推送分支', command: 'git push origin <branch>', description: '推送本地分支到远程' },
  { category: '远程', name: '推送新分支', command: 'git push -u origin <branch>', description: '推送并设置上游分支' },
  { category: '远程', name: '删除远程分支', command: 'git push origin --delete <branch>', description: '删除远程分支' },
  
  { category: '撤销', name: '撤销修改', command: 'git checkout -- <file>', description: '撤销工作区修改' },
  { category: '撤销', name: '撤销提交', command: 'git reset --soft HEAD~1', description: '撤销最近一次提交，保留修改' },
  { category: '撤销', name: '回退版本', command: 'git reset --hard <commit>', description: '回退到指定版本' },
  { category: '撤销', name: '撤销已推送', command: 'git revert <commit>', description: '创建新提交来撤销指定提交' },
  
  { category: '其他', name: '查看差异', command: 'git diff', description: '查看工作区与暂存区的差异' },
  { category: '其他', name: '查看文件差异', command: 'git diff <file>', description: '查看指定文件的差异' },
  { category: '其他', name: '标签', command: 'git tag <tag-name>', description: '创建标签' },
  { category: '其他', name: '推送标签', command: 'git push --tags', description: '推送所有标签到远程' },
]

export default function GitCheatSheetPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

  const categories = [...new Set(gitCommands.map(c => c.category))]

  const filteredCommands = searchQuery
    ? gitCommands.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : gitCommands

  const copyCommand = async (command: string) => {
    await navigator.clipboard.writeText(command)
    setCopiedCommand(command)
    setTimeout(() => setCopiedCommand(null), 2000)
  }

  return (
    <ToolShell title="Git 命令速查" icon={<GitBranch className="w-5 h-5" />}>
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索命令..."
            className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
          />
        </div>

        {categories.map(category => {
          const commands = filteredCommands.filter(c => c.category === category)
          if (commands.length === 0) return null

          return (
            <div key={category} className="border rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b">
                <span className="font-medium">{category}</span>
              </div>
              <div className="divide-y">
                {commands.map((cmd, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{cmd.name}</div>
                        <code className="inline-block mt-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                          {cmd.command}
                        </code>
                        <p className="text-sm text-gray-500 mt-1">{cmd.description}</p>
                      </div>
                      <button
                        onClick={() => copyCommand(cmd.command)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        {copiedCommand === cmd.command ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p><strong>Git 命令速查表</strong> 收录了常用的 Git 命令，点击复制按钮即可快速复制命令。</p>
        </div>
      </div>
    </ToolShell>
  )
}
