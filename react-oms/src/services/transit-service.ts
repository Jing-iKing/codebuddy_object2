import { TransitItem, TransitTab, TransitFilter, NewTransitItemForm } from '../types/transit';
import { mockTransitItems } from '../data/mock/transit-items';
import { mockTransitTabs } from '../data/mock/transit-tabs';
import { config } from '../config/env';

// 中转处理服务接口
export interface TransitService {
  // 获取中转处理项列表
  getTransitItems(filter?: TransitFilter): Promise<TransitItem[]>;
  
  // 获取中转处理选项卡列表
  getTransitTabs(): Promise<TransitTab[]>;
  
  // 创建新的中转处理项
  createTransitItem(item: NewTransitItemForm): Promise<TransitItem>;
  
  // 更新中转处理项
  updateTransitItem(id: string, item: Partial<TransitItem>): Promise<TransitItem>;
  
  // 删除中转处理项
  deleteTransitItem(id: string): Promise<boolean>;
}

// Mock数据实现
export class MockTransitService implements TransitService {
  // 使用导入的模拟数据
  private transitItems: TransitItem[] = [...mockTransitItems];
  private transitTabs: TransitTab[] = [...mockTransitTabs];

  async getTransitItems(filter?: TransitFilter): Promise<TransitItem[]> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredItems = [...this.transitItems];
    
    // 应用筛选条件
    if (filter) {
      if (filter.status && filter.status !== 'all') {
        filteredItems = filteredItems.filter(item => item.status === filter.status);
      }
      
      if (filter.warehouseArea && filter.warehouseArea !== 'all') {
        filteredItems = filteredItems.filter(item => item.warehouseArea.startsWith(filter.warehouseArea));
      }
      
      if (filter.customer && filter.customer !== 'all') {
        filteredItems = filteredItems.filter(item => item.customer.includes(filter.customer));
      }
      
      if (filter.searchTerm) {
        const searchTerm = filter.searchTerm.toLowerCase();
        filteredItems = filteredItems.filter(item => 
          item.productName.toLowerCase().includes(searchTerm) ||
          item.externalOrderId.toLowerCase().includes(searchTerm) ||
          item.customer.toLowerCase().includes(searchTerm)
        );
      }
    }
    
    return filteredItems;
  }

  async getTransitTabs(): Promise<TransitTab[]> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.transitTabs];
  }

  async createTransitItem(item: NewTransitItemForm): Promise<TransitItem> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 创建新的中转处理项
    const newItem: TransitItem = {
      id: `ITEM-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
      productName: item.productName,
      externalOrderId: item.externalOrderId,
      length: Number(item.length),
      width: Number(item.width),
      height: Number(item.height),
      weight: Number(item.weight),
      warehouseArea: item.warehouseArea,
      customer: item.customer,
      status: item.status,
      arrivalTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    
    // 添加到列表中
    this.transitItems.push(newItem);
    
    return newItem;
  }

  async updateTransitItem(id: string, item: Partial<TransitItem>): Promise<TransitItem> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // 查找要更新的项
    const index = this.transitItems.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error(`找不到ID为${id}的中转处理项`);
    }
    
    // 更新项
    this.transitItems[index] = { ...this.transitItems[index], ...item };
    
    return this.transitItems[index];
  }

  async deleteTransitItem(id: string): Promise<boolean> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 查找要删除的项
    const index = this.transitItems.findIndex(i => i.id === id);
    if (index === -1) {
      return false;
    }
    
    // 删除项
    this.transitItems.splice(index, 1);
    
    return true;
  }
}

// API实现
export class ApiTransitService implements TransitService {
  private apiBaseUrl: string;
  
  constructor(apiBaseUrl: string = '/api') {
    this.apiBaseUrl = apiBaseUrl;
  }
  
  async getTransitItems(filter?: TransitFilter): Promise<TransitItem[]> {
    // 构建查询参数
    const queryParams = new URLSearchParams();
    if (filter) {
      if (filter.status) queryParams.append('status', filter.status);
      if (filter.warehouseArea) queryParams.append('warehouseArea', filter.warehouseArea);
      if (filter.customer) queryParams.append('customer', filter.customer);
      if (filter.searchTerm) queryParams.append('search', filter.searchTerm);
    }
    
    // 发送请求
    const response = await fetch(`${this.apiBaseUrl}/transit-items?${queryParams}`);
    if (!response.ok) {
      throw new Error(`获取中转处理项失败: ${response.statusText}`);
    }
    
    return await response.json();
  }
  
  async getTransitTabs(): Promise<TransitTab[]> {
    const response = await fetch(`${this.apiBaseUrl}/transit-tabs`);
    if (!response.ok) {
      throw new Error(`获取中转处理选项卡失败: ${response.statusText}`);
    }
    
    return await response.json();
  }
  
  async createTransitItem(item: NewTransitItemForm): Promise<TransitItem> {
    const response = await fetch(`${this.apiBaseUrl}/transit-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    });
    
    if (!response.ok) {
      throw new Error(`创建中转处理项失败: ${response.statusText}`);
    }
    
    return await response.json();
  }
  
  async updateTransitItem(id: string, item: Partial<TransitItem>): Promise<TransitItem> {
    const response = await fetch(`${this.apiBaseUrl}/transit-items/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    });
    
    if (!response.ok) {
      throw new Error(`更新中转处理项失败: ${response.statusText}`);
    }
    
    return await response.json();
  }
  
  async deleteTransitItem(id: string): Promise<boolean> {
    const response = await fetch(`${this.apiBaseUrl}/transit-items/${id}`, {
      method: 'DELETE'
    });
    
    return response.ok;
  }
}

// 服务工厂，根据环境返回适当的服务实现
export class TransitServiceFactory {
  static getService(): TransitService {
    // 使用环境配置决定使用哪个实现
    if (!config.useMockData) {
      // 确保apiBaseUrl不为undefined
      return new ApiTransitService(config.apiBaseUrl || '/api');
    } else {
      return new MockTransitService();
    }
  }
}

// 导出默认服务实例
export const transitService = TransitServiceFactory.getService();