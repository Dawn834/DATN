import { useState, useEffect } from "react"
import { Share2 } from "lucide-react"
import { BankTag, BankTagMore } from "@/components/common/BankTag"
import { BankSelectorPopup } from "@/components/common/BankSelectorPopup"

const VISIBLE_COUNT = 5

export function BankInfoSection({ banks, activeBank, onBankChange }) {
  const [popupOpen, setPopupOpen] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [suffixIndex, setSuffixIndex] = useState(0)

  // Reset trạng thái khi đổi ngân hàng khác
  useEffect(() => {
    setImgError(false)
    setSuffixIndex(0)
  }, [activeBank?.code])

  const visibleBanks = (banks || []).slice(0, VISIBLE_COUNT)
  const remainingCount = Math.max(0, (banks || []).length - VISIBLE_COUNT)

  // Các hậu tố phổ biến của tên file logo ngân hàng
  const suffixes = ["", "bank", "vn"]
  const baseCode = activeBank?.code?.toLowerCase().replace(/[^a-z0-9]/g, "") || ""
  const logoUrl = `/logos/${baseCode}${suffixes[suffixIndex]}.png`

  const handleError = () => {
    if (suffixIndex < suffixes.length - 1) {
      setSuffixIndex((prev) => prev + 1)
    } else {
      setImgError(true)
    }
  }

  return (
    <section className="bank-info">
      <div className="bank-info__header">
        <div className="bank-info__bank">
          <div
            className="bank-info__logo"
            style={{ 
              background: imgError ? activeBank.color : "#ffffff",
              padding: imgError ? "0" : "6px",
              border: imgError ? "none" : "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden"
            }}
          >
            {!imgError && activeBank?.code ? (
              <img
                src={logoUrl}
                alt={activeBank.name}
                onError={handleError}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              activeBank?.code
            )}
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
