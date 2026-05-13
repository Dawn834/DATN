import { useState } from "react"
import { Share2 } from "lucide-react"
import { BANKS } from "@/data/mockData"
import { BankTag, BankTagMore } from "@/components/common/BankTag"
import { BankSelectorPopup } from "@/components/common/BankSelectorPopup"

const VISIBLE_COUNT = 5

export function BankInfoSection({ activeBank, onBankChange }) {
  const [popupOpen, setPopupOpen] = useState(false)
  const visibleBanks = BANKS.slice(0, VISIBLE_COUNT)
  const remainingCount = BANKS.length - VISIBLE_COUNT

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
            <h3>{activeBank.code} - {activeBank.fullName || activeBank.name}</h3>
            <span>Cập nhật: Tháng 05/2026</span>
          </div>
        </div>
        <div className="bank-info__actions">
          <button className="bank-info__btn">
            <Share2 size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
            Chia sẻ
          </button>
          <button className="bank-info__btn bank-info__btn--primary">
            Lập kế hoạch
          </button>
        </div>
      </div>

      <div className="bank-info__tags">
        {visibleBanks.map((bank) => (
          <BankTag
            key={bank.code}
            bank={bank}
            isActive={activeBank.code === bank.code}
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
