import { useState } from "react"
import { Search, X } from "lucide-react"
import { BANKS } from "@/data/mockData"
import "./BankSelectorPopup.scss"

export function BankSelectorPopup({ isOpen, onClose, onSelectBank }) {
  const [search, setSearch] = useState("")

  if (!isOpen) return null

  const filteredBanks = BANKS.filter(
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
          {filteredBanks.map((bank) => (
            <button
              key={bank.code}
              className="bank-popup__item"
              onClick={() => handleSelect(bank)}
            >
              <div
                className="bank-popup__item-logo"
                style={{ background: bank.color }}
              >
                {bank.code.substring(0, 3)}
              </div>
              <div className="bank-popup__item-info">
                <div className="bank-popup__item-code">{bank.code}</div>
                <div className="bank-popup__item-name">{bank.name}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
