import { useState, useEffect } from "react"
import { Shield, Mail, Key, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { apiClient } from "../../services/apiClient"
import "./SettingsPage.scss"

export function SettingsPage() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("datn_current_user")
    return savedUser ? JSON.parse(savedUser) : null
  })
  
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  // OTP flow states
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [otpError, setOtpError] = useState("")

  useEffect(() => {
    async function fetchProfile() {
      setLoadingProfile(true)
      try {
        const response = await apiClient.get("/auth/me")
        if (response?.data) {
          setUser(response.data)
          localStorage.setItem("datn_current_user", JSON.stringify(response.data))
        }
      } catch (err) {
        console.error("Failed to load user profile:", err)
      } finally {
        setLoadingProfile(false)
      }
    }
    fetchProfile()
  }, [])

  const handleRequestChange = async (e) => {
    e.preventDefault()
    if (!newPassword || !confirmPassword) {
      setError("Vui lòng điền đầy đủ các thông tin.")
      return
    }
    if (newPassword.length < 8) {
      setError("Mật khẩu mới phải có tối thiểu 8 ký tự.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // API call to POST /auth/change-password/request
      await apiClient.post("/auth/change-password/request", {
        new_password: newPassword
      })

      // Show OTP modal
      setShowOtpModal(true)
      setOtpError("")
      setSuccess(`Mã xác thực OTP đã được gửi đến email của bạn. Vui lòng nhập mã để hoàn tất đổi mật khẩu.`)
    } catch (err) {
      console.error("Request change password error:", err)
      setError(err?.message || "Không thể thực hiện yêu cầu đổi mật khẩu. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otpCode || otpCode.length !== 6) {
      setOtpError("Mã OTP phải gồm 6 chữ số.")
      return
    }

    setIsLoading(true)
    setOtpError("")

    try {
      // API call to POST /auth/change-password/verify
      await apiClient.post("/auth/change-password/verify", {
        otp_code: otpCode
      })

      // Success
      setSuccess("Đổi mật khẩu thành công!")
      setNewPassword("")
      setConfirmPassword("")
      setOtpCode("")
      setShowOtpModal(false)
    } catch (err) {
      console.error("Verify OTP error:", err)
      setOtpError(err?.message || "Mã xác thực OTP không hợp lệ hoặc đã hết hạn.")
    } finally {
      setIsLoading(false)
    }
  }

  const getDisplayName = () => {
    if (!user) return "Người dùng"
    if (user.last_name && user.first_name) {
      return `${user.last_name} ${user.first_name}`
    }
    return user.fullName || user.username || user.email || "Người dùng"
  }

  const getRoleDisplay = () => {
    if (!user) return "Thành viên"
    if (user.is_superuser) return "Quản trị viên cấp cao"
    
    if (user.user_roles && user.user_roles.length > 0) {
      return user.user_roles.map(ur => ur.role?.description || ur.role?.name).join(", ")
    }
    return user.role || "Thành viên"
  }

  const getAvatarLetter = () => {
    const name = user?.first_name || user?.fullName || user?.username || user?.email || "U"
    return name.charAt(0).toUpperCase()
  }

  return (
    <div className="settings-page">
      <div className="settings-page__header">
        <h1 className="settings-page__title">⚙️ Cài đặt tài khoản</h1>
        <p className="settings-page__subtitle">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
      </div>

      {success && (
        <div className="settings-page__alert settings-page__alert--success">
          <CheckCircle2 size={20} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="settings-page__alert settings-page__alert--error animate-shake">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="settings-page__grid">
        {/* Profile Card */}
        <div className="settings-page__card settings-page__card--profile">
          <div className="settings-page__profile-hero">
            <div className="settings-page__profile-avatar">{getAvatarLetter()}</div>
            <h3 className="settings-page__profile-name">{getDisplayName()}</h3>
            <span className="settings-page__profile-badge">{getRoleDisplay()}</span>
          </div>

          <div className="settings-page__profile-details">
            <div className="settings-page__detail-item">
              <Mail size={16} className="settings-page__detail-icon" />
              <div className="settings-page__detail-info">
                <span className="settings-page__detail-label">Email tài khoản</span>
                <span className="settings-page__detail-value">{user?.email || "Chưa cập nhật"}</span>
              </div>
            </div>
            <div className="settings-page__detail-item">
              <Shield size={16} className="settings-page__detail-icon" />
              <div className="settings-page__detail-info">
                <span className="settings-page__detail-label">Trạng thái xác thực</span>
                <span className="settings-page__detail-value text-emerald-600 font-medium">
                  {user?.is_active ? "Đã kích hoạt" : "Chưa xác thực"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="settings-page__card settings-page__card--security">
          <h3 className="settings-page__card-title">
            <Key size={18} />
            Thay đổi mật khẩu
          </h3>
          <p className="settings-page__card-desc">
            Để đảm bảo bảo mật, vui lòng chọn mật khẩu mạnh có chứa tối thiểu 8 ký tự, bao gồm cả chữ hoa, chữ thường và chữ số.
          </p>

          <form onSubmit={handleRequestChange} className="settings-page__form">
            <div className="settings-page__form-group">
              <label htmlFor="newPassword">Mật khẩu mới</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                required
                disabled={isLoading}
              />
            </div>
            <div className="settings-page__form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className="settings-page__btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <span>Đổi mật khẩu</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="settings-page__modal-overlay">
          <div className="settings-page__modal">
            <div className="settings-page__modal-header">
              <ShieldCheck size={36} className="settings-page__modal-icon" />
              <h3>Xác minh OTP</h3>
              <p>Mã xác thực OTP đã được gửi đến email <strong>{user?.email}</strong>. Vui lòng nhập mã OTP để xác nhận đổi mật khẩu.</p>
            </div>
            <form onSubmit={handleVerifyOtp} className="settings-page__modal-form">
              {otpError && (
                <div className="settings-page__modal-error">
                  <AlertCircle size={16} />
                  <span>{otpError}</span>
                </div>
              )}
              <input
                type="text"
                maxLength={6}
                pattern="\d{6}"
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                required
                disabled={isLoading}
                className="settings-page__otp-input"
              />
              <div className="settings-page__modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpModal(false)
                    setSuccess("")
                    setError("")
                    setOtpError("")
                  }}
                  className="settings-page__modal-btn settings-page__modal-btn--cancel"
                  disabled={isLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="settings-page__modal-btn settings-page__modal-btn--confirm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <span>Xác nhận</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
