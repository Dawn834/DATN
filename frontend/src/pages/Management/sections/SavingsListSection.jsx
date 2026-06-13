import { useState, useEffect } from "react"
import { formatCurrency } from "@/utils/formatters"
import { savingPlanService } from "@/services/savingPlanService"

export function SavingsListSection() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAccounts() {
      try {
        setLoading(true)
        // TODO: Khi backend có API riêng cho savings accounts, thay thế
        // Hiện tại dùng saving plans làm dữ liệu hiển thị
        const plans = await savingPlanService.getPlans()
        setAccounts(plans)
      } catch (err) {
        console.error("Lỗi khi tải danh sách khoản tiết kiệm:", err)
      } finally {
        setLoading(false)
      }
    }
    loadAccounts()
  }, [])

  if (loading) {
    return (
      <section className="savings-list">
        <h3 className="savings-list__title">Danh sách khoản tiết kiệm</h3>
        <div style={{ textAlign: "center", padding: "30px", color: "#64748B" }}>
          Đang tải danh sách...
        </div>
      </section>
    )
  }

  if (accounts.length === 0) {
    return (
      <section className="savings-list">
        <h3 className="savings-list__title">Danh sách khoản tiết kiệm</h3>
        <div style={{ textAlign: "center", padding: "30px", color: "#94A3B8" }}>
          Chưa có khoản tiết kiệm nào.
        </div>
      </section>
    )
  }

  return (
    <section className="savings-list">
      <h3 className="savings-list__title">Danh sách khoản tiết kiệm</h3>

      {accounts.map((account) => {
        const bankColor = account.bankColor || "#333"
        const progress = account.targetAmount > 0
          ? Math.min(100, Math.round((account.currentAmount / account.targetAmount) * 100))
          : 0
        const isNearMaturity = progress >= 90

        return (
          <div key={account.id} className="savings-list__item">
            <div className="savings-list__item-header">
              <div className="savings-list__item-bank">
                <div
                  className="savings-list__item-logo"
                  style={{ background: bankColor }}
                >
                  {account.bankCode}
                </div>
                <div>
                  <div className="savings-list__item-name">
                    {account.bankName} - {account.planName}
                    <span
                      className={`savings-list__item-status ${isNearMaturity
                        ? "savings-list__item-status--near"
                        : "savings-list__item-status--active"
                        }`}
                    >
                      {isNearMaturity ? "Sắp đáo hạn" : "Đang chạy"}
                    </span>
                  </div>
                  <div className="savings-list__item-plan">
                    {account.startDate} → {account.endDate} • {account.term} tháng
                  </div>
                </div>
              </div>
              <div className="savings-list__item-rate">{account.rate}%/năm</div>
            </div>

            <div className="savings-list__progress">
              <div
                className="savings-list__progress-fill"
                style={{
                  width: `${progress}%`,
                  background: isNearMaturity ? "#F97316" : "#1A73E8",
                }}
              />
            </div>

            <div className="savings-list__item-footer">
              <span>{formatCurrency(account.currentAmount)} / {formatCurrency(account.targetAmount)}</span>
              <span>{progress}% hoàn thành</span>
            </div>
          </div>
        )
      })}
    </section>
  )
}
