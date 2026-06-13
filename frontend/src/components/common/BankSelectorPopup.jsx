import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { bankService } from "@/services/bankService"
import "./BankSelectorPopup.scss"

// Subcomponent to handle individual logo error states safely
function BankLogo({ bank }) {
  const [imgError, setImgError] = useState(false)
  const [suffixIndex, setSuffixIndex] = useState(0)

  // Các hậu tố phổ biến của tên file logo ngân hàng
  const suffixes = ["", "bank", "vn"]
  const baseCode = bank.code?.toLowerCase().replace(/[^a-z0-9]/g, "") || ""
  const logoUrl = `/logos/${baseCode}${suffixes[suffixIndex]}.png`

  const handleError = () => {
    // Nếu chưa thử hết các hậu tố, chuyển sang thử hậu tố tiếp theo
    if (suffixIndex < suffixes.length - 1) {
      setSuffixIndex((prev) => prev + 1)
    } else {
      // Nếu đã thử hết mà vẫn lỗi, hiện text fallback
      setImgError(true)
    }
  }

  // Reset trạng thái khi ngân hàng thay đổi
  useEffect(() => {
    setImgError(false)
    setSuffixIndex(0)
  }, [bank.code])

  return (
    <div
      className="bank-popup__item-logo"
      style={{
        background: imgError ? bank.color : "#ffffff",
        padding: imgError ? "0" : "4px",
        border: imgError ? "none" : "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
      }}
    >
      {!imgError && bank.code ? (
        <img
          src={logoUrl}
          alt={bank.name}
          onError={handleError}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      ) : (
        bank.code.substring(0, 3)
      )}
    </div>
  )
}

export function BankSelectorPopup({ isOpen, onClose, onSelectBank }) {
  const [search, setSearch] = useState("")
  const [banks, setBanks] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch danh sách ngân hàng từ API khi popup mở
  useEffect(() => {
    if (!isOpen) return
    async function loadBanks() {
      try {
        setLoading(true)
        const data = await bankService.getBanks()
        setBanks(data)
      } catch (err) {
        console.error("Lỗi khi tải danh sách ngân hàng:", err)
      } finally {
        setLoading(false)
      }
    }
    loadBanks()
  }, [isOpen])

  if (!isOpen) return null

  const filteredBanks = banks.filter(
    (bank) =>
      bank.name.toLowerCase().includes(search.toLowerCase()) ||
      bank.code.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (bank) => {
    onSelectBank(bank)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="fixed inset-0 bg-black/40" />
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: "#1E293B" }}>Chọn Ngân Hàng</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="bank-popup__search">
          <Search className="bank-popup__search-icon" />
          <input
            placeholder="Tìm theo tên hoặc mã ngân hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bank-popup__grid">
          {loading ? (
            <div style={{ textAlign: "center", padding: "20px", color: "#64748B" }}>
              Đang tải danh sách ngân hàng...
            </div>
          ) : (
            filteredBanks.map((bank) => (
              <button
                key={bank.code}
                className="bank-popup__item"
                onClick={() => handleSelect(bank)}
              >
                <BankLogo bank={bank} />
                <div className="bank-popup__item-info">
                  <div className="bank-popup__item-code">{bank.code}</div>
                  <div className="bank-popup__item-name">{bank.name}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
