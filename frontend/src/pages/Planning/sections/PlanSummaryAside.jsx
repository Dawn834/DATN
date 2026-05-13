import { formatCurrency } from "@/data/mockData"

export function PlanSummaryAside({ form }) {
  const target = Number(form.targetAmount) || 0
  const initial = Number(form.initialDeposit) || 0
  const monthly = Number(form.monthlyDeposit) || 0
  const term = form.term || 12
  const rate = 5.09

  // Ước tính đơn giản
  const totalDeposit = initial + monthly * term
  const estimatedInterest = Math.round(totalDeposit * (rate / 100) * (term / 12))
  const totalMaturity = totalDeposit + estimatedInterest

  return (
    <aside className="plan-summary">
      <div className="plan-summary__avatar">N</div>
      <div className="plan-summary__name">{form.planName || "Kế hoạch của bạn"}</div>
      <div className="plan-summary__goal">
        {form.goalLabel || "Mục tiêu tiết kiệm"}
      </div>

      <div className="plan-summary__divider" />

      <div className="plan-summary__row">
        <span className="plan-summary__row-label">Mục tiêu</span>
        <span className="plan-summary__row-value">{target > 0 ? formatCurrency(target) : "-"}</span>
      </div>
      <div className="plan-summary__row">
        <span className="plan-summary__row-label">Vốn ban đầu</span>
        <span className="plan-summary__row-value">{initial > 0 ? formatCurrency(initial) : "0 đ"}</span>
      </div>
      <div className="plan-summary__row">
        <span className="plan-summary__row-label">Tiết kiệm/tháng</span>
        <span className="plan-summary__row-value">{monthly > 0 ? formatCurrency(monthly) : "0 đ"}</span>
      </div>
      <div className="plan-summary__row">
        <span className="plan-summary__row-label">Lãi ước tính</span>
        <span className="plan-summary__row-value plan-summary__row-value--green">
          + {formatCurrency(estimatedInterest)}
        </span>
      </div>

      <div className="plan-summary__total">
        <div className="plan-summary__total-label">Tổng tiền đáo hạn</div>
        <div className="plan-summary__total-value">{formatCurrency(totalMaturity)}</div>
      </div>
    </aside>
  )
}
