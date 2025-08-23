import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { login, selectAuthLoading, selectAuthError, clearError } from '@/store/slices/auth-slice'
import { AppDispatch } from '@/store'
import { AlertCircle, Package } from 'lucide-react'
import wechatIcon from '@/assets/images/wechat.svg'
import enterpriseWechatIcon from '@/assets/images/wecom.svg'
import logisticsImage from '../../assets/images/logistics.jpeg'
import backImage from '../../assets/images/back-img.png'

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const loading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  // 获取重定向路径
  const from = location.state?.from?.pathname || '/'
  
  // 处理登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password) {
      return
    }
    
    // 清除之前的错误
    dispatch(clearError())
    
    // 调用登录 action
    const resultAction = await dispatch(login({ username, password }))
    
    // 如果登录成功，重定向到之前的页面
    if (login.fulfilled.match(resultAction)) {
      navigate(from, { replace: true })
    }
  }
  
  return (
    <div 
      className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative" 
      style={{ 
        backgroundImage: `url(${backImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="flex flex-col gap-6 w-full max-w-3xl">
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center mb-2">
                    <Package className="h-8 w-8 mr-2" />
                    <h1 className="text-2xl font-bold">订单管理系统</h1>
                  </div>
                  <p className="text-balance text-muted-foreground">
                    请输入您的用户名和密码登录系统
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="username">用户名</Label>
                  <Input
                    id="username"
                    placeholder="请输入用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">密码</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      忘记密码?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-800"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white"></span>
                      登录中...
                    </>
                  ) : (
                    '登录'
                  )}
                </Button>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    或使用以下方式登录
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">
                    <img src={wechatIcon} alt="微信" className="h-5 w-5" />
                    <span className="sr-only">使用微信登录</span>
                  </Button>
                  <Button variant="outline" className="w-full">
                    <img src={enterpriseWechatIcon} alt="企业微信" className="h-5 w-5" />
                    <span className="sr-only">使用企业微信登录</span>
                  </Button>
                </div>

              </div>
            </form>
            <div className="relative hidden bg-muted md:block">
              <img
                src={logisticsImage}
                alt="物流运输图片"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30">
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          点击登录，即表示您同意我们的 <a href="#">服务条款</a>{" "}
          和 <a href="#">隐私政策</a>。
        </div>
      </div>
    </div>
  )
}