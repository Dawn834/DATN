import { useState } from "react"
import { StepHeader } from "@/components/common/StepHeader"
import { BANKS } from "@/data/mockData"
import { BankSelectorPopup } from "@/components/common/BankSelectorPopup"

export function BankSelectionSection({ selectedBanks, onToggleBank }) {
  const [popupOpen, setPopupOpen] = useState(false)
  const visibleBanks = BANKS.slice(0, 8)

  return (
    <section className="bank-selection">
      <StepHeader
        step={3}
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
