import { BANKS, formatCurrency } from "@/data/mockData"
import "./PlanCard.scss"

export function PlanCard({ plan, onViewDetail, onCreatePlan }) {
  const bank = BANKS.find((b) => b.code === plan.bankCode)

  return (
    <div className={`plan-card ${plan.badge === "Tốt nhất" ? "plan-card--best" : ""}`}>
      <div className="plan-card__header">
        <div className="plan-card__bank">
          <div className="plan-card__bank-logo" style={{ background: bank?.color || "#333" }}>
            {plan.bankCode}
          </div>
          <div>
            <div className="plan-card__bank-name">{plan.planName || plan.bankName}</div>
            <div className="plan-card__bank-meta">
              {plan.startDate && `${plan.startDate} - ${plan.endDate}`}
            </div>
          </div>
        </div>
        <div className="plan-card__badges">
          {plan.badge && (
            <span className={`plan-card__badge plan-card__badge--${plan.badge === "Tốt nhất" ? "best" : "info"}`}>
              {plan.badge}
            </span>
          )}
          {plan.status === "active" && (
            <span className="plan-card__badge plan-card__badge--active">Đang chạy</span>
          )}
        </div>
      </div>

      <div className="plan-card__details">
        <div className="plan-card__detail-row">
          <span className="plan-card__detail-icon">🏦</span>
          <span>{plan.bankName}</span>
          <span className="plan-card__detail-amount">
            {formatCurrency(plan.initialDeposit || plan.currentAmount || 0)}
          </span>
          <span className="plan-card__detail-change">
            {plan.monthlyDeposit > 0 ? `+${formatCurrency(plan.monthlyDeposit)}` : ""}
          </span>
        </div>
        {plan.rate && (
          <div className="plan-card__rate">
            <span className="plan-card__rate-value">{plan.rate}%</span>
            <span className="plan-card__rate-label">/năm</span>
          </div>
        )}
      </div>

      {plan.totalAmount && (
        <div className="plan-card__total">
          <span className="plan-card__total-label">Tổng đáo hạn</span>
          <span className="plan-card__total-value">{formatCurrency(plan.totalAmount)}</span>
        </div>
      )}

      {plan.progress !== undefined && (
        <div className="plan-card__progress-section">
          <div className="plan-card__progress">
            <div
              className="plan-card__progress-fill"
              style={{
                width: `${plan.progress}%`,
                background: plan.progress >= 90 ? "#22C55E" : "#3B5BDB",
              }}
            />
          </div>
          <div className="plan-card__progress-info">
            <span>{formatCurrency(plan.currentAmount)} / {formatCurrency(plan.targetAmount)}</span>
            <span className="plan-card__progress-pct">{plan.progress}%</span>
          </div>
        </div>
      )}

      <div className="plan-card__actions">
        {onViewDetail && (
          <button className="plan-card__btn plan-card__btn--outline" onClick={() => onViewDetail(plan)}>
            Xem chi tiết
          </button>
        )}
        {onCreatePlan && (
          <button className="plan-card__btn plan-card__btn--primary" onClick={() => onCreatePlan(plan)}>
            Lên kế hoạch mới
          </button>
        )}
      </div>
    </div>
  )
}
