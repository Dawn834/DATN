import { useState } from "react"
import { Share2 } from "lucide-react"
import { BankTag, BankTagMore } from "@/components/common/BankTag"
import { BankSelectorPopup } from "@/components/common/BankSelectorPopup"

const VISIBLE_COUNT = 5

export function BankInfoSection({ banks, activeBank, onBankChange }) {
  const [popupOpen, setPopupOpen] = useState(false)
  const visibleBanks = (banks || []).slice(0, VISIBLE_COUNT)
  const remainingCount = Math.max(0, (banks || []).length - VISIBLE_COUNT)

  return (
    <section className="bank-info">
      <div className="bank-info__header">
        <div className="bank-info__bank">
          <div
            className="bank-info__logo"
            style={{ background: activeBank.color }}
          >
            {activeBank.code}
          </div>
          <div className="bank-info__name">
            <h3>{activeBank.fullName || activeBank.name}</h3>
            <span>Cập nhật: Tháng 05/2026</span>
          </div>
        </div>
        <div className="bank-info__actions">
          {/* <button className="bank-info__btn">
            <Share2 size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
            Chia sẻ
          </button> */}
          {/* <button className="bank-info__btn bank-info__btn--primary">
            Lập kế hoạch
          </button> */}
        </div>
      </div>

      <div className="bank-info__tags">
        {visibleBanks.map((bank) => (
          <BankTag
            key={bank.id}
            bank={bank}
            isActive={activeBank.id === bank.id}
            onClick={onBankChange}
          />
        ))}
        <BankTagMore count={remainingCount} onClick={() => setPopupOpen(true)} />
      </div>

      <BankSelectorPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onSelectBank={onBankChange}
      />
    </section>
  )
}
