import { saveAs } from 'file-saver'

// 工具服务
export const UtilsService = {
  // 导出数据为CSV
  exportToCSV: (data: any[], filename: string) => {
    // 将对象数组转换为CSV格式
    const replacer = (key: string, value: any) => value === null ? '' : value
    const header = Object.keys(data[0])
    let csv = data.map(row => header.map(fieldName => 
      JSON.stringify(row[fieldName], replacer)).join(','))
    csv.unshift(header.join(','))
    const csvArray = csv.join('\r\n')

    // 创建Blob并下载
    const blob = new Blob([csvArray], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, `${filename}.csv`)
  },

  // 导出数据为Excel
  exportToExcel: async (data: any[], filename: string) => {
    try {
      // 动态导入xlsx库
      const XLSX = await import('xlsx')
      
      // 创建工作簿和工作表
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
      
      // 生成Excel文件并下载
      XLSX.writeFile(workbook, `${filename}.xlsx`)
    } catch (error) {
      console.error('导出Excel失败:', error)
      throw new Error('导出Excel失败')
    }
  },

  // 格式化日期
  formatDate: (date: Date | string, format: string = 'YYYY-MM-DD'): string => {
    const d = new Date(date)
    
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')
    
    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds)
  },

  // 格式化金额
  formatCurrency: (amount: number, currency: string = '¥'): string => {
    return `${currency}${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
  },

  // 生成唯一ID
  generateUniqueId: (prefix: string = ''): string => {
    const timestamp = new Date().getTime()
    const randomStr = Math.random().toString(36).substring(2, 10)
    return `${prefix}${timestamp}-${randomStr}`
  },

  // 深拷贝对象
  deepClone: <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj))
  },

  // 防抖函数
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout> | null = null
    
    return function(...args: Parameters<T>) {
      const later = () => {
        timeout = null
        func(...args)
      }
      
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  // 节流函数
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean = false
    
    return function(...args: Parameters<T>) {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => {
          inThrottle = false
        }, limit)
      }
    }
  }
}

export default UtilsService