import { useState } from "react"
import { BANKS } from "@/data/mockData"
import { BankTag, BankTagMore } from "@/components/common/BankTag"
import { BankSelectorPopup } from "@/components/common/BankSelectorPopup"

export function BankSelectionSection({ selectedBanks, onToggleBank }) {
  const [popupOpen, setPopupOpen] = useState(false)
  const visibleBanks = BANKS.slice(0, 6)

  return (
    <section className="bank-selection">
      <h3 className="bank-selection__title">Ngân hàng</h3>
      <p className="bank-selection__desc">Chọn ngân hàng bạn đang dùng</p>
      <div className="bank-selection__tags">
        {visibleBanks.map((bank) => (
          <BankTag
            key={bank.code}
            bank={bank}
            isActive={selectedBanks.includes(bank.code)}
            onClick={() => onToggleBank(bank.code)}
          />
        ))}
        <BankTagMore
          count={BANKS.length - visibleBanks.length}
          onClick={() => setPopupOpen(true)}
        />
      </div>

      <BankSelectorPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onSelectBank={(bank) => onToggleBank(bank.code)}
      />
    </section>
  )
}
