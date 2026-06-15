import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Mail, Lock, ShieldCheck, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { apiClient } from "../../services/apiClient"

export function ForgotPasswordPage() {
  const navigate = useNavigate()

  // Step: "request" | "verify" | "success"
  const [step, setStep] = useState("request")

  // Form values
  const [email, setEmail] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // States
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  // Handle Step 1: Request OTP for password reset
  const handleRequestSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError("Vui lòng nhập email.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // API call to /auth/forgot-password?email=...
      const url = `/auth/forgot-password?email=${encodeURIComponent(email)}`
      await apiClient.post(url, {})

      // Success, move to verify step
      setStep("verify")
      setSuccessMsg(`Mã OTP đã được gửi đến email ${email}. Vui lòng kiểm tra hộp thư để nhận mã OTP.`)
    } catch (err) {
      console.error("Forgot password request error:", err)
      setError(err?.message || "Yêu cầu khôi phục mật khẩu không thành công. Vui lòng kiểm tra lại email.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Step 2: Verify OTP and reset password
  const handleResetSubmit = async (e) => {
    e.preventDefault()
    if (!otpCode || otpCode.length !== 6) {
      setError("Mã OTP phải gồm đúng 6 chữ số.")
      return
    }
    if (newPassword.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // API call to /auth/verify-reset-password?email=...&otp_code=...&newpassword=...
      const url = `/auth/verify-reset-password?email=${encodeURIComponent(email)}&otp_code=${encodeURIComponent(otpCode)}&newpassword=${encodeURIComponent(newPassword)}`
      await apiClient.post(url, {})

      // Reset success
      setStep("success")
      setSuccessMsg("Mật khẩu của bạn đã được thay đổi thành công!")

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (err) {
      console.error("Reset password verification error:", err)
      setError(err?.message || "Mã OTP không chính xác hoặc mật khẩu không hợp lệ.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Step 2.5: Resend OTP for forgot password
  const handleResendOtp = async () => {
    setIsLoading(true)
    setError("")
    setSuccessMsg("")

    try {
      const url = `/auth/forgot-password?email=${encodeURIComponent(email)}`
      await apiClient.post(url, {})
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
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            
            {step === "request" && (
              <>
                <h1 className="text-2xl font-bold text-white tracking-tight">Quên mật khẩu</h1>
                <p className="text-slate-400 text-sm mt-2">Nhập email của bạn để nhận mã xác thực OTP</p>
              </>
            )}
            {step === "verify" && (
              <>
                <h1 className="text-2xl font-bold text-white tracking-tight">Đặt lại mật khẩu</h1>
                <p className="text-slate-400 text-sm mt-2">Nhập mã OTP và mật khẩu mới của bạn</p>
              </>
            )}
            {step === "success" && (
              <>
                <h1 className="text-2xl font-bold text-white tracking-tight">Đặt lại thành công</h1>
                <p className="text-slate-400 text-sm mt-2">Đang chuyển hướng về trang đăng nhập...</p>
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

          {/* Step 1: Email Form */}
          {step === "request" && (
            <form onSubmit={handleRequestSubmit} className="space-y-4">
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-75 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Đang gửi mã...</span>
                  </>
                ) : (
                  <>
                    <span>Gửi mã OTP</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP & Reset Password Form */}
          {step === "verify" && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              {/* OTP Code */}
              <div className="space-y-1.5">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-800/80 rounded-xl text-white text-center text-lg font-bold tracking-[0.4em] placeholder:tracking-normal placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                  />
                </div>
                <div className="mt-3 text-center">
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

              {/* New Password */}
              <div className="space-y-1.5">
                <label htmlFor="newPassword" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Mật khẩu mới
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 8 ký tự, có chữ hoa, thường"
                    required
                    minLength={8}
                    disabled={isLoading}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950/50 border border-slate-800/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    required
                    disabled={isLoading}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950/50 border border-slate-800/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep("request")}
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 bg-slate-900 border border-slate-800 text-slate-300 font-medium rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all text-sm disabled:opacity-50"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all text-sm disabled:opacity-75"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <span>Đặt lại mật khẩu</span>
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
                Chúc mừng! Mật khẩu của bạn đã được thay đổi thành công.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all"
              >
                Đăng nhập ngay
              </button>
            </div>
          )}

          {/* Footer link back to Login */}
          {step === "request" && (
            <div className="mt-8 text-center border-t border-slate-800/50 pt-6">
              <p className="text-slate-400 text-sm">
                Nhớ ra mật khẩu?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-150"
                >
                  Quay lại đăng nhập
                </Link>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
