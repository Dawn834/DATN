import { Link, useLocation, useNavigate } from "react-router-dom"
import { TrendingUp, Target, PieChart, Settings, LogOut, LogIn } from "lucide-react"
import "./Sidebar.scss"

const navItems = [
  { title: "Lãi suất ngân hàng", icon: TrendingUp, path: "/" },
  { title: "Lập kế hoạch mục tiêu", icon: Target, path: "/planning" },
  { title: "Quản lý tài chính", icon: PieChart, path: "/management" },
  { title: "Cài đặt tài khoản", icon: Settings, path: "/settings" },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const isLoggedIn = !!localStorage.getItem("datn_token")

  const handleLogout = () => {
    localStorage.removeItem("datn_token")
    localStorage.removeItem("datn_refresh_token")
    localStorage.removeItem("datn_current_user")
    navigate("/login")
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <div className="sidebar__logo-content">
          {/* <span className="sidebar__logo-text">TiếtKiệm</span> */}
          <span className="sidebar__logo-text">SMART SAVING</span>
        </div>
      </div>

      <div className="sidebar__section-label">TÍNH NĂNG CHÍNH</div>

      <nav className="sidebar__nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
            >
              {isActive && <span className="sidebar__link-indicator" />}
              <item.icon className="sidebar__link-icon" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>

      <div className="sidebar__bottom">
        {isLoggedIn ? (
          <button className="sidebar__logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        ) : (
          <button className="sidebar__logout" onClick={() => navigate("/login")}>
            <LogIn size={18} />
            <span>Đăng nhập</span>
          </button>
        )}
      </div>
    </aside>
  )
}
