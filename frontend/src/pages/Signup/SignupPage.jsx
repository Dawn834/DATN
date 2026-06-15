import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Mail, Lock, User, ShieldCheck, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { apiClient } from "../../services/apiClient"

export function SignupPage() {
  const navigate = useNavigate()

  // Step: "register" | "otp" | "success"
  const [step, setStep] = useState("register")

  // Form values
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [otpCode, setOtpCode] = useState("")

  // States
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  // Handle Step 1: Register User
  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    if (!email || !firstName || !lastName || !password) {
      setError("Vui lòng điền đầy đủ các thông tin bắt buộc.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await apiClient.post("/auth/register/user", {
        email,
        first_name: firstName,
        last_name: lastName,
        password,
      })

      // Đăng ký thành công, chuyển sang bước nhập OTP
      setStep("otp")
      setSuccessMsg(`Mã OTP đã được gửi đến email ${email}. Vui lòng kiểm tra hòm thư để nhận mã OTP.`)
    } catch (err) {
      console.error("Register Error:", err)
      setError(err?.message || "Đăng ký không thành công. Email này có thể đã được sử dụng.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    if (!otpCode || otpCode.length !== 6) {
      setError("Mã OTP phải gồm đúng 6 chữ số.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Backend api: POST /auth/verify-user?email=...&otp_code=...
      const url = `/auth/verify-user?email=${encodeURIComponent(email)}&otp_code=${encodeURIComponent(otpCode)}`
      await apiClient.post(url, {})

      // Xác thực thành công
      setStep("success")
      setSuccessMsg("Tài khoản của bạn đã được kích hoạt thành công!")

      // Tự động redirect về login sau 3 giây
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (err) {
      console.error("OTP Verification Error:", err)
      setError(err?.message || "Mã OTP không chính xác hoặc đã hết hạn.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Step 2.5: Resend OTP
  const handleResendOtp = async () => {
    setIsLoading(true)
    setError("")
    setSuccessMsg("")

    try {
      await apiClient.post("/auth/register/user", {
        email,
        first_name: firstName,
        last_name: lastName,
        password,
      })
      setSuccessMsg("Mã OTP mới đã được gửi lại vào email của bạn.")
    } catch (err) {
      console.error("Resend OTP error:", err)
      setError(err?.message || "Không thể gửi lại mã OTP. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none animate-pulse duration-4000" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none animate-pulse duration-6000" />

      {/* Card Wrapper */}
      <div className="w-full max-w-md px-6 py-8 mx-4 z-10">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl shadow-black/40">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-xl mb-4 shadow-lg shadow-blue-500/20">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>

            {step === "register" && (
              <>
                <h1 className="text-2xl font-bold text-white tracking-tight">Tạo tài khoản mới</h1>
                <p className="text-slate-400 text-sm mt-2">Bắt đầu kế hoạch tiết kiệm của riêng bạn</p>
              </>
            )}
            {step === "otp" && (
              <>
                <h1 className="text-2xl font-bold text-white tracking-tight">Xác thực OTP</h1>
                <p className="text-slate-400 text-sm mt-2">Nhập mã xác thực để kích hoạt tài khoản</p>
              </>
            )}
            {step === "success" && (
              <>
                <h1 className="text-2xl font-bold text-white tracking-tight">Đăng ký hoàn tất</h1>
                <p className="text-slate-400 text-sm mt-2">Đang chuyển bạn về trang đăng nhập...</p>
              </>
            )}
          </div>

          {/* Success Message Alert */}
          {successMsg && step !== "success" && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Message Alert */}
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-shake">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Registration Form */}
          {step === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">

              {/* Names (Grid) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="lastName" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Họ
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                      <User size={16} />
                    </div>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Nguyễn"
                      required
                      disabled={isLoading}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950/50 border border-slate-800/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="firstName" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Tên
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                      <User size={16} />
                    </div>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Văn An"
                      required
                      disabled={isLoading}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950/50 border border-slate-800/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Địa chỉ Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                    <Mail size={16} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    required
                    disabled={isLoading}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950/50 border border-slate-800/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Mật khẩu
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 8 ký tự, có chữ hoa, thường"
                    required
                    minLength={8}
                    disabled={isLoading}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950/50 border border-slate-800/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-75 disabled:cursor-not-allowed disabled:active:scale-100 mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng ký</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Form */}
          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="space-y-2 text-center">
                <label htmlFor="otpCode" className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Nhập mã OTP gồm 6 chữ số
                </label>
                <div className="relative group max-w-[240px] mx-auto mt-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                    <ShieldCheck size={18} />
                  </div>
                  <input
                    id="otpCode"
                    type="text"
                    maxLength={6}
                    pattern="\d{6}"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800/80 rounded-xl text-white text-center text-lg font-bold tracking-[0.4em] placeholder:tracking-normal placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                  />
                </div>
                <p className="text-slate-500 text-xs mt-2">
                  *Mã OTP có giá trị trong vòng 5 phút
                </p>
                <div className="mt-3">
                  <span className="text-slate-400 text-xs">Không nhận được mã? </span>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-colors bg-none border-none p-0 inline cursor-pointer"
                  >
                    Gửi lại mã OTP
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setStep("register")}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-slate-900 border border-slate-800 text-slate-300 font-medium rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all text-sm disabled:opacity-50"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all text-sm disabled:opacity-75"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <span>Xác thực tài khoản</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Success Screen */}
          {step === "success" && (
            <div className="text-center py-6 space-y-4">
              <div className="inline-flex p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 animate-bounce">
                <CheckCircle2 size={48} />
              </div>
              <p className="text-slate-300 font-medium text-lg">
                Chúc mừng! Tài khoản của bạn đã được kích hoạt thành công.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all"
              >
                Đến trang Đăng nhập ngay
              </button>
            </div>
          )}

          {/* Login link footer */}
          {step === "register" && (
            <div className="mt-8 text-center border-t border-slate-800/50 pt-6">
              <p className="text-slate-400 text-sm">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-150"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
