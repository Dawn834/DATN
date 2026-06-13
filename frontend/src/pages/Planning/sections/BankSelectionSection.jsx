import { useState, useEffect } from "react"
import { StepHeader } from "@/components/common/StepHeader"
import { bankService } from "@/services/bankService"
import { BankSelectorPopup } from "@/components/common/BankSelectorPopup"

export function BankSelectionSection({ selectedBanks, onToggleBank }) {
  const [popupOpen, setPopupOpen] = useState(false)
  const [banks, setBanks] = useState([])

  // Fetch danh sách ngân hàng từ API
  useEffect(() => {
    async function loadBanks() {
      try {
        const data = await bankService.getBanks()
        setBanks(data)
      } catch (err) {
        console.error("Lỗi khi tải ngân hàng:", err)
      }
    }
    loadBanks()
  }, [])

  const visibleBanks = banks.slice(0, 8)

  return (
    <section className="bank-selection">
      <StepHeader
        step={4}
        title="Ngân hàng ưu tiên"
        subtitle="Sổ chọn tốt có + tự động tìm tốt nhất"
      />
      <div className="bank-selection__grid">
        {visibleBanks.map((bank) => {
          const isSelected = selectedBanks.includes(bank.code)
          return (
            <label key={bank.code} className={`bank-selection__item ${isSelected ? "bank-selection__item--selected" : ""}`}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleBank(bank.code)}
                className="bank-selection__checkbox"
              />
              <span className="bank-selection__dot" style={{ background: bank.color }} />
              <span className="bank-selection__name">{bank.name}</span>
            </label>
          )
        })}
      </div>
      <button className="bank-selection__more" onClick={() => setPopupOpen(true)}>
        Tự động tối ưu
      </button>

      <BankSelectorPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onSelectBank={(bank) => onToggleBank(bank.code)}
      />
    </section>
  )
}
