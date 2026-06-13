import { useState, useEffect } from "react"
import { StepHeader } from "@/components/common/StepHeader"
import { bankService } from "@/services/bankService"

export function BankSelectionSection({ selectedBanks, onToggleBank, autoOptimize, onToggleAutoOptimize }) {
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
        subtitle="Chọn ngân hàng hoặc để hệ thống tự tối ưu"
      />

      {/* Toggle: Tự động tối ưu vs Tự chọn */}
      <div className="bank-selection__mode-toggle">
        <button
          type="button"
          className={`bank-selection__mode-btn ${!autoOptimize ? "bank-selection__mode-btn--active" : ""}`}
          onClick={() => autoOptimize && onToggleAutoOptimize()}
        >
          <span className="bank-selection__mode-icon">🏦</span>
          Tự chọn ngân hàng
        </button>
        <button
          type="button"
          className={`bank-selection__mode-btn ${autoOptimize ? "bank-selection__mode-btn--active bank-selection__mode-btn--auto" : ""}`}
          onClick={() => !autoOptimize && onToggleAutoOptimize()}
        >
          <span className="bank-selection__mode-icon">🚀</span>
          Tự động tối ưu
        </button>
      </div>

      {autoOptimize ? (
        <div className="bank-selection__auto-message">
          <div className="bank-selection__auto-icon">✨</div>
          <div className="bank-selection__auto-content">
            <strong>Chế độ tự động</strong>
            <p>Hệ thống sẽ duyệt tất cả ngân hàng và tìm tổ hợp kỳ hạn tối ưu nhất bằng thuật toán Dynamic Programming.</p>
          </div>
        </div>
      ) : (
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
      )}
    </section>
  )
}
