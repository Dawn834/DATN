import { Link, useLocation } from "react-router-dom"
import { Home, Target, PieChart, LogOut } from "lucide-react"
import "./Sidebar.scss"

const navItems = [
  { title: "Tra cứu lãi suất", icon: Home, path: "/" },
  { title: "Lập kế hoạch", icon: Target, path: "/planning" },
  { title: "Quản lý tài chính", icon: PieChart, path: "/management" },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">F</div>
        <span className="sidebar__logo-text">FinRate</span>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
            >
              <item.icon className="sidebar__link-icon" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>

      <div className="sidebar__bottom">
        <button className="sidebar__logout">
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}
