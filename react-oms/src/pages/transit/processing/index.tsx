import React, { useState, useEffect } from "react";
import {
  Download, 
  Plus, 
  Search,
  Calendar,
  Edit,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SmartPagination } from "@/components/ui/smart-pagination";
import { mockTransitItems } from "@/data/mock/transit-items";
import { mockTransitAreas } from "@/data/mock/transit-areas";
import { mockRecipientInfoList } from "@/data/mock/recipient-info";
import "../../../styles/common-layout.css";
import "../../../styles/scrollbar-hide.css";
import { 
  EditableCombobox, 
  EditableDimensions, 
  EditableRecipientInfo, 
  EditableCurrencyAmount,
  ComboboxOption 
} from "@/components/ui/combobox";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { ScrollableTabs, ScrollableTabsList, ScrollableTabsTrigger, ScrollableTabsContent } from "@/components/ui/scrollable-tabs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { NewTransitItemForm as TransitItemForm } from "@/components/transit/new-transit-item-form";
import { TransitItem, NewTransitItemForm as TransitFormData, TransitArea } from "@/types/transit";

// 货币符号映射
const currencySymbols: Record<string, string> = {
  'RMB': '¥',
  'HKD': 'HK$',
  'MOP': 'MOP$'
};

// 客户选项
const customerOptions: ComboboxOption[] = [
  { value: "上海电子有限公司", label: "上海电子有限公司" },
  { value: "北京科技集团", label: "北京科技集团" },
  { value: "广州贸易有限公司", label: "广州贸易有限公司" },
  { value: "深圳电子科技", label: "深圳电子科技" },
  { value: "杭州网络科技", label: "杭州网络科技" },
  { value: "成都信息技术", label: "成都信息技术" },
  { value: "武汉医疗设备", label: "武汉医疗设备" },
  { value: "南京美容用品", label: "南京美容用品" },
];

// 货品策略选项
const productStrategyOptions: ComboboxOption[] = [
  { value: "标准派送", label: "标准派送" },
  { value: "加急派送", label: "加急派送" },
  { value: "冷链配送", label: "冷链配送" },
  { value: "大件配送", label: "大件配送" },
  { value: "特殊处理", label: "特殊处理" },
];

// 配送分区选项
const deliveryZoneOptions: ComboboxOption[] = [
  { value: "上海-浦东新区", label: "上海-浦东新区" },
  { value: "北京-海淀区", label: "北京-海淀区" },
  { value: "广州-天河区", label: "广州-天河区" },
  { value: "深圳-南山区", label: "深圳-南山区" },
  { value: "杭州-西湖区", label: "杭州-西湖区" },
  { value: "成都-武侯区", label: "成都-武侯区" },
  { value: "武汉-江汉区", label: "武汉-江汉区" },
  { value: "南京-鼓楼区", label: "南京-鼓楼区" },
];

// 收件人选项
const recipientOptions: ComboboxOption[] = mockRecipientInfoList.map(recipient => ({
  value: recipient.id,
  label: `${recipient.name} - ${recipient.phone}`,
  description: recipient.address
}));

// 货币选项
const currencyOptions = [
  { value: "RMB", label: "RMB", symbol: "¥" },
  { value: "HKD", label: "HKD", symbol: "HK$" },
  { value: "MOP", label: "MOP", symbol: "MOP$" },
];

// 中转处理页面组件
export default function TransitProcessingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState(mockTransitItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState("nanping-zhongao");
  const [currentFilter, setCurrentFilter] = useState({
    warehouseArea: "",
    customer: "",
    productStrategy: "",
    deliveryZone: "",
    dateRange: undefined as DateRange | undefined
  });
  
  // 处理区、问题件区、预报件区的数据统计
  const [processingAreaStats, setProcessingAreaStats] = useState({
    processing: 0,
    problem: 0,
    preReport: 0
  });
  
  // 当前选中的区域
  const [currentArea, setCurrentArea] = useState("processing");
  
  // 每页显示的项目数和页面大小选项
  const [pageSize, setPageSize] = useState(5);
  const pageSizeOptions = [5, 10, 20, 50];
  
  // 过滤和搜索逻辑
  useEffect(() => {
    let filteredItems = [...mockTransitItems];
    
    // 应用搜索
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        item.productName.toLowerCase().includes(term) ||
        item.externalOrderId.toLowerCase().includes(term) ||
        item.transferOrderId?.toLowerCase().includes(term) ||
        item.customer.toLowerCase().includes(term) ||
        item.recipientInfo?.name.toLowerCase().includes(term) ||
        item.recipientInfo?.address.toLowerCase().includes(term)
      );
    }
    
    // 应用筛选条件
    if (currentFilter.warehouseArea && currentFilter.warehouseArea !== "all") {
      filteredItems = filteredItems.filter(item => 
        item.warehouseArea.startsWith(currentFilter.warehouseArea)
      );
    }
    
    if (currentFilter.customer && currentFilter.customer !== "all") {
      filteredItems = filteredItems.filter(item => item.customer === currentFilter.customer);
    }
    
    if (currentFilter.productStrategy && currentFilter.productStrategy !== "all") {
      filteredItems = filteredItems.filter(item => item.productStrategy === currentFilter.productStrategy);
    }
    
    if (currentFilter.deliveryZone && currentFilter.deliveryZone !== "all") {
      filteredItems = filteredItems.filter(item => item.deliveryZone === currentFilter.deliveryZone);
    }
    
    // 应用日期范围筛选
    if (currentFilter.dateRange?.from) {
      const fromDate = new Date(currentFilter.dateRange.from);
      fromDate.setHours(0, 0, 0, 0);
      
      filteredItems = filteredItems.filter(item => {
        const itemDate = new Date(item.arrivalDate || item.createdAt);
        return itemDate >= fromDate;
      });
    }
    
    if (currentFilter.dateRange?.to) {
      const toDate = new Date(currentFilter.dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      
      filteredItems = filteredItems.filter(item => {
        const itemDate = new Date(item.arrivalDate || item.createdAt);
        return itemDate <= toDate;
      });
    }
    
    // 应用区域筛选
    let areaFilteredItems = [...filteredItems];
    if (currentArea === "processing") {
      areaFilteredItems = filteredItems.filter(item => item.status === "处理中");
    } else if (currentArea === "problem") {
      areaFilteredItems = filteredItems.filter(item => item.status === "待处理");
    } else if (currentArea === "preReport") {
      areaFilteredItems = filteredItems.filter(item => item.status === "已完成");
    }
    
    // 更新统计数据
    setProcessingAreaStats({
      processing: filteredItems.filter(item => item.status === "处理中").length,
      problem: filteredItems.filter(item => item.status === "待处理").length,
      preReport: filteredItems.filter(item => item.status === "已完成").length
    });
    
    setItems(areaFilteredItems);
    
    setItems(filteredItems);
    setCurrentPage(1); // 重置到第一页
  }, [searchTerm, currentFilter]);
  
  // 分页逻辑
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / pageSize);
  
  // 页面导航
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // 更新项目
  const updateItem = (id: string, updates: Partial<TransitItem>) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };
  
  // 添加新项目
  const addNewItem = (formData: TransitFormData) => {
    // 计算体积和体积重
    const volume = Number(formData.length) * Number(formData.width) * Number(formData.height);
    const volumeWeight = volume / 6000;
    
    // 创建新项目
    const newItem: TransitItem = {
      id: `ITEM-${String(items.length + 1).padStart(3, '0')}`,
      productName: formData.productName,
      externalOrderId: formData.externalOrderId,
      transferOrderId: formData.transferOrderId || undefined,
      length: Number(formData.length),
      width: Number(formData.width),
      height: Number(formData.height),
      weight: Number(formData.weight),
      volume: volume,
      volumeWeight: parseFloat(volumeWeight.toFixed(2)),
      quantity: Number(formData.quantity) || 1,
      warehouseArea: formData.warehouseArea,
      arrivalDate: formData.arrivalDate,
      customer: formData.customer,
      productStrategy: formData.productStrategy,
      deliveryZone: formData.deliveryZone,
      recipientInfo: formData.recipientName ? {
        name: formData.recipientName,
        phone: formData.recipientPhone || '',
        address: formData.recipientAddress || ''
      } : undefined,
      advancePayment: {
        amount: Number(formData.advancePaymentAmount) || 0,
        currency: formData.advancePaymentCurrency || 'RMB'
      },
      codAmount: {
        amount: Number(formData.codAmount) || 0,
        currency: formData.codCurrency || 'RMB'
      },
      checkAmount: {
        amount: Number(formData.checkAmount) || 0,
        currency: formData.checkCurrency || 'RMB'
      },
      estimatedCost: Number(formData.estimatedCost) || 0,
      createdAt: new Date().toISOString().split('T')[0],
      status: formData.status,
      arrivalTime: new Date().toISOString()
    };
    
    setItems(prevItems => [newItem, ...prevItems]);
  };
  
  // 格式化金额显示
  const formatCurrency = (amount: number | undefined, currency: string | undefined) => {
    if (amount === undefined || amount === 0) return '-';
    const symbol = currency ? currencySymbols[currency] || '' : '';
    return `${symbol}${amount.toFixed(2)}`;
  };

  return (
    <div className="page-container">
      {/* 企业级标准的选项卡 */}
      <div className="mb-4 relative">
        <ScrollableTabs defaultValue={currentTab} onValueChange={setCurrentTab}>
          <ScrollableTabsList className="px-8"> {/* 添加左右内边距，为箭头按钮留出空间 */}
            {mockTransitAreas.filter(area => area.isCommon).map(area => (
              <ScrollableTabsTrigger key={area.id} value={area.id} className="whitespace-nowrap min-w-[100px]">
                {area.name}
              </ScrollableTabsTrigger>
            ))}
          </ScrollableTabsList>
          
          <ScrollableTabsContent value={currentTab} className="mt-2">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* 搜索框 - 宽度适中 */}
              <div className="w-full md:w-64 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索单号/品名/客户..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* 日期范围选择器 */}
              <DateRangePicker
                dateRange={currentFilter.dateRange}
                onDateRangeChange={(range) => 
                  setCurrentFilter({...currentFilter, dateRange: range})
                }
              />
              
              {/* 平铺的筛选条件 */}
              <div className="flex flex-wrap gap-2 items-center">
                <Select 
                  value={currentFilter.warehouseArea || "all"} 
                  onValueChange={(value) => setCurrentFilter({...currentFilter, warehouseArea: value})}
                >
                  <SelectTrigger className="w-[130px] h-10">
                    <SelectValue placeholder="选择仓区" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部仓区</SelectItem>
                    <SelectItem value="A区">A区-电子产品</SelectItem>
                    <SelectItem value="B区">B区-日用品</SelectItem>
                    <SelectItem value="C区">C区-服装</SelectItem>
                    <SelectItem value="D区">D区-食品</SelectItem>
                    <SelectItem value="E区">E区-大件</SelectItem>
                    <SelectItem value="F区">F区-轻小件</SelectItem>
                    <SelectItem value="G区">G区-特殊物品</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={currentFilter.customer || "all"} 
                  onValueChange={(value) => setCurrentFilter({...currentFilter, customer: value})}
                >
                  <SelectTrigger className="w-[160px] h-10">
                    <SelectValue placeholder="选择客户" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部客户</SelectItem>
                    {customerOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select 
                  value={currentFilter.productStrategy || "all"} 
                  onValueChange={(value) => setCurrentFilter({...currentFilter, productStrategy: value})}
                >
                  <SelectTrigger className="w-[140px] h-10">
                    <SelectValue placeholder="货品策略" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部策略</SelectItem>
                    {productStrategyOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select 
                  value={currentFilter.deliveryZone || "all"} 
                  onValueChange={(value) => setCurrentFilter({...currentFilter, deliveryZone: value})}
                >
                  <SelectTrigger className="w-[140px] h-10">
                    <SelectValue placeholder="配送分区" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部分区</SelectItem>
                    {deliveryZoneOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex-grow"></div>
                
                <div className="flex gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button className="bg-black hover:bg-gray-800">
                        <Plus className="mr-2 h-4 w-4" />
                        新增货品
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>新增货品</SheetTitle>
                      </SheetHeader>
                      <TransitItemForm 
                        onSubmit={(data) => {
                          addNewItem(data);
                          // 关闭抽屉
                          const closeButton = document.querySelector('[data-state="open"] button.absolute.right-4.top-4') as HTMLButtonElement;
                          if (closeButton) closeButton.click();
                        }}
                        onCancel={() => {
                          // 关闭抽屉
                          const closeButton = document.querySelector('[data-state="open"] button.absolute.right-4.top-4') as HTMLButtonElement;
                          if (closeButton) closeButton.click();
                        }}
                      />
                    </SheetContent>
                  </Sheet>
                  
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    导出
                  </Button>
                </div>
              </div>
            </div>

            {/* 区域选项卡和分页组件在同一水平线上 */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex-grow">
                <Tabs value={currentArea} onValueChange={setCurrentArea}>
                  <TabsList>
                    <TabsTrigger value="processing">
                      处理区 <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{processingAreaStats.processing}</span>
                    </TabsTrigger>
                    <TabsTrigger value="problem">
                      问题件区 <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">{processingAreaStats.problem}</span>
                    </TabsTrigger>
                    <TabsTrigger value="preReport">
                      预报件区 <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">{processingAreaStats.preReport}</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="pagination-wrapper">
                <SmartPagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  pageSize={pageSize}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(1); // 重置到第一页
                  }}
                  pageSizeOptions={pageSizeOptions}
                  totalItems={items.length}
                />
              </div>
            </div>
            
            {/* 添加自定义样式，确保表格可以水平滚动 */}
            <style dangerouslySetInnerHTML={{__html: `
              .table-scroll-container {
                overflow-x: auto;
                width: 100%;
              }
              .table-content {
                min-width: 1400px; /* 确保表格有足够的最小宽度 */
              }
              .table-cell-nowrap {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .dimensions-cell {
                min-width: 180px;
                white-space: nowrap;
              }
              .amount-cell {
                min-width: 100px;
                white-space: nowrap;
              }
            `}} />
            
            <div className="table-scroll-container">
              <div className="table-content">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px] table-cell-nowrap">单号</TableHead>
                      <TableHead className="w-[120px] table-cell-nowrap">仓区/到库日期</TableHead>
                      <TableHead className="w-[120px]">品名</TableHead>
                      <TableHead className="w-[140px] table-cell-nowrap">开单客户</TableHead>
                      <TableHead className="w-[100px] table-cell-nowrap">货品策略</TableHead>
                      <TableHead className="w-[180px] dimensions-cell">尺寸/重量/件数</TableHead>
                      <TableHead className="w-[100px] table-cell-nowrap">配送分区</TableHead>
                      <TableHead className="w-[150px] table-cell-nowrap">收件信息</TableHead>
                      <TableHead className="w-[100px] amount-cell">垫付金额</TableHead>
                      <TableHead className="w-[100px] amount-cell">代收货款</TableHead>
                      <TableHead className="w-[100px] amount-cell">代收支票额</TableHead>
                      <TableHead className="w-[100px] amount-cell">预计费用</TableHead>
                      <TableHead className="w-[100px] table-cell-nowrap">创建日期</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.length > 0 ? (
                      currentItems.map((item) => (
                        <TableRow key={item.id}>
                          {/* 单号 */}
                          <TableCell className="table-cell-nowrap">
                            <div className="flex flex-col">
                              <span className="font-medium">外部: {item.externalOrderId}</span>
                              <span className="text-sm text-gray-500">转派: {item.transferOrderId || '-'}</span>
                            </div>
                          </TableCell>
                          
                          {/* 仓区/到库日期 */}
                          <TableCell className="table-cell-nowrap">
                            <div className="flex flex-col">
                              <span>{item.warehouseArea}</span>
                              <span className="text-sm text-gray-500 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {item.arrivalDate}
                              </span>
                            </div>
                          </TableCell>
                          
                          {/* 品名 */}
                          <TableCell className="max-w-[120px] truncate" title={item.productName}>
                            {item.productName}
                          </TableCell>
                          
                          {/* 开单客户 */}
                          <TableCell className="table-cell-nowrap">
                            <EditableCombobox
                              options={customerOptions}
                              value={item.customer}
                              onChange={(value) => updateItem(item.id, { customer: value })}
                              placeholder="选择客户"
                              emptyMessage="没有找到客户"
                              initialValue={item.customer}
                              onEdit={() => {}}
                              onSave={(value) => updateItem(item.id, { customer: value })}
                              onCancel={() => {}}
                            />
                          </TableCell>
                          
                          {/* 货品策略 */}
                          <TableCell className="table-cell-nowrap">
                            <EditableCombobox
                              options={productStrategyOptions}
                              value={item.productStrategy || ''}
                              onChange={(value) => updateItem(item.id, { productStrategy: value })}
                              placeholder="选择策略"
                              emptyMessage="没有找到策略"
                              initialValue={item.productStrategy || ''}
                              onEdit={() => {}}
                              onSave={(value) => updateItem(item.id, { productStrategy: value })}
                              onCancel={() => {}}
                            />
                          </TableCell>
                          
                          {/* 尺寸/重量/件数 */}
                          <TableCell className="dimensions-cell">
                            <EditableDimensions
                              length={item.length}
                              width={item.width}
                              height={item.height}
                              weight={item.weight}
                              volume={item.volume || 0}
                              volumeWeight={item.volumeWeight || 0}
                              quantity={item.quantity || 1}
                              onSave={(dimensions) => {
                                const volume = dimensions.length * dimensions.width * dimensions.height;
                                const volumeWeight = volume / 6000;
                                updateItem(item.id, {
                                  ...dimensions,
                                  volume,
                                  volumeWeight: parseFloat(volumeWeight.toFixed(2))
                                });
                              }}
                            />
                          </TableCell>
                          
                          {/* 配送分区 */}
                          <TableCell className="table-cell-nowrap">
                            <EditableCombobox
                              options={deliveryZoneOptions}
                              value={item.deliveryZone || ''}
                              onChange={(value) => updateItem(item.id, { deliveryZone: value })}
                              placeholder="选择分区"
                              emptyMessage="没有找到分区"
                              initialValue={item.deliveryZone || ''}
                              onEdit={() => {}}
                              onSave={(value) => updateItem(item.id, { deliveryZone: value })}
                              onCancel={() => {}}
                            />
                          </TableCell>
                          
                          {/* 收件信息 */}
                          <TableCell className="table-cell-nowrap">
                            {item.recipientInfo ? (
                              <EditableRecipientInfo
                                name={item.recipientInfo.name}
                                phone={item.recipientInfo.phone}
                                address={item.recipientInfo.address}
                                onSave={(info) => updateItem(item.id, { recipientInfo: info })}
                                recipientOptions={recipientOptions}
                              />
                            ) : (
                              <EditableRecipientInfo
                                name=""
                                phone=""
                                address=""
                                onSave={(info) => updateItem(item.id, { recipientInfo: info })}
                                recipientOptions={recipientOptions}
                              />
                            )}
                          </TableCell>
                          
                          {/* 垫付金额 */}
                          <TableCell className="amount-cell">
                            <EditableCurrencyAmount
                              amount={item.advancePayment?.amount || 0}
                              currency={item.advancePayment?.currency || 'RMB'}
                              onSave={(amount, currency) => updateItem(item.id, { 
                                advancePayment: { amount, currency: currency as 'RMB' | 'HKD' | 'MOP' } 
                              })}
                              currencies={currencyOptions}
                            />
                          </TableCell>
                          
                          {/* 代收货款 */}
                          <TableCell className="amount-cell">
                            <EditableCurrencyAmount
                              amount={item.codAmount?.amount || 0}
                              currency={item.codAmount?.currency || 'RMB'}
                              onSave={(amount, currency) => updateItem(item.id, { 
                                codAmount: { amount, currency: currency as 'RMB' | 'HKD' | 'MOP' } 
                              })}
                              currencies={currencyOptions}
                            />
                          </TableCell>
                          
                          {/* 代收支票额 */}
                          <TableCell className="amount-cell">
                            <EditableCurrencyAmount
                              amount={item.checkAmount?.amount || 0}
                              currency={item.checkAmount?.currency || 'RMB'}
                              onSave={(amount, currency) => updateItem(item.id, { 
                                checkAmount: { amount, currency: currency as 'RMB' | 'HKD' | 'MOP' } 
                              })}
                              currencies={currencyOptions}
                            />
                          </TableCell>
                          
                          {/* 预计费用 */}
                          <TableCell className="amount-cell">
                            {item.estimatedCost ? `¥${item.estimatedCost.toFixed(2)}` : '-'}
                          </TableCell>
                          
                          {/* 创建日期 */}
                          <TableCell className="table-cell-nowrap">
                            {item.createdAt}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={13} className="text-center py-6">
                          没有找到符合条件的数据
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </ScrollableTabsContent>
        </ScrollableTabs>
      </div>
    </div>
  );
}
