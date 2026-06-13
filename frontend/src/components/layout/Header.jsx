import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Bell } from "lucide-react"
import { apiClient } from "../../services/apiClient"
import "./Header.scss"

export function Header() {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("datn_current_user")
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("datn_token")
    if (!token) {
      setUser(null)
      return
    }

    async function fetchUserProfile() {
      try {
        const response = await apiClient.get("/auth/me")
        if (response?.data) {
          const userData = response.data
          setUser(userData)
          // Cập nhật lại vào localStorage để đồng bộ dữ liệu mới nhất từ DB
          localStorage.setItem("datn_current_user", JSON.stringify(userData))
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error)
      }
    }

    fetchUserProfile()
  }, [])

  // Debounced search API request
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setShowResults(false)
      return
    }

    setLoading(true)
    setShowResults(true)

    const handler = setTimeout(async () => {
      try {
        const response = await apiClient.get(`/banks/search?name=${encodeURIComponent(query)}&code=${encodeURIComponent(query)}`)
        if (response?.data) {
          setResults(response.data)
        }
      } catch (err) {
        console.error("Search API error:", err)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(handler)
  }, [query])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".header__search")) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelectBank = (bank) => {
    setShowResults(false)
    setQuery("")
    navigate(`/?bankId=${bank.id}`)
  }

  // Tạo hiển thị tên và chữ cái đầu cho avatar
  const getDisplayName = () => {
    if (!user) return "Khách"
    if (user.last_name && user.first_name) {
      return `${user.last_name} ${user.first_name}`
    }
    return user.fullName || user.username || user.email || "Người dùng"
  }

  const getAvatarLetter = () => {
    if (!user) return "K"
    const name = user.first_name || user.fullName || user.username || user.email || "U"
    return name.charAt(0).toUpperCase()
  }

  return (
    <header className="header">
      <div className="header__search">
        <Search className="header__search-icon" />
        <input
          type="text"
          className="header__search-input"
          placeholder="Tìm ngân hàng..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim()) setShowResults(true)
          }}
        />

        {showResults && (
          <div className="header__search-results">
            {loading ? (
              <div className="header__search-empty">Đang tìm kiếm...</div>
            ) : results.length > 0 ? (
              results.map((bank) => (
                <button
                  key={bank.id}
                  className="header__search-item"
                  onClick={() => handleSelectBank(bank)}
                >
                  <div
                    className="header__search-item-logo"
                    style={{ background: bank.color || "#1A73E8" }}
                  >
                    {bank.code}
                  </div>
                  <div className="header__search-item-info">
                    <span className="header__search-item-name">{bank.name}</span>
                    <span className="header__search-item-fullName">
                      {bank.fullName || bank.name}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="header__search-empty">Không tìm thấy ngân hàng nào</div>
            )}
          </div>
        )}
      </div>

      <div className="header__actions">
        <button className="header__notification">
          <Bell size={20} />
          <span className="header__notification-dot" />
        </button>

        <div className="header__user">
          <div className="header__user-avatar">{getAvatarLetter()}</div>
          <div className="header__user-info">
            <div className="header__user-name">{getDisplayName()}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
