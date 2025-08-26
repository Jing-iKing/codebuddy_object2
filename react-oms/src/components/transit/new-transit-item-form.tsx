import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { NewTransitItemForm as TransitFormData, TransitStatus, Currency } from '@/types/transit';
import { mockRecipientInfoList } from '@/data/mock/recipient-info';

interface TransitItemFormProps {
  onSubmit: (data: TransitFormData) => void;
  onCancel: () => void;
}

const initialFormState: TransitFormData = {
  productName: '',
  externalOrderId: '',
  transferOrderId: '',
  length: '',
  width: '',
  height: '',
  weight: '',
  volume: '',
  volumeWeight: '',
  quantity: 1,
  warehouseArea: '',
  arrivalDate: new Date().toISOString(),
  customer: '',
  productStrategy: '标准派送',
  deliveryZone: '',
  recipientName: '',
  recipientPhone: '',
  recipientAddress: '',
  advancePaymentAmount: 0,
  advancePaymentCurrency: 'RMB',
  codAmount: 0,
  codCurrency: 'RMB',
  checkAmount: 0,
  checkCurrency: 'RMB',
  estimatedCost: 0,
  status: '待处理',
};

// 收件人选项
const recipientOptions: ComboboxOption[] = mockRecipientInfoList.map(recipient => ({
  value: recipient.id,
  label: `${recipient.name} - ${recipient.phone}`,
  description: recipient.address
}));

export function NewTransitItemForm({ onSubmit, onCancel }: TransitItemFormProps) {
  const [formData, setFormData] = useState<TransitFormData>(initialFormState);
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [arrivalDate, setArrivalDate] = useState<Date | undefined>(new Date());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? '' : Number(value);
    setFormData(prev => ({ ...prev, [name]: numValue }));
  };

  const calculateVolume = () => {
    const { length, width, height } = formData;
    if (length && width && height) {
      const volume = Number(length) * Number(width) * Number(height);
      const volumeWeight = volume / 6000; // 体积重 = 体积 / 6000
      setFormData(prev => ({ 
        ...prev, 
        volume: volume,
        volumeWeight: parseFloat(volumeWeight.toFixed(2))
      }));
    }
  };

  const handleRecipientChange = (value: string) => {
    setSelectedRecipient(value);
    const selected = recipientOptions.find(opt => opt.value === value);
    if (selected) {
      // 解析选项中的名称和电话
      const [name, phone] = selected.label.split(' - ');
      setFormData(prev => ({
        ...prev,
        recipientName: name,
        recipientPhone: phone,
        recipientAddress: selected.description || ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateVolume(); // 确保体积已计算
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 基本信息 */}
        <div className="space-y-2">
          <Label htmlFor="productName">货品名称 *</Label>
          <Input
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="externalOrderId">外部单号 *</Label>
          <Input
            id="externalOrderId"
            name="externalOrderId"
            value={formData.externalOrderId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="transferOrderId">转派单号</Label>
          <Input
            id="transferOrderId"
            name="transferOrderId"
            value={formData.transferOrderId}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer">开单客户 *</Label>
          <Input
            id="customer"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="productStrategy">货品策略</Label>
          <Select 
            value={formData.productStrategy} 
            onValueChange={(value) => handleSelectChange('productStrategy', value)}
          >
            <SelectTrigger id="productStrategy">
              <SelectValue placeholder="选择货品策略" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="标准派送">标准派送</SelectItem>
              <SelectItem value="加急派送">加急派送</SelectItem>
              <SelectItem value="冷链配送">冷链配送</SelectItem>
              <SelectItem value="大件配送">大件配送</SelectItem>
              <SelectItem value="特殊处理">特殊处理</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="warehouseArea">仓区 *</Label>
          <Select 
            value={formData.warehouseArea} 
            onValueChange={(value) => handleSelectChange('warehouseArea', value)}
            required
          >
            <SelectTrigger id="warehouseArea">
              <SelectValue placeholder="选择仓区" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A区-电子产品">A区-电子产品</SelectItem>
              <SelectItem value="B区-日用品">B区-日用品</SelectItem>
              <SelectItem value="C区-服装">C区-服装</SelectItem>
              <SelectItem value="D区-食品">D区-食品</SelectItem>
              <SelectItem value="E区-大件">E区-大件</SelectItem>
              <SelectItem value="F区-轻小件">F区-轻小件</SelectItem>
              <SelectItem value="G区-特殊物品">G区-特殊物品</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="arrivalDate">到库日期</Label>
          <DatePicker
            date={arrivalDate}
            setDate={(date) => {
              setArrivalDate(date);
              if (date) {
                setFormData(prev => ({ ...prev, arrivalDate: date.toISOString() }));
              }
            }}
            placeholder="选择到库日期"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deliveryZone">配送分区</Label>
          <Input
            id="deliveryZone"
            name="deliveryZone"
            value={formData.deliveryZone}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* 尺寸和重量 */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-medium mb-4">尺寸和重量</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="length">长度 (cm) *</Label>
            <Input
              id="length"
              name="length"
              type="number"
              min="0"
              step="0.1"
              value={formData.length}
              onChange={handleNumberChange}
              onBlur={calculateVolume}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="width">宽度 (cm) *</Label>
            <Input
              id="width"
              name="width"
              type="number"
              min="0"
              step="0.1"
              value={formData.width}
              onChange={handleNumberChange}
              onBlur={calculateVolume}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">高度 (cm) *</Label>
            <Input
              id="height"
              name="height"
              type="number"
              min="0"
              step="0.1"
              value={formData.height}
              onChange={handleNumberChange}
              onBlur={calculateVolume}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">重量 (kg) *</Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              min="0"
              step="0.1"
              value={formData.weight}
              onChange={handleNumberChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="volume">体积 (cm³)</Label>
            <Input
              id="volume"
              name="volume"
              type="number"
              value={formData.volume}
              onChange={handleNumberChange}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="volumeWeight">体积重 (kg)</Label>
            <Input
              id="volumeWeight"
              name="volumeWeight"
              type="number"
              value={formData.volumeWeight}
              onChange={handleNumberChange}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">件数</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={handleNumberChange}
            />
          </div>
        </div>
      </div>

      {/* 收件信息 */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-medium mb-4">收件信息</h3>
        <div className="space-y-4">
          <div className="space-y-2 z-30 relative">
            <Label htmlFor="recipientSelect">选择收件人</Label>
            <Combobox
              options={recipientOptions}
              value={selectedRecipient}
              onChange={handleRecipientChange}
              placeholder="选择收件人"
              emptyMessage="没有找到收件人"
              popoverClassName="w-[350px]"
              triggerClassName="bg-white"
            />
          </div>

          {selectedRecipient && (
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-500">收件人</Label>
                  <div className="font-medium">{formData.recipientName}</div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">联系电话</Label>
                  <div>{formData.recipientPhone}</div>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-xs text-gray-500">收件地址</Label>
                  <div className="text-sm">{formData.recipientAddress}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 费用信息 */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-medium mb-4">费用信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="advancePaymentAmount">垫付金额</Label>
            <div className="flex space-x-2">
              <Input
                id="advancePaymentAmount"
                name="advancePaymentAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.advancePaymentAmount}
                onChange={handleNumberChange}
                className="flex-grow"
              />
              <Select 
                value={formData.advancePaymentCurrency as string} 
                onValueChange={(value) => handleSelectChange('advancePaymentCurrency', value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RMB">RMB</SelectItem>
                  <SelectItem value="HKD">HKD</SelectItem>
                  <SelectItem value="MOP">MOP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="codAmount">代收货款</Label>
            <div className="flex space-x-2">
              <Input
                id="codAmount"
                name="codAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.codAmount}
                onChange={handleNumberChange}
                className="flex-grow"
              />
              <Select 
                value={formData.codCurrency as string} 
                onValueChange={(value) => handleSelectChange('codCurrency', value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RMB">RMB</SelectItem>
                  <SelectItem value="HKD">HKD</SelectItem>
                  <SelectItem value="MOP">MOP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkAmount">代收支票额</Label>
            <div className="flex space-x-2">
              <Input
                id="checkAmount"
                name="checkAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.checkAmount}
                onChange={handleNumberChange}
                className="flex-grow"
              />
              <Select 
                value={formData.checkCurrency as string} 
                onValueChange={(value) => handleSelectChange('checkCurrency', value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RMB">RMB</SelectItem>
                  <SelectItem value="HKD">HKD</SelectItem>
                  <SelectItem value="MOP">MOP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedCost">预计费用 (RMB)</Label>
            <Input
              id="estimatedCost"
              name="estimatedCost"
              type="number"
              min="0"
              step="0.01"
              value={formData.estimatedCost}
              onChange={handleNumberChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">状态</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="待处理">待处理</SelectItem>
                <SelectItem value="处理中">处理中</SelectItem>
                <SelectItem value="已完成">已完成</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">
          保存
        </Button>
      </div>
    </form>
  );
}