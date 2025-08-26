import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  value: string
  label: string
  description?: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
  triggerClassName?: string
  popoverClassName?: string
  disabled?: boolean
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "选择选项...",
  emptyMessage = "没有找到结果",
  className,
  triggerClassName,
  popoverClassName,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  
  const selectedOption = options.find(option => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            triggerClassName
          )}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[200px] p-0", popoverClassName)}>
        <Command>
          <CommandInput placeholder={`搜索${placeholder}`} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => {
                  onChange(option.value === value ? "" : option.value)
                  setOpen(false)
                }}
              >
                <div className="flex flex-col w-full">
                  <div className="flex items-center">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </div>
                  {option.description && (
                    <div className="text-xs text-muted-foreground mt-0.5 truncate pl-6">
                      {option.description}
                    </div>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// 带编辑按钮的组合框
interface EditableComboboxProps extends ComboboxProps {
  onEdit: () => void
  initialValue: string
  onSave: (value: string) => void
  onCancel: () => void
}

export function EditableCombobox({
  options,
  value,
  onChange,
  placeholder,
  emptyMessage,
  className,
  triggerClassName,
  popoverClassName,
  disabled,
  onEdit,
  initialValue,
  onSave,
  onCancel
}: EditableComboboxProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [tempValue, setTempValue] = React.useState(value)
  
  const handleEdit = () => {
    setTempValue(value)
    setIsEditing(true)
    onEdit()
  }
  
  const handleSave = () => {
    setIsEditing(false)
    onSave(tempValue)
  }
  
  const handleCancel = () => {
    setIsEditing(false)
    setTempValue(initialValue)
    onCancel()
  }
  
  if (!isEditing) {
    return (
      <div className="flex items-center">
        <span className="truncate">{options.find(opt => opt.value === value)?.label || value}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 ml-1"
          onClick={handleEdit}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </Button>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex-grow">
        <Combobox
          options={options}
          value={tempValue}
          onChange={setTempValue}
          placeholder={placeholder}
          emptyMessage={emptyMessage}
          className={className}
          triggerClassName={triggerClassName}
          popoverClassName={popoverClassName}
          disabled={disabled}
        />
      </div>
      <div className="flex space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={handleSave}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={handleCancel}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </Button>
      </div>
    </div>
  )
}

// 可编辑的数值和币种组件
interface EditableCurrencyAmountProps {
  amount: number
  currency: string
  onSave: (amount: number, currency: string) => void
  currencies: { value: string; label: string; symbol: string }[]
}

export function EditableCurrencyAmount({
  amount,
  currency,
  onSave,
  currencies
}: EditableCurrencyAmountProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [tempAmount, setTempAmount] = React.useState(amount.toString())
  const [tempCurrency, setTempCurrency] = React.useState(currency)
  
  const currencySymbol = currencies.find(c => c.value === currency)?.symbol || ''
  
  const handleEdit = () => {
    setTempAmount(amount.toString())
    setTempCurrency(currency)
    setIsEditing(true)
  }
  
  const handleSave = () => {
    const newAmount = parseFloat(tempAmount)
    if (!isNaN(newAmount)) {
      onSave(newAmount, tempCurrency)
    }
    setIsEditing(false)
  }
  
  const handleCancel = () => {
    setIsEditing(false)
  }
  
  if (!isEditing) {
    return (
      <div className="flex items-center">
        <span>{amount === 0 ? '-' : `${currencySymbol}${amount.toFixed(2)}`}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 ml-1"
          onClick={handleEdit}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </Button>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col space-y-2">
      <div>
        <label className="text-xs">金额</label>
        <input
          type="number"
          value={tempAmount}
          onChange={(e) => setTempAmount(e.target.value)}
          className="w-full h-8 px-2 border rounded text-sm"
          step="0.01"
          min="0"
        />
      </div>
      <div>
        <label className="text-xs">币种</label>
        <select
          value={tempCurrency}
          onChange={(e) => setTempCurrency(e.target.value)}
          className="w-full h-8 border rounded text-sm px-1"
        >
          {currencies.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>
      <div className="flex space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={handleSave}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={handleCancel}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </Button>
      </div>
    </div>
  )
}

// 可编辑的尺寸组件
interface EditableDimensionsProps {
  length: number
  width: number
  height: number
  weight: number
  volume: number
  volumeWeight: number
  quantity: number
  onSave: (dimensions: {
    length: number
    width: number
    height: number
    weight: number
    quantity: number
  }) => void
}

export function EditableDimensions({
  length,
  width,
  height,
  weight,
  volume,
  volumeWeight,
  quantity,
  onSave
}: EditableDimensionsProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [tempLength, setTempLength] = React.useState(length.toString())
  const [tempWidth, setTempWidth] = React.useState(width.toString())
  const [tempHeight, setTempHeight] = React.useState(height.toString())
  const [tempWeight, setTempWeight] = React.useState(weight.toString())
  const [tempQuantity, setTempQuantity] = React.useState(quantity.toString())
  
  const handleEdit = () => {
    setTempLength(length.toString())
    setTempWidth(width.toString())
    setTempHeight(height.toString())
    setTempWeight(weight.toString())
    setTempQuantity(quantity.toString())
    setIsEditing(true)
  }
  
  const handleSave = () => {
    const newLength = parseFloat(tempLength)
    const newWidth = parseFloat(tempWidth)
    const newHeight = parseFloat(tempHeight)
    const newWeight = parseFloat(tempWeight)
    const newQuantity = parseInt(tempQuantity)
    
    if (!isNaN(newLength) && !isNaN(newWidth) && !isNaN(newHeight) && 
        !isNaN(newWeight) && !isNaN(newQuantity)) {
      onSave({
        length: newLength,
        width: newWidth,
        height: newHeight,
        weight: newWeight,
        quantity: newQuantity
      })
    }
    setIsEditing(false)
  }
  
  const handleCancel = () => {
    setIsEditing(false)
  }
  
  if (!isEditing) {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col text-sm">
          <span>长宽高: {length}×{width}×{height} cm</span>
          <span>重量: {weight} kg</span>
          <span>体积: {volume} cm³</span>
          <span>体积重: {volumeWeight} kg</span>
          <span>件数: {quantity} 件</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 ml-1 self-center"
          onClick={handleEdit}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </Button>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col space-y-2 max-w-[200px]">
      <div className="grid grid-cols-3 gap-1">
        <div>
          <label className="text-xs">长 (cm)</label>
          <input
            type="number"
            value={tempLength}
            onChange={(e) => setTempLength(e.target.value)}
            className="w-full h-7 px-2 border rounded text-sm"
            min="0"
          />
        </div>
        <div>
          <label className="text-xs">宽 (cm)</label>
          <input
            type="number"
            value={tempWidth}
            onChange={(e) => setTempWidth(e.target.value)}
            className="w-full h-7 px-2 border rounded text-sm"
            min="0"
          />
        </div>
        <div>
          <label className="text-xs">高 (cm)</label>
          <input
            type="number"
            value={tempHeight}
            onChange={(e) => setTempHeight(e.target.value)}
            className="w-full h-7 px-2 border rounded text-sm"
            min="0"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1">
        <div>
          <label className="text-xs">重量 (kg)</label>
          <input
            type="number"
            value={tempWeight}
            onChange={(e) => setTempWeight(e.target.value)}
            className="w-full h-7 px-2 border rounded text-sm"
            step="0.1"
            min="0"
          />
        </div>
        <div>
          <label className="text-xs">件数</label>
          <input
            type="number"
            value={tempQuantity}
            onChange={(e) => setTempQuantity(e.target.value)}
            className="w-full h-7 px-2 border rounded text-sm"
            min="1"
          />
        </div>
      </div>
      <div className="flex space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={handleSave}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={handleCancel}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </Button>
      </div>
    </div>
  )
}

// 可编辑的收件信息组件 - 使用组合框选择
interface EditableRecipientInfoProps {
  name: string
  phone: string
  address: string
  onSave: (info: {
    name: string
    phone: string
    address: string
  }) => void
  recipientOptions: ComboboxOption[]
}

export function EditableRecipientInfo({
  name,
  phone,
  address,
  onSave,
  recipientOptions
}: EditableRecipientInfoProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [selectedRecipient, setSelectedRecipient] = React.useState("")
  
  // 根据当前信息查找匹配的收件人选项
  React.useEffect(() => {
    const matchedOption = recipientOptions.find(
      option => {
        const [optName, optPhone] = option.label.split(' - ');
        return optName === name && optPhone === phone;
      }
    );
    
    if (matchedOption) {
      setSelectedRecipient(matchedOption.value);
    } else {
      setSelectedRecipient("");
    }
  }, [name, phone, recipientOptions]);
  
  const handleEdit = () => {
    setIsEditing(true)
  }
  
  const handleSave = () => {
    const selected = recipientOptions.find(opt => opt.value === selectedRecipient);
    if (selected) {
      // 解析选项中的名称和电话
      const [selectedName, selectedPhone] = selected.label.split(' - ');
      // 查找完整地址
      const selectedAddress = selected.description || address;
      
      onSave({
        name: selectedName,
        phone: selectedPhone,
        address: selectedAddress
      });
    }
    setIsEditing(false)
  }
  
  const handleCancel = () => {
    setIsEditing(false)
  }
  
  if (!isEditing) {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          <span className="text-sm">{phone}</span>
          <span className="text-sm text-gray-500 truncate max-w-[150px]" title={address}>
            {address}
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 ml-1 self-center"
          onClick={handleEdit}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </Button>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col space-y-2 max-w-[250px]">
      <div className="relative">
        <label className="text-xs">收件人</label>
        <Combobox
          options={recipientOptions}
          value={selectedRecipient}
          onChange={setSelectedRecipient}
          placeholder="选择收件人"
          emptyMessage="没有找到收件人"
          popoverClassName="w-[300px]"
          triggerClassName="bg-white"
        />
      </div>
      <div className="flex space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={handleSave}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={handleCancel}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </Button>
      </div>
    </div>
  )
}