import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Plus,
  Search,
  Truck,
  Package,
  X,
  ArrowRight,
  ArrowLeft,
  Trash2,
  CircleCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTable } from "@/components/ui/data-table";
import { createSelectColumn } from "@/components/ui/data-table-checkbox";
import { ColumnDef, Row, flexRender } from "@tanstack/react-table";
import { ScrollableTabs, ScrollableTabsList, ScrollableTabsTrigger, ScrollableTabsContent } from "@/components/ui/scrollable-tabs";
import { mockTransitAreas } from "@/data/mock/transit-areas";
import { mockTransitItems } from "@/data/mock/transit-items";
import { mockPallets } from "@/data/mock/pallets";
import { mockPreparingItems } from "@/data/mock/preparing-items";
import { mockWaitingItems } from "@/data/mock/waiting-items";
import { Pallet, PalletItem, TransitItem } from "@/types/transit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

// 货板状态颜色映射
const palletStatusColors: Record<string, string> = {
  'available': 'bg-green-100 text-green-800',
  'loading': 'bg-blue-100 text-blue-800',
  'loaded': 'bg-purple-100 text-purple-800',
  'shipping': 'bg-amber-100 text-amber-800',
  'unloading': 'bg-gray-100 text-gray-800'
};

// 货板状态中文映射
const palletStatusLabels: Record<string, string> = {
  'available': '可用',
  'loading': '装载中',
  'loaded': '已装载',
  'shipping': '运输中',
  'unloading': '卸载中'
};

// 码板装车页面
function PalletLoading() {
  // 路由相关
  const navigate = useNavigate();
  const location = useLocation();
  
  // 状态
  const [currentTab, setCurrentTab] = useState("nanping-zhongao");
  const [pallets, setPallets] = useState<Pallet[]>(mockPallets);
  // 使用从mock文件导入的示例数据
  const [preparingItems, setPreparingItems] = useState<PalletItem[]>(mockPreparingItems);
  // 使用从mock文件导入的示例数据
  const [waitingItems, setWaitingItems] = useState<TransitItem[]>(mockWaitingItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [preparingSearchTerm, setPreparingSearchTerm] = useState("");
  const [selectedPallets, setSelectedPallets] = useState<Set<string>>(new Set());
  const [selectedPreparingItems, setSelectedPreparingItems] = useState<Set<string>>(new Set());
  const [selectedWaitingItems, setSelectedWaitingItems] = useState<Set<string>>(new Set());
  const [newPalletName, setNewPalletName] = useState("");
  const [newPalletAlias, setNewPalletAlias] = useState("");
  const [isNewPalletDialogOpen, setIsNewPalletDialogOpen] = useState(false);
  const [isLoadPalletDialogOpen, setIsLoadPalletDialogOpen] = useState(false);
  const [isUnloadPalletDialogOpen, setIsUnloadPalletDialogOpen] = useState(false);
  const [isDeletePalletDialogOpen, setIsDeletePalletDialogOpen] = useState(false);
  const [selectedPalletId, setSelectedPalletId] = useState<string | null>(null);
  
  // 布局持久化
  const saveLayout = (sizes: number[]) => {
    localStorage.setItem('pallet-loading-layout', JSON.stringify(sizes));
  };

  const loadLayout = () => {
    const savedLayout = localStorage.getItem('pallet-loading-layout');
    if (savedLayout) {
      try {
        return JSON.parse(savedLayout) as number[];
      } catch (e) {
        console.error('Failed to parse saved layout', e);
      }
    }
    return [20, 45, 35]; // 默认布局
  };

  // 这些函数已经在上面定义过了，所以这里删除重复代码

  // 过滤待码货品和装板准备区货品
  const filteredWaitingItems = useMemo(() => {
    return waitingItems.filter(item => {
      const term = searchTerm.toLowerCase();
      return (
        item.externalOrderId.toLowerCase().includes(term) ||
        item.productName.toLowerCase().includes(term) ||
        item.customer.toLowerCase().includes(term) ||
        (item.productStrategy && item.productStrategy.toLowerCase().includes(term))
      );
    });
  }, [waitingItems, searchTerm]);

  const filteredPreparingItems = useMemo(() => {
    return preparingItems.filter(item => {
      const term = preparingSearchTerm.toLowerCase();
      return (
        item.externalOrderId.toLowerCase().includes(term) ||
        item.productName.toLowerCase().includes(term) ||
        item.customer.toLowerCase().includes(term) ||
        (item.productStrategy && item.productStrategy.toLowerCase().includes(term))
      );
    });
  }, [preparingItems, preparingSearchTerm]);

  // 装板准备区列定义
  const preparingColumns = useMemo<ColumnDef<PalletItem, any>[]>(() => [
    createSelectColumn<PalletItem>(),
    {
      id: "actions",
      header: "操作",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Button 
            size="sm" 
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              // 直接将这个货品从装板准备区移出
              const originalItem = mockTransitItems.find(i => i.id === item.id);
              if (originalItem) {
                // 添加到待码货品
                setWaitingItems(prev => [...prev, originalItem]);
                // 从装板准备区移除
                setPreparingItems(prev => prev.filter(i => i.id !== item.id));
              }
            }}
          >
            移出
          </Button>
        );
      },
    },
    {
      accessorKey: "externalOrderId",
      header: "外部单号",
    },
    {
      accessorKey: "arrivalDate",
      header: "仓区到库日期",
    },
    {
      accessorKey: "productName",
      header: "品名",
    },
    {
      accessorKey: "productStrategy",
      header: "货品策略",
    },
    {
      accessorKey: "customer",
      header: "开单客户",
    },
    {
      id: "remark",
      header: "备注",
      cell: () => "-",
    },
    {
      accessorKey: "warehouseArea",
      header: "配送分区",
    },
  ], []);

  // 货板列表定义
  const palletColumns = useMemo<ColumnDef<Pallet, any>[]>(() => [
    createSelectColumn<Pallet>(),
    {
      accessorKey: "name",
      header: "货板名称",
      cell: ({ row }) => {
        const pallet = row.original;
        return (
          <div 
            className="cursor-pointer" 
            onClick={() => handlePalletRowClick(pallet)}
          >
            <div className="font-medium">{pallet.name}</div>
            {pallet.alias && (
              <div className="text-sm text-gray-500">{pallet.alias}</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "itemCount",
      header: "货品数量",
      cell: ({ row }) => {
        const pallet = row.original;
        return (
          <div 
            className="font-medium cursor-pointer" 
            onClick={() => handlePalletRowClick(pallet)}
          >
            {pallet.itemCount}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "操作",
      cell: ({ row }) => {
        const pallet = row.original;
        return (
          <div className="flex space-x-1">
            <Button 
              size="sm" 
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                // 直接删除该货板
                // 将货板上的货品放回待码区
                const newWaitingItems: TransitItem[] = [];
                
                pallet.items.forEach(item => {
                  const originalItem = mockTransitItems.find(i => i.id === item.id);
                  if (originalItem) {
                    newWaitingItems.push(originalItem);
                  }
                });
                
                // 更新货板列表和待码货品
                setPallets(prev => prev.filter(p => p.id !== pallet.id));
                setWaitingItems(prev => [...prev, ...newWaitingItems]);
                
                // 如果删除的是当前选中的货板，清空选中状态
                if (selectedPalletId === pallet.id) {
                  setSelectedPalletId(null);
                }
                
                // 更新选中的货板集合
                const newSelectedPallets = new Set(selectedPallets);
                newSelectedPallets.delete(pallet.id);
                setSelectedPallets(newSelectedPallets);
              }}
            >
              <Trash2 className="h-3 w-3 mr-1" /> 删除
            </Button>
          </div>
        );
      },
    },
  ], []);

  // 待码货品列定义
  const waitingColumns = useMemo<ColumnDef<TransitItem, any>[]>(() => [
    createSelectColumn<TransitItem>(),
    {
      id: "actions",
      header: "操作",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Button 
            size="sm" 
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              // 直接将这个货品添加到装板准备区
              const palletItem: PalletItem = {
                id: item.id,
                externalOrderId: item.externalOrderId,
                arrivalDate: item.arrivalDate || "",
                productName: item.productName,
                customer: item.customer,
                productStrategy: item.productStrategy || "",
                warehouseArea: item.warehouseArea
              };
              
              // 更新装板准备区
              setPreparingItems(prev => [...prev, palletItem]);
              
              // 从待码货品中移除
              setWaitingItems(prev => prev.filter(i => i.id !== item.id));
            }}
          >
            装入
          </Button>
        );
      },
    },
    {
      accessorKey: "externalOrderId",
      header: "外部单号",
    },
    {
      accessorKey: "arrivalDate",
      header: "仓区到库日期",
    },
    {
      accessorKey: "productName",
      header: "品名",
    },
    {
      accessorKey: "productStrategy",
      header: "货品策略",
    },
    {
      accessorKey: "customer",
      header: "开单客户",
    },
    {
      id: "remark",
      header: "备注",
      cell: () => "-",
    },
    {
      accessorKey: "warehouseArea",
      header: "配送分区",
    },
  ], []);

  // 处理菜单点击和页面跳转
  const isInitialMount = useRef(true);
  const lastPathname = useRef(location.pathname);
  
  useEffect(() => {
    // 跳过组件首次挂载时的执行
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // 如果路径发生变化，强制刷新页面
    if (location.pathname !== lastPathname.current) {
      console.log('路径变化，从', lastPathname.current, '到', location.pathname);
      // 使用 window.location.href 强制刷新页面
      window.location.href = location.pathname;
    }
  }, [location.pathname]);
  
  // 监听全局点击事件，处理菜单点击
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // 检查点击的元素是否是菜单项
      const target = e.target as HTMLElement;
      const menuItem = target.closest('a[href], button[data-href]');
      
      if (menuItem) {
        const href = menuItem.getAttribute('href') || menuItem.getAttribute('data-href');
        if (href && href !== location.pathname && !href.startsWith('#')) {
          console.log('菜单点击，跳转到:', href);
          // 阻止默认行为
          e.preventDefault();
          // 强制刷新到新页面
          window.location.href = href;
        }
      }
    };
    
    // 添加全局点击事件监听
    document.addEventListener('click', handleGlobalClick);
    
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [location.pathname]);

  // 初始化默认选中第一个货板
  useEffect(() => {
    // 默认选中第一个货板
    if (pallets.length > 0 && selectedPallets.size === 0) {
      setSelectedPallets(new Set([pallets[0].id]));
    }
  }, [pallets]);

  // 处理搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 处理装板准备区搜索
  const handlePreparingSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreparingSearchTerm(e.target.value);
  };

  // 这部分代码已经在上面使用useMemo实现过了，所以这里删除重复代码

  // 添加货品到装板准备区
  const addToPreparing = () => {
    if (selectedWaitingItems.size === 0) return;
    
    const newPreparingItems: PalletItem[] = [];
    const remainingWaitingItems = waitingItems.filter(item => {
      if (selectedWaitingItems.has(item.id)) {
        const palletItem: PalletItem = {
          id: item.id,
          externalOrderId: item.externalOrderId,
          arrivalDate: item.arrivalDate || "",
          productName: item.productName,
          customer: item.customer,
          productStrategy: item.productStrategy || "",
          warehouseArea: item.warehouseArea
        };
        newPreparingItems.push(palletItem);
        return false;
      }
      return true;
    });
    
    setPreparingItems([...preparingItems, ...newPreparingItems]);
    setWaitingItems(remainingWaitingItems);
    setSelectedWaitingItems(new Set());
  };

  // 从装板准备区移除货品
  const removeFromPreparing = () => {
    if (selectedPreparingItems.size === 0) return;
    
    const newWaitingItems: TransitItem[] = [];
    const remainingPreparingItems = preparingItems.filter(item => {
      if (selectedPreparingItems.has(item.id)) {
        // 找到原始货品数据
        const originalItem = mockTransitItems.find(i => i.id === item.id);
        if (originalItem) {
          newWaitingItems.push(originalItem);
        }
        return false;
      }
      return true;
    });
    
    setWaitingItems([...waitingItems, ...newWaitingItems]);
    setPreparingItems(remainingPreparingItems);
    setSelectedPreparingItems(new Set());
  };

  // 创建新货板
  const createNewPallet = () => {
    if (!newPalletName) return;
    
    const newPallet: Pallet = {
      id: `PLT-${String(pallets.length + 1).padStart(3, '0')}`,
      name: newPalletName,
      alias: newPalletAlias || undefined,
      itemCount: 0,
      status: 'available',
      createdAt: new Date().toISOString().split('T')[0],
      items: []
    };
    
    const newPallets = [...pallets, newPallet];
    setPallets(newPallets);
    setNewPalletName("");
    setNewPalletAlias("");
    setIsNewPalletDialogOpen(false);
    
    // 选中新创建的货板
    setSelectedPallets(new Set([newPallet.id]));
  };

  // 装载货品到货板
  const loadItemsToPallet = () => {
    if (preparingItems.length === 0) return;
    
    // 如果没有选中货板，默认选中第一个
    let targetPalletIds = new Set<string>();
    if (selectedPallets.size === 0) {
      if (pallets.length > 0) {
        targetPalletIds.add(pallets[0].id);
        setSelectedPallets(targetPalletIds);
      } else {
        return; // 没有货板可用
      }
    } else {
      targetPalletIds = selectedPallets;
    }
    
    // 只装载选中的准备区货品，如果没有选中则装载全部
    const itemsToLoad = selectedPreparingItems.size > 0 
      ? preparingItems.filter(item => selectedPreparingItems.has(item.id))
      : preparingItems;
    
    const updatedPallets = pallets.map(pallet => {
      if (targetPalletIds.has(pallet.id)) {
        return {
          ...pallet,
          items: [...pallet.items, ...itemsToLoad],
          itemCount: pallet.itemCount + itemsToLoad.length,
          status: 'loading' as 'available' | 'loading' | 'loaded' | 'shipping' | 'unloading'
        };
      }
      return pallet;
    });
    
    setPallets(updatedPallets);
    
    // 清空装板准备区或移除已装载的货品
    if (selectedPreparingItems.size > 0) {
      const remainingItems = preparingItems.filter(item => !selectedPreparingItems.has(item.id));
      setPreparingItems(remainingItems);
    } else {
      setPreparingItems([]);
    }
    
    setSelectedPreparingItems(new Set());
  };

  // 删除货板
  const deletePallet = () => {
    if (selectedPallets.size === 0) return;
    
    // 将货板上的货品放回待码区
    const newWaitingItems: TransitItem[] = [];
    
    pallets.forEach(pallet => {
      if (selectedPallets.has(pallet.id)) {
        pallet.items.forEach(item => {
          const originalItem = mockTransitItems.find(i => i.id === item.id);
          if (originalItem) {
            newWaitingItems.push(originalItem);
          }
        });
      }
    });
    
    const remainingPallets = pallets.filter(p => !selectedPallets.has(p.id));
    
    setPallets(remainingPallets);
    setWaitingItems([...waitingItems, ...newWaitingItems]);
    setSelectedPallets(new Set());
    setIsDeletePalletDialogOpen(false);
    
    // 如果还有货板，选中第一个
    if (remainingPallets.length > 0) {
      setSelectedPallets(new Set([remainingPallets[0].id]));
    }
  };

  // 货板装车
  const loadPalletToVehicle = () => {
    if (selectedPallets.size === 0) return;
    
    const updatedPallets = pallets.map(pallet => {
      if (selectedPallets.has(pallet.id)) {
        return {
          ...pallet,
          status: 'loaded' as 'available' | 'loading' | 'loaded' | 'shipping' | 'unloading'
        };
      }
      return pallet;
    });
    
    setPallets(updatedPallets);
    setIsLoadPalletDialogOpen(false);
    // 这里可以添加跳转到车次管理页面的逻辑
  };

  // 卸载货板
  const unloadPallet = () => {
    if (selectedPallets.size === 0) return;
    
    const updatedPallets = pallets.map(pallet => {
      if (selectedPallets.has(pallet.id)) {
        return {
          ...pallet,
          status: 'available' as 'available' | 'loading' | 'loaded' | 'shipping' | 'unloading'
        };
      }
      return pallet;
    });
    
    setPallets(updatedPallets);
    setIsUnloadPalletDialogOpen(false);
  };

  // 处理货板行点击
  const handlePalletRowClick = (pallet: Pallet) => {
    // 更新选中的货板ID
    setSelectedPalletId(pallet.id);
    // 更新选中的货板集合
    setSelectedPallets(new Set([pallet.id]));
    // 显示该货板上的货品到装板准备区
    setPreparingItems([...pallet.items]);
  };

  // 处理DataTable行选择变化
  const handlePalletRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    const selectedIds = new Set<string>();
    Object.keys(rowSelection).forEach(index => {
      if (rowSelection[index]) {
        selectedIds.add(pallets[parseInt(index)].id);
      }
    });
    setSelectedPallets(selectedIds);
  };

  const handlePreparingItemRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    const selectedIds = new Set<string>();
    Object.keys(rowSelection).forEach(index => {
      if (rowSelection[index]) {
        selectedIds.add(filteredPreparingItems[parseInt(index)].id);
      }
    });
    setSelectedPreparingItems(selectedIds);
  };

  const handleWaitingItemRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    const selectedIds = new Set<string>();
    Object.keys(rowSelection).forEach(index => {
      if (rowSelection[index]) {
        selectedIds.add(filteredWaitingItems[parseInt(index)].id);
      }
    });
    setSelectedWaitingItems(selectedIds);
  };

// 获取选中的货板名称
  const getSelectedPalletName = () => {
    if (selectedPallets.size === 0) return "";
    const selectedPalletId = Array.from(selectedPallets)[0];
    const selectedPallet = pallets.find(p => p.id === selectedPalletId);
    return selectedPallet ? selectedPallet.name : "";
  };

  return (
    <>
      <ScrollableTabs value={currentTab} onValueChange={setCurrentTab} className="mb-4">
        <ScrollableTabsList>
          {mockTransitAreas.map(area => (
            <ScrollableTabsTrigger key={area.id} value={area.id}>
              {area.name}
            </ScrollableTabsTrigger>
          ))}
        </ScrollableTabsList>
      </ScrollableTabs>
      
      <ResizablePanelGroup 
        direction="horizontal" 
        className="min-h-[calc(100vh-120px)] w-full rounded-lg border"
        onLayout={saveLayout}
      >
        <ResizablePanel 
          defaultSize={loadLayout()[0]} 
          minSize={15}
          maxSize={30}
          className="transition-all duration-75"
        >
          <div className="h-full">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center">
                  <CardTitle className="text-lg">货板列表</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm"
                    onClick={() => setIsLoadPalletDialogOpen(true)}
                    disabled={selectedPallets.size === 0}
                    className="bg-[#C22F57] hover:bg-[#A52A48]"
                  >
                    <Truck className="h-3 w-3 mr-1" /> 装车
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setIsUnloadPalletDialogOpen(true)}
                    disabled={selectedPallets.size === 0}
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" /> 卸车
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => setIsNewPalletDialogOpen(true)}
                  >
                    <Plus className="h-3 w-3 mr-1" /> 新增
                  </Button>
                </div>
              </div>
            </div>
            <div className="h-[calc(100%-60px)] overflow-auto p-[5px]">
              {pallets.length > 0 ? (
                <div className="w-full" onClick={(e) => {
                  // 使用事件委托处理行点击
                  const target = e.target as HTMLElement;
                  const row = target.closest('tr');
                  if (row) {
                    // 获取行索引
                    const rowIndex = Array.from(row.parentElement?.children || []).indexOf(row);
                    if (rowIndex >= 0 && rowIndex < pallets.length) {
                      handlePalletRowClick(pallets[rowIndex]);
                    }
                  }
                }}>
                  <DataTable 
                    columns={palletColumns} 
                    data={pallets}
                    className="w-full cursor-pointer"
                    onRowSelectionChange={handlePalletRowSelectionChange}
                  />
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 border rounded-md">
                  暂无货板，请点击"新增"按钮创建货板
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle className="w-2 transition-all bg-slate-100 hover:bg-slate-200 active:bg-slate-300">
          <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
            <div className="h-2.5 w-0.5 rounded-full bg-slate-400 mx-0.5" />
            <div className="h-2.5 w-0.5 rounded-full bg-slate-400 mx-0.5" />
          </div>
        </ResizableHandle>
        
        <ResizablePanel 
          defaultSize={loadLayout()[1]} 
          minSize={25}
          maxSize={60}
          className="transition-all duration-75"
        >
          <div className="h-full">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <CardTitle className="text-lg">装板准备区</CardTitle>
                </div>
                {selectedPallets.size > 0 && (
                  <span className="text-sm text-gray-500">
                    选中货板: {getSelectedPalletName()}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative w-48">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索..."
                    value={preparingSearchTerm}
                    onChange={handlePreparingSearch}
                    className="pl-8 h-8"
                  />
                </div>
                <Button 
                  size="sm" 
                  onClick={() => {
                    // 直接在这里实现装板逻辑，确保按钮点击时能正确执行
                    if (preparingItems.length === 0) return;
                    
                    // 如果没有选中货板，默认选中第一个
                    let targetPalletId = selectedPalletId;
                    if (!targetPalletId && pallets.length > 0) {
                      targetPalletId = pallets[0].id;
                      setSelectedPalletId(targetPalletId);
                      setSelectedPallets(new Set([targetPalletId]));
                    }
                    
                    if (!targetPalletId) return; // 没有可用货板
                    
                    // 只装载选中的准备区货品，如果没有选中则装载全部
                    const itemsToLoad = selectedPreparingItems.size > 0 
                      ? preparingItems.filter(item => selectedPreparingItems.has(item.id))
                      : preparingItems;
                    
                    // 更新货板数据
                    setPallets(prev => prev.map(pallet => {
                      if (pallet.id === targetPalletId) {
                        return {
                          ...pallet,
                          items: [...pallet.items, ...itemsToLoad],
                          itemCount: pallet.itemCount + itemsToLoad.length,
                          status: 'loading' as 'available' | 'loading' | 'loaded' | 'shipping' | 'unloading'
                        };
                      }
                      return pallet;
                    }));
                    
                    // 清空装板准备区或移除已装载的货品
                    if (selectedPreparingItems.size > 0) {
                      setPreparingItems(prev => prev.filter(item => !selectedPreparingItems.has(item.id)));
                    } else {
                      setPreparingItems([]);
                    }
                    
                    setSelectedPreparingItems(new Set());
                  }}
                  disabled={preparingItems.length === 0}
                >
                  <Package className="h-3 w-3 mr-1" /> 装板
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={removeFromPreparing}
                  disabled={selectedPreparingItems.size === 0}
                >
                  <X className="h-3 w-3 mr-1" /> 移出
                </Button>
              </div>
            </div>
            <div className="h-[calc(100%-60px)] overflow-auto p-[5px]">
              <div className="overflow-x-auto w-full" style={{ minWidth: "100%", maxWidth: "100%" }}>
                {preparingItems.length > 0 ? (
                  <DataTable 
                    columns={preparingColumns} 
                    data={filteredPreparingItems}
                    className="w-full"
                    onRowSelectionChange={handlePreparingItemRowSelectionChange}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500 border rounded-md">
                    暂无装板准备区货品
                  </div>
                )}
              </div>
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle className="w-2 transition-all bg-slate-100 hover:bg-slate-200 active:bg-slate-300">
          <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
            <div className="h-2.5 w-0.5 rounded-full bg-slate-400 mx-0.5" />
            <div className="h-2.5 w-0.5 rounded-full bg-slate-400 mx-0.5" />
          </div>
        </ResizableHandle>
        
        <ResizablePanel 
          defaultSize={loadLayout()[2]} 
          minSize={20}
          maxSize={50}
          className="transition-all duration-75"
        >
          <div className="h-full">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center">
                <CardTitle className="text-lg">待码货品</CardTitle>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative w-48">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-8 h-8"
                  />
                </div>
                <Button 
                  size="sm" 
                  onClick={addToPreparing}
                  disabled={selectedWaitingItems.size === 0}
                >
                  <ArrowRight className="h-3 w-3 mr-1" /> 装入
                </Button>
              </div>
            </div>
            <div className="h-[calc(100%-60px)] overflow-auto p-[5px]">
              <div className="overflow-x-auto w-full" style={{ minWidth: "100%", maxWidth: "100%" }}>
                {waitingItems.length > 0 ? (
                  <DataTable 
                    columns={waitingColumns} 
                    data={filteredWaitingItems}
                    className="w-full"
                    onRowSelectionChange={handleWaitingItemRowSelectionChange}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500 border rounded-md">
                    暂无待码货品
                  </div>
                )}
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      
      {/* 新增货板对话框 */}
      <Dialog open={isNewPalletDialogOpen} onOpenChange={setIsNewPalletDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增货板</DialogTitle>
            <DialogDescription>
              创建一个新的货板用于装载货品
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                货板名称
              </Label>
              <Input
                id="name"
                value={newPalletName}
                onChange={(e) => setNewPalletName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="alias" className="text-right">
                别名（可选）
              </Label>
              <Input
                id="alias"
                value={newPalletAlias}
                onChange={(e) => setNewPalletAlias(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewPalletDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={createNewPallet}>创建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 装车对话框 */}
      <Dialog open={isLoadPalletDialogOpen} onOpenChange={setIsLoadPalletDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>货板装车</DialogTitle>
            <DialogDescription>
              确认将选中的货板装载到车辆上？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLoadPalletDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={loadPalletToVehicle}>确认装车</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 卸车对话框 */}
      <Dialog open={isUnloadPalletDialogOpen} onOpenChange={setIsUnloadPalletDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>货板卸车</DialogTitle>
            <DialogDescription>
              确认将选中的货板从车辆上卸载？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUnloadPalletDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={unloadPallet}>确认卸车</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 删除货板对话框 */}
      <Dialog open={isDeletePalletDialogOpen} onOpenChange={setIsDeletePalletDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除货板</DialogTitle>
            <DialogDescription>
              确认删除选中的货板？货板上的货品将返回到待码区。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeletePalletDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={deletePallet}>确认删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PalletLoading;
