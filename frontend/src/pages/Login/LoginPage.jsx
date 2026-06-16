import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import { apiClient } from "../../services/apiClient"

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const reason = sessionStorage.getItem("logout_reason")
    if (reason === "expired") {
      setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")
      sessionStorage.removeItem("logout_reason")
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // apiClient.post '/auth/login' sẽ tự động format dạng form-urlencoded cho FastAPI OAuth2
      const response = await apiClient.post("/auth/login", {
        username: email,
        password: password,
      })

      if (response?.data?.access_token) {
        // Đăng nhập thành công, điều hướng về trang chủ
        navigate("/")
      } else {
        setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.")
      }
    } catch (err) {
      console.error("Login Error:", err)
      setError(err?.message || "Email hoặc mật khẩu không chính xác.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none animate-pulse duration-4000" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none animate-pulse duration-6000" />

      {/* Login Card */}
      <div className="w-full max-w-md px-6 py-8 mx-4 z-10">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl shadow-black/40">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-xl mb-4 shadow-lg shadow-blue-500/20">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Chào mừng trở lại</h1>
            <p className="text-slate-400 text-sm mt-2">
              Quản lý tài chính cá nhân thông minh & tối ưu
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-shake">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Địa chỉ Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors duration-200">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Mật khẩu
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors duration-150"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors duration-200">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-3 bg-slate-950/50 border border-slate-800/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-150 disabled:opacity-75 disabled:cursor-not-allowed disabled:active:scale-100 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center border-t border-slate-800/50 pt-6">
            <p className="text-slate-400 text-sm">
              Chưa có tài khoản?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-150"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
