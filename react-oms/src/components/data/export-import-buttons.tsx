import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PermissionGuard } from '@/components/auth/permission-guard'
import ExportImportService from '@/services/export-import-service'
import { Download, Upload, FileSpreadsheet, FileText, AlertCircle } from 'lucide-react'

interface ExportImportButtonsProps<T> {
  data: T[]
  onImport?: (data: T[]) => void
  exportFileName?: string
  exportPermission?: string
  importPermission?: string
  module: string
}

/**
 * 导出导入按钮组件
 * 提供数据导出为Excel/CSV和从Excel/CSV导入数据的功能
 */
export function ExportImportButtons<T extends Record<string, any>>({
  data,
  onImport,
  exportFileName = 'export',
  exportPermission = 'data:export',
  importPermission = 'data:import',
  module
}: ExportImportButtonsProps<T>) {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<'excel' | 'csv'>('excel')
  const [fileName, setFileName] = useState(exportFileName)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState<boolean>(false)

  // 处理导出
  const handleExport = () => {
    try {
      if (exportFormat === 'excel') {
        ExportImportService.exportToExcel(data, fileName, module)
      } else {
        ExportImportService.exportToCSV(data, fileName)
      }
      setIsExportDialogOpen(false)
    } catch (error) {
      console.error('导出失败:', error)
    }
  }

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0])
      setImportError(null)
      setImportSuccess(false)
    }
  }

  // 处理导入
  const handleImport = async () => {
    if (!importFile || !onImport) return

    try {
      setImportError(null)
      setImportSuccess(false)

      const importedData = await ExportImportService.importFromFile<T>(importFile)
      
      if (importedData.length === 0) {
        setImportError('导入的文件不包含任何数据')
        return
      }

      onImport(importedData)
      setImportSuccess(true)
      
      // 3秒后关闭对话框
      setTimeout(() => {
        setIsImportDialogOpen(false)
        setImportFile(null)
        setImportSuccess(false)
      }, 3000)
    } catch (error) {
      setImportError((error as Error).message || '导入失败')
    }
  }

  return (
    <div className="flex space-x-2">
      {/* 导出按钮 */}
      <PermissionGuard permission={exportPermission}>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center"
          onClick={() => setIsExportDialogOpen(true)}
        >
          <Download className="mr-2 h-4 w-4" />
          导出
        </Button>

        {/* 导出对话框 */}
        <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>导出数据</DialogTitle>
              <DialogDescription>
                选择导出格式并设置文件名
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="exportFormat" className="text-right">
                  导出格式
                </Label>
                <Select
                  value={exportFormat}
                  onValueChange={(value) => setExportFormat(value as 'excel' | 'csv')}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择导出格式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excel">
                      <div className="flex items-center">
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Excel (.xlsx)
                      </div>
                    </SelectItem>
                    <SelectItem value="csv">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        CSV (.csv)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fileName" className="text-right">
                  文件名
                </Label>
                <Input
                  id="fileName"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleExport}>导出</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PermissionGuard>

      {/* 导入按钮 */}
      {onImport && (
        <PermissionGuard permission={importPermission}>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={() => setIsImportDialogOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            导入
          </Button>

          {/* 导入对话框 */}
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>导入数据</DialogTitle>
                <DialogDescription>
                  选择Excel或CSV文件进行导入
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="importFile" className="text-right">
                    选择文件
                  </Label>
                  <Input
                    id="importFile"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="col-span-3"
                  />
                </div>
                {importError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{importError}</AlertDescription>
                  </Alert>
                )}
                {importSuccess && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <AlertDescription>数据导入成功！</AlertDescription>
                  </Alert>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleImport} disabled={!importFile}>
                  导入
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PermissionGuard>
      )}
    </div>
  )
}

export default ExportImportButtons