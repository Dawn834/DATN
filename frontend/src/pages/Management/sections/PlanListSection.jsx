import { SAVINGS_PLANS, BANKS, formatCurrency } from "@/data/mockData"
import { useNavigate } from "react-router-dom"

export function PlanListSection() {
  const navigate = useNavigate()

  return (
    <section className="plan-list">
      <h3 className="plan-list__title">Các kế hoạch tiết kiệm</h3>
      <div className="plan-list__badge">Tất cả</div>

      <div className="plan-list__items">
        {SAVINGS_PLANS.map((plan) => {
          const bank = BANKS.find((b) => b.code === plan.bankCode) || {}
          return (
            <div key={plan.id} className="plan-list__card">
              <div className="plan-list__card-header">
                <div className="plan-list__card-left">
                  <div className="plan-list__card-logo" style={{ background: bank.color || "#333" }}>
                    {plan.bankCode}
                  </div>
                  <div>
                    <div className="plan-list__card-name">{plan.planName}</div>
                    <div className="plan-list__card-meta">
                      {plan.startDate} - {plan.endDate}
                    </div>
                  </div>
                </div>
                <div className="plan-list__card-badges">
                  {plan.badge && (
                    <span className={`plan-list__card-badge plan-list__card-badge--${plan.badge === "Tốt nhất" ? "best" : "info"}`}>
                      {plan.badge}
                    </span>
                  )}
                  {plan.status === "active" && (
                    <span className="plan-list__card-badge plan-list__card-badge--active">Đang chạy</span>
                  )}
                </div>
              </div>

              <div className="plan-list__card-details">
                <div className="plan-list__card-banks">
                  <span className="plan-list__card-bank-item">
                    🏦 {plan.bankName} {formatCurrency(plan.initialDeposit)}
                    {plan.monthlyDeposit > 0 && <span className="plan-list__card-change"> +{formatCurrency(plan.monthlyDeposit)}</span>}
                  </span>
                </div>
                {plan.rate && (
                  <div className="plan-list__card-rate">
                    <span className="plan-list__card-rate-value">{plan.rate}%</span>
                    <span className="plan-list__card-rate-label">/năm</span>
                  </div>
                )}
              </div>

              {plan.totalAmount && (
                <div className="plan-list__card-total">
                  <span>Tổng đáo hạn</span>
                  <span className="plan-list__card-total-value">{formatCurrency(plan.totalAmount)}</span>
                </div>
              )}

              <div className="plan-list__card-actions">
                <button
                  className="plan-list__card-btn plan-list__card-btn--outline"
                  onClick={() => navigate(`/management/plan/${plan.id}`)}
                >
                  Xem chi tiết
                </button>
                <button className="plan-list__card-btn plan-list__card-btn--primary">
                  Lên kế hoạch mới
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
