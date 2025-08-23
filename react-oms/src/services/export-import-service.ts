import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import * as Papa from 'papaparse'

/**
 * 数据导出导入服务
 * 提供CSV和Excel格式的数据导入导出功能
 */
export const ExportImportService = {
  /**
   * 导出数据为Excel文件
   * @param data 要导出的数据数组
   * @param fileName 文件名（不包含扩展名）
   * @param sheetName 工作表名称
   */
  exportToExcel: <T extends Record<string, any>>(
    data: T[],
    fileName: string = 'export',
    sheetName: string = 'Sheet1'
  ): void => {
    try {
      // 创建工作簿
      const workbook = XLSX.utils.book_new()
      
      // 创建工作表
      const worksheet = XLSX.utils.json_to_sheet(data)
      
      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
      
      // 生成Excel文件的二进制数据
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      
      // 创建Blob对象
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      
      // 保存文件
      saveAs(blob, `${fileName}.xlsx`)
    } catch (error) {
      console.error('导出Excel文件失败:', error)
      throw new Error('导出Excel文件失败')
    }
  },
  
  /**
   * 导出数据为CSV文件
   * @param data 要导出的数据数组
   * @param fileName 文件名（不包含扩展名）
   */
  exportToCSV: <T extends Record<string, any>>(
    data: T[],
    fileName: string = 'export'
  ): void => {
    try {
      // 使用PapaParse将数据转换为CSV格式
      const csv = Papa.unparse(data)
      
      // 创建Blob对象
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      
      // 保存文件
      saveAs(blob, `${fileName}.csv`)
    } catch (error) {
      console.error('导出CSV文件失败:', error)
      throw new Error('导出CSV文件失败')
    }
  },
  
  /**
   * 从Excel文件导入数据
   * @param file Excel文件
   * @returns 解析后的数据数组
   */
  importFromExcel: <T extends Record<string, any>>(
    file: File
  ): Promise<T[]> => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader()
        
        reader.onload = (e) => {
          try {
            const data = e.target?.result
            
            if (!data) {
              reject(new Error('读取文件失败'))
              return
            }
            
            // 解析Excel文件
            const workbook = XLSX.read(data, { type: 'binary' })
            
            // 获取第一个工作表
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            
            // 将工作表转换为JSON
            const jsonData = XLSX.utils.sheet_to_json<T>(worksheet)
            
            resolve(jsonData)
          } catch (error) {
            console.error('解析Excel文件失败:', error)
            reject(new Error('解析Excel文件失败'))
          }
        }
        
        reader.onerror = () => {
          reject(new Error('读取文件失败'))
        }
        
        // 读取文件内容
        reader.readAsBinaryString(file)
      } catch (error) {
        console.error('导入Excel文件失败:', error)
        reject(new Error('导入Excel文件失败'))
      }
    })
  },
  
  /**
   * 从CSV文件导入数据
   * @param file CSV文件
   * @returns 解析后的数据数组
   */
  importFromCSV: <T extends Record<string, any>>(
    file: File
  ): Promise<T[]> => {
    return new Promise((resolve, reject) => {
      try {
        Papa.parse(file, {
          header: true, // 将第一行作为标题
          skipEmptyLines: true, // 跳过空行
          complete: (results) => {
            resolve(results.data as T[])
          },
          error: (error) => {
            console.error('解析CSV文件失败:', error)
            reject(new Error('解析CSV文件失败'))
          }
        })
      } catch (error) {
        console.error('导入CSV文件失败:', error)
        reject(new Error('导入CSV文件失败'))
      }
    })
  },
  
  /**
   * 根据文件类型自动选择导入方法
   * @param file 要导入的文件
   * @returns 解析后的数据数组
   */
  importFromFile: <T extends Record<string, any>>(
    file: File
  ): Promise<T[]> => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      return ExportImportService.importFromExcel<T>(file)
    } else if (fileExtension === 'csv') {
      return ExportImportService.importFromCSV<T>(file)
    } else {
      return Promise.reject(new Error('不支持的文件格式，请上传.xlsx、.xls或.csv文件'))
    }
  }
}

export default ExportImportService