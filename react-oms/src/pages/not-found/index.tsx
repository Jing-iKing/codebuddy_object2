import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-9xl font-bold text-gray-900">404</h1>
      <h2 className="text-3xl font-semibold mt-4 mb-6">页面未找到</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        您访问的页面不存在或已被移除。请检查URL是否正确，或返回首页。
      </p>
      <Button asChild className="bg-black hover:bg-gray-800">
        <Link to="/">返回首页</Link>
      </Button>
    </div>
  )
}