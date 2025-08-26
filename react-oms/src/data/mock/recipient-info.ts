// 收件人信息数据
export interface RecipientInfo {
  id: string;
  name: string;
  phone: string;
  address: string;
}

export const mockRecipientInfoList: RecipientInfo[] = [
  {
    id: "rec-001",
    name: "张三",
    phone: "13812345678",
    address: "上海市浦东新区张杨路500号"
  },
  {
    id: "rec-002",
    name: "李四",
    phone: "13987654321",
    address: "北京市海淀区中关村南大街5号"
  },
  {
    id: "rec-003",
    name: "王五",
    phone: "13567891234",
    address: "广州市天河区天河路385号"
  },
  {
    id: "rec-004",
    name: "赵六",
    phone: "13456789012",
    address: "深圳市南山区科技园路1号"
  },
  {
    id: "rec-005",
    name: "钱七",
    phone: "13345678901",
    address: "杭州市西湖区文三路478号"
  },
  {
    id: "rec-006",
    name: "孙八",
    phone: "13234567890",
    address: "成都市武侯区人民南路四段12号"
  },
  {
    id: "rec-007",
    name: "周九",
    phone: "13123456789",
    address: "武汉市江汉区解放大道688号"
  },
  {
    id: "rec-008",
    name: "吴十",
    phone: "13012345678",
    address: "南京市鼓楼区中山北路123号"
  },
  {
    id: "rec-009",
    name: "郑十一",
    phone: "13112345678",
    address: "重庆市渝中区解放碑步行街88号"
  },
  {
    id: "rec-010",
    name: "王十二",
    phone: "13212345678",
    address: "西安市雁塔区高新路25号"
  }
];