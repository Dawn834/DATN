import { Search, Bell } from "lucide-react"
import "./Header.scss"

export function Header() {
  return (
    <header className="header">
      <div className="header__search">
        <Search className="header__search-icon" />
        <input
          type="text"
          className="header__search-input"
          placeholder="Tìm kiếm ngân hàng, khoản gửi..."
        />
      </div>

      <div className="header__actions">
        <button className="header__notification">
          <Bell size={20} />
          <span className="header__notification-dot" />
        </button>

        <div className="header__user">
          <div className="header__user-info">
            <div className="header__user-name">Nguyễn Văn A</div>
            <div className="header__user-role">Premium Member</div>
          </div>
          <div className="header__user-avatar">N</div>
        </div>
      </div>
    </header>
  )
}
