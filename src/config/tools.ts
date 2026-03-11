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
    id: 'ascii-converter',
    name: 'ASCII / 字符',
    description: 'ASCII 码与字符相互转换，包含常用 ASCII 字符表',
    category: { id: 'convert', name: '进制转换与位操作', icon: 'arrows-right-left' },
    icon: 'type',
    path: '/ascii-converter',
    keywords: ['ASCII', '字符', '转换', '字符码', 'character']
  },
  {
    id: 'crc-calculator',
    name: 'CRC 计算',
    description: '支持多种 CRC 算法的校验和计算工具',
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
    id: 'color-picker',
    name: '颜色选择器',
    description: '颜色选择和转换工具，支持 HEX、RGB、HSL 格式',
    category: { id: 'design', name: '设计工具', icon: 'palette' },
    icon: 'palette',
    path: '/color-picker',
    keywords: ['颜色', '选择器', 'HEX', 'RGB', 'HSL']
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
