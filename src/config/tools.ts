import type { ToolMeta } from '@/types'

export const tools: ToolMeta[] = [
  {
    id: 'pcb-via-current',
    name: 'PCB 过孔电流计算器',
    description: '基于 IPC-2152 标准，计算过孔最大电流、电阻、压降等参数',
    category: { id: 'pcb', name: '硬件/PCB', icon: 'cpu' },
    icon: 'circuit-board',
    path: '/pcb-via-current',
    keywords: ['PCB', '过孔', '电流', 'IPC-2152', 'via', 'current']
  },
  {
    id: 'pcb-trace-width',
    name: 'PCB 走线宽度计算器',
    description: '基于 IPC-2152 标准，根据电流计算所需走线宽度',
    category: { id: 'pcb', name: '硬件/PCB', icon: 'cpu' },
    icon: 'circuit-board',
    path: '/pcb-trace-width',
    keywords: ['PCB', '走线', '宽度', '电流', 'IPC-2152', 'trace']
  },
  {
    id: 'binary-viewer',
    name: '二进制文件查看器',
    description: '在线查看二进制文件，十六进制和 ASCII 视图，支持大文件虚拟滚动',
    category: { id: 'pcb', name: '硬件/PCB', icon: 'cpu' },
    icon: 'file-binary',
    path: '/binary-viewer',
    keywords: ['二进制', '十六进制', 'hex', '文件查看器']
  },
  {
    id: 'battery-life',
    name: '电池续航计算器',
    description: '计算电池使用寿命，支持恒定功耗和间歇性功耗两种模式',
    category: { id: 'pcb', name: '硬件/PCB', icon: 'cpu' },
    icon: 'battery',
    path: '/battery-life',
    keywords: ['电池', '续航', '功耗', '电池寿命']
  },
  {
    id: 'led-resistor',
    name: 'LED 限流电阻计算器',
    description: '计算 LED 限流电阻值，支持串并联配置，E24 标准电阻推荐',
    category: { id: 'pcb', name: '硬件/PCB', icon: 'cpu' },
    icon: 'lightbulb',
    path: '/led-resistor',
    keywords: ['LED', '限流电阻', '串联', '并联', 'E24']
  },
  {
    id: 'resistor-color-code',
    name: '电阻色环阻值计算器',
    description: '支持 4/5/6 环电阻的色环阻值、容差及温度系数计算',
    category: { id: 'pcb', name: '硬件/PCB', icon: 'cpu' },
    icon: 'resistor',
    path: '/resistor-color-code',
    keywords: ['电阻', '色环', '阻值', '容差', 'resistor', 'color code']
  },
  {
    id: 'smd-resistor',
    name: 'SMD 电阻丝印助手',
    description: '解析三位、四位及 EIA-96 编码的贴片电阻丝印代码',
    category: { id: 'pcb', name: '硬件/PCB', icon: 'cpu' },
    icon: 'resistor',
    path: '/smd-resistor',
    keywords: ['SMD', '电阻', '丝印', 'EIA-96', '贴片电阻']
  },
  {
    id: 'rc-rl-filter',
    name: 'RC/RL 滤波器计算器',
    description: '低通与高通滤波器计算，支持 RC 和 RL 电路模式，实时幅频响应曲线',
    category: { id: 'pcb', name: '硬件/PCB', icon: 'cpu' },
    icon: 'filter',
    path: '/rc-rl-filter',
    keywords: ['滤波器', 'RC', 'RL', '低通', '高通', '截止频率']
  },
  {
    id: 'esp32-flash',
    name: 'ESP32 在线烧录',
    description: '乐鑫官方 Web Flash 工具，在线烧录固件到 ESP32 系列芯片',
    category: { id: 'embedded', name: '嵌入式开发', icon: 'microchip' },
    icon: 'cpu',
    path: '/esp32-flash',
    keywords: ['ESP32', '烧录', '固件', 'flash', '乐鑫']
  },
  {
    id: 'simulator',
    name: '电路在线仿真',
    description: '在线电路仿真工具，支持 Arduino、ESP32、STM32 等多种开发板',
    category: { id: 'embedded', name: '嵌入式开发', icon: 'microchip' },
    icon: 'zap',
    path: '/simulator',
    keywords: ['仿真', 'Arduino', 'ESP32', 'STM32', 'Wokwi']
  },
  {
    id: 'web-serial',
    name: 'Web 串口助手',
    description: '在线串口调试工具，支持 Web Serial API，可直接与串口设备通信',
    category: { id: 'serial', name: '串口/网络调试', icon: 'terminal' },
    icon: 'terminal',
    path: '/web-serial',
    keywords: ['串口', 'UART', 'Web Serial', '调试', 'serial']
  },
  {
    id: 'http-client',
    name: 'HTTP 请求构造器',
    description: '构造和发送 HTTP 请求，支持 GET/POST/PUT/DELETE 等方法',
    category: { id: 'serial', name: '串口/网络调试', icon: 'terminal' },
    icon: 'globe',
    path: '/http-client',
    keywords: ['HTTP', '请求', 'API', 'REST', '调试']
  },
  {
    id: 'websocket-tester',
    name: 'WebSocket 测试',
    description: 'WebSocket 连接测试工具，支持消息收发和实时通信',
    category: { id: 'serial', name: '串口/网络调试', icon: 'terminal' },
    icon: 'radio',
    path: '/websocket-tester',
    keywords: ['WebSocket', 'WS', '实时通信', '测试']
  },
  {
    id: 'ascii-converter',
    name: 'ASCII / 字符',
    description: 'ASCII 码与字符相互转换，包含常用 ASCII 字符表',
    category: { id: 'convert', name: '进制转换与位操作', icon: 'arrows-right-left' },
    icon: 'type',
    path: '/ascii-converter',
    keywords: ['ASCII', '字符', '转换', '字符码', 'character']
  },
  {
    id: 'number-converter',
    name: '进制转换器',
    description: '二进制、八进制、十进制、十六进制相互转换',
    category: { id: 'convert', name: '进制转换与位操作', icon: 'arrows-right-left' },
    icon: 'binary',
    path: '/number-converter',
    keywords: ['进制', '二进制', '八进制', '十六进制', '转换']
  },
  {
    id: 'unit-converter',
    name: '单位转换器',
    description: '长度、重量、温度、面积、体积、速度、数据存储等常用单位转换',
    category: { id: 'convert', name: '进制转换与位操作', icon: 'arrows-right-left' },
    icon: 'ruler',
    path: '/unit-converter',
    keywords: ['单位', '转换', '长度', '重量', '温度']
  },
  {
    id: 'crc-calculator',
    name: 'CRC 计算',
    description: '支持 32 种标准 CRC 算法的校验和计算工具',
    category: { id: 'crc', name: 'CRC/校验计算', icon: 'shield-check' },
    icon: 'shield-check',
    path: '/crc-calculator',
    keywords: ['CRC', '校验', 'checksum', '循环冗余校验']
  },
  {
    id: 'hash-calculator',
    name: 'Hash / MD5 / SHA',
    description: '支持 MD5、SHA-1、SHA-256、SHA-384、SHA-512 等哈希算法',
    category: { id: 'crc', name: 'CRC/校验计算', icon: 'shield-check' },
    icon: 'lock',
    path: '/hash-calculator',
    keywords: ['Hash', 'MD5', 'SHA', '哈希', '加密']
  },
  {
    id: 'base64',
    name: 'Base64 编解码',
    description: 'Base64 编码和解码工具，支持文本和文件',
    category: { id: 'crc', name: 'CRC/校验计算', icon: 'shield-check' },
    icon: 'arrow-right-left',
    path: '/base64',
    keywords: ['Base64', '编码', '解码', 'encode', 'decode']
  },
  {
    id: 'url-encoder',
    name: 'URL 编解码',
    description: 'URL 编码和解码工具，支持特殊字符转换',
    category: { id: 'crc', name: 'CRC/校验计算', icon: 'shield-check' },
    icon: 'link',
    path: '/url-encoder',
    keywords: ['URL', '编码', '解码', 'encodeURIComponent']
  },
  {
    id: 'uuid-generator',
    name: 'UUID 生成器',
    description: '批量生成 UUID/GUID，支持 v1 和 v4 版本',
    category: { id: 'crc', name: 'CRC/校验计算', icon: 'shield-check' },
    icon: 'fingerprint',
    path: '/uuid-generator',
    keywords: ['UUID', 'GUID', '唯一标识符', '生成器']
  },
  {
    id: 'jwt-decoder',
    name: 'JWT 解码器',
    description: '解析和验证 JWT Token，显示 Header、Payload 和签名',
    category: { id: 'crc', name: 'CRC/校验计算', icon: 'shield-check' },
    icon: 'key-round',
    path: '/jwt-decoder',
    keywords: ['JWT', 'Token', '解码', '验证']
  },
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: 'JSON 美化、压缩和校验工具，支持语法错误检测',
    category: { id: 'dev', name: '开发工具', icon: 'code' },
    icon: 'braces',
    path: '/json-formatter',
    keywords: ['JSON', '格式化', '美化', '压缩', '校验']
  },
  {
    id: 'regex-tester',
    name: '正则表达式测试',
    description: '实时正则表达式匹配测试工具，支持多种模式',
    category: { id: 'dev', name: '开发工具', icon: 'code' },
    icon: 'regex',
    path: '/regex-tester',
    keywords: ['正则', '正则表达式', 'regex', '匹配', '测试']
  },
  {
    id: 'timestamp-converter',
    name: '时间戳转换',
    description: 'Unix 时间戳与日期时间相互转换，实时显示当前时间戳',
    category: { id: 'dev', name: '开发工具', icon: 'code' },
    icon: 'clock',
    path: '/timestamp-converter',
    keywords: ['时间戳', 'timestamp', '日期', '时间', 'Unix']
  },
  {
    id: 'ai-chat',
    name: 'AI 聊天助手',
    description: '智能 AI 对话助手，支持 OpenAI 兼容 API，可配置自定义接口',
    category: { id: 'dev', name: '开发工具', icon: 'code' },
    icon: 'sparkles',
    path: '/ai-chat',
    keywords: ['AI', '聊天', 'ChatGPT', 'GPT', '对话']
  },
  {
    id: 'code-diff',
    name: '代码对比',
    description: '文本和代码差异对比工具，使用 LCS 算法精确对比',
    category: { id: 'dev', name: '开发工具', icon: 'code' },
    icon: 'file-diff',
    path: '/code-diff',
    keywords: ['代码对比', 'diff', '差异', '文本对比']
  },
  {
    id: 'text-diff',
    name: '文本差异对比',
    description: '字符级和单词级文本差异高亮对比工具',
    category: { id: 'dev', name: '开发工具', icon: 'code' },
    icon: 'text-cursor',
    path: '/text-diff',
    keywords: ['文本差异', 'diff', '字符对比', '高亮']
  },
  {
    id: 'password-generator',
    name: '密码生成器',
    description: '安全随机密码生成工具，支持自定义长度和字符类型',
    category: { id: 'dev', name: '开发工具', icon: 'code' },
    icon: 'key',
    path: '/password-generator',
    keywords: ['密码', '生成器', '随机', '安全']
  },
  {
    id: 'snippets',
    name: '代码片段管理',
    description: '保存和管理常用代码片段，支持多语言和标签',
    category: { id: 'dev', name: '开发工具', icon: 'code' },
    icon: 'code-2',
    path: '/snippets',
    keywords: ['代码片段', 'snippet', '收藏', '管理']
  },
  {
    id: 'markdown-preview',
    name: 'Markdown 预览',
    description: '实时 Markdown 渲染预览，支持常用语法',
    category: { id: 'dev', name: '开发工具', icon: 'code' },
    icon: 'file-text',
    path: '/markdown-preview',
    keywords: ['Markdown', '预览', '渲染', '编辑器']
  },
  {
    id: 'sql-formatter',
    name: 'SQL 格式化',
    description: 'SQL 语句美化和格式化，关键字自动大写',
    category: { id: 'dev', name: '开发工具', icon: 'code' },
    icon: 'database',
    path: '/sql-formatter',
    keywords: ['SQL', '格式化', '美化', '数据库']
  },
  {
    id: 'html-formatter',
    name: 'HTML 格式化',
    description: 'HTML 代码美化和格式化，自动处理缩进',
    category: { id: 'dev', name: '开发工具', icon: 'code' },
    icon: 'code',
    path: '/html-formatter',
    keywords: ['HTML', '格式化', '美化', '网页']
  },
  {
    id: 'yaml-formatter',
    name: 'YAML 格式化',
    description: 'YAML 配置文件美化和校验',
    category: { id: 'dev', name: '开发工具', icon: 'code' },
    icon: 'file-code',
    path: '/yaml-formatter',
    keywords: ['YAML', '格式化', '配置', '校验']
  },
  {
    id: 'cron-generator',
    name: 'Cron 表达式生成器',
    description: '可视化生成 Cron 表达式，显示下次执行时间',
    category: { id: 'dev', name: '开发工具', icon: 'code' },
    icon: 'clock',
    path: '/cron-generator',
    keywords: ['Cron', '定时任务', '表达式', '生成器']
  },
  {
    id: 'git-cheatsheet',
    name: 'Git 命令速查',
    description: '常用 Git 命令速查表，支持搜索和一键复制',
    category: { id: 'dev', name: '开发工具', icon: 'code' },
    icon: 'git-branch',
    path: '/git-cheatsheet',
    keywords: ['Git', '命令', '速查', 'cheatsheet']
  },
  {
    id: 'random-data',
    name: '随机数据生成',
    description: '生成测试数据，支持姓名、邮箱、手机号、地址等',
    category: { id: 'dev', name: '开发工具', icon: 'code' },
    icon: 'shuffle',
    path: '/random-data',
    keywords: ['随机', '测试数据', '生成器', 'mock']
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum 生成',
    description: '生成占位文本，支持拉丁文和中文',
    category: { id: 'dev', name: '开发工具', icon: 'code' },
    icon: 'type',
    path: '/lorem-ipsum',
    keywords: ['Lorem', '占位文本', '生成器', '中文']
  },
  {
    id: 'color-picker',
    name: '颜色选择器',
    description: '颜色选择和转换工具，支持 HEX、RGB、HSL 格式',
    category: { id: 'design', name: '设计工具', icon: 'palette' },
    icon: 'palette',
    path: '/color-picker',
    keywords: ['颜色', '选择器', 'HEX', 'RGB', 'HSL']
  },
  {
    id: 'color-contrast',
    name: '颜色对比度检测',
    description: '根据 WCAG 标准检测颜色对比度是否满足无障碍要求',
    category: { id: 'design', name: '设计工具', icon: 'palette' },
    icon: 'contrast',
    path: '/color-contrast',
    keywords: ['颜色', '对比度', 'WCAG', '无障碍']
  },
  {
    id: 'qr-generator',
    name: '二维码生成器',
    description: '生成自定义二维码，支持文本、网址、WiFi 等内容',
    category: { id: 'design', name: '设计工具', icon: 'palette' },
    icon: 'qr-code',
    path: '/qr-generator',
    keywords: ['二维码', 'QR', '生成器', '扫码']
  },
  {
    id: 'image-base64',
    name: '图片 Base64 转换',
    description: '图片与 Base64 编码相互转换，支持粘贴和下载',
    category: { id: 'design', name: '设计工具', icon: 'palette' },
    icon: 'image',
    path: '/image-base64',
    keywords: ['图片', 'Base64', '转换', '编码']
  },
  {
    id: 'image-compressor',
    name: '图片压缩',
    description: '在浏览器本地压缩图片，支持自定义质量',
    category: { id: 'design', name: '设计工具', icon: 'palette' },
    icon: 'image-down',
    path: '/image-compressor',
    keywords: ['图片', '压缩', '优化', '减小体积']
  },
  {
    id: 'datasheet',
    name: '芯片手册查询',
    description: '电子元器件 datasheet 数据手册查询下载，支持数百万种芯片规格书',
    category: { id: 'more', name: '更多工具', icon: 'book-open' },
    icon: 'book-open',
    path: '/datasheet',
    keywords: ['datasheet', '数据手册', '芯片', '规格书']
  },
  {
    id: 'code-sandbox',
    name: '代码运行沙箱',
    description: '在浏览器中安全运行 JavaScript/TypeScript/Python 代码',
    category: { id: 'dev', name: '开发工具', icon: 'code' },
    icon: 'terminal',
    path: '/code-sandbox',
    keywords: ['代码', '运行', '沙箱', 'JavaScript', 'Python']
  },
  {
    id: 'api-mock',
    name: 'API Mock 服务器',
    description: '创建模拟 API 端点，用于前端开发和测试',
    category: { id: 'serial', name: '串口/网络调试', icon: 'terminal' },
    icon: 'server',
    path: '/api-mock',
    keywords: ['API', 'Mock', '模拟', '测试', '端点']
  },
  {
    id: 'pdf-tools',
    name: 'PDF 工具套件',
    description: 'PDF 合并、拆分、压缩，PDF 转图片',
    category: { id: 'design', name: '设计工具', icon: 'palette' },
    icon: 'file-text',
    path: '/pdf-tools',
    keywords: ['PDF', '合并', '拆分', '压缩', '转图片']
  },
  {
    id: 'image-processor',
    name: '图片处理工具',
    description: '图片裁剪、旋转、翻转、调整亮度/对比度/饱和度',
    category: { id: 'design', name: '设计工具', icon: 'palette' },
    icon: 'image',
    path: '/image-processor',
    keywords: ['图片', '裁剪', '旋转', '调整', '处理']
  },
  {
    id: 'regex-visualizer',
    name: '正则表达式可视化',
    description: '图形化解析正则表达式，帮助理解复杂模式',
    category: { id: 'dev', name: '开发工具', icon: 'code' },
    icon: 'regex',
    path: '/regex-visualizer',
    keywords: ['正则', '可视化', '解析', '图形']
  },
  {
    id: 'json-schema',
    name: 'JSON Schema 生成器',
    description: '从 JSON 数据自动生成 JSON Schema',
    category: { id: 'dev', name: '开发工具', icon: 'code' },
    icon: 'braces',
    path: '/json-schema',
    keywords: ['JSON', 'Schema', '生成器', '校验']
  },
  {
    id: 'encryption',
    name: '加密解密工具',
    description: 'AES 加密解密，支持自定义密钥',
    category: { id: 'crc', name: 'CRC/校验计算', icon: 'shield-check' },
    icon: 'lock',
    path: '/encryption',
    keywords: ['加密', '解密', 'AES', '密钥', '安全']
  },
  {
    id: 'code-converter',
    name: '代码转换器',
    description: 'JSON/YAML/CSV/TypeScript/JavaScript 格式互转',
    category: { id: 'dev', name: '开发工具', icon: 'code' },
    icon: 'arrow-right-left',
    path: '/code-converter',
    keywords: ['转换', 'JSON', 'YAML', 'CSV', 'TypeScript']
  },
]

export const toolsByCategory = tools.reduce((acc, tool) => {
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
