import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package } from "lucide-react";

// 装载管理主页面
export default function LoadingManagementPage() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold mb-6">装载管理</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 码板装车卡片 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-6 w-6" />
              码板装车
            </CardTitle>
            <CardDescription>
              管理货板、装板和待码货品，进行码板装车操作
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              通过货板区域新增码板，从而让装板区域可以装入待码区域的数据。支持新增货板、货板装车、卸车等操作。
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/loading/pallet-loading")} className="w-full">
              进入码板装车
            </Button>
          </CardFooter>
        </Card>

        {/* 车次管理卡片 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="mr-2 h-6 w-6" />
              车次管理
            </CardTitle>
            <CardDescription>
              管理车辆、车次和装载情况
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              查看和管理车辆信息、装载状态、发车和到达时间等。支持车辆调度、装载规划和路线安排。
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/loading/vehicle-management")} className="w-full">
              进入车次管理
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}