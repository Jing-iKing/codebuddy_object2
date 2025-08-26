import React from 'react';
import {
  Ship,
  Building,
  Globe,
  MapPin,
  Car,
  Truck,
  Package,
  Plane,
  Flag,
  Clock,
  Store,
  Boxes,
  Landmark,
  LucideIcon,
  LucideProps
} from 'lucide-react';

// 图标名称到组件的映射
const iconMap: Record<string, React.FC<LucideProps>> = {
  Ship,
  Building,
  Globe,
  MapPin,
  Car,
  Truck,
  Package,
  Plane,
  Flag,
  Clock,
  Store,
  Boxes,
  Landmark
};

// 根据图标名称获取图标组件
export const getIconByName = (iconName: string, props?: LucideProps): React.ReactNode => {
  const IconComponent = iconMap[iconName];
  
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in icon map`);
    return null;
  }
  
  return <IconComponent {...props} />;
};