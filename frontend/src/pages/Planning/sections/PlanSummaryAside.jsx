import { formatCurrency } from "@/utils/formatters"
import { GOAL_TYPES } from "@/constants/planningConstants"

export function PlanSummaryAside({ form }) {
  const target = Number(form.targetAmount) || 0
  const initial = Number(form.initialDeposit) || 0
  const term = form.term || 24
  const rate = 5.09

  const totalDeposit = initial
  const estimatedInterest = Math.round(totalDeposit * (rate / 100) * (term / 12))
  const totalMaturity = totalDeposit + estimatedInterest

  const goalIcon = GOAL_TYPES.find((g) => g.id === form.goalType)?.icon || "🎯"

  return (
    <aside className="plan-aside">
      <div className="plan-aside__name">{form.planName || "Kế hoạch của bạn"}</div>
      <div className="plan-aside__goal">{form.goalLabel || "Mục tiêu tiết kiệm"}</div>

      <div className="plan-aside__divider" />

      <div className="plan-aside__section-title">TÓM TẮT</div>

      <div className="plan-aside__row">
        <span className="plan-aside__row-label">Cần đạt</span>
        <span className="plan-aside__row-value">{target > 0 ? formatCurrency(target) : "-"}</span>
      </div>
      <div className="plan-aside__row">
        <span className="plan-aside__row-label">Hiện có</span>
        <span className="plan-aside__row-value">{initial > 0 ? formatCurrency(initial) : "0 đ"}</span>
      </div>

      <div className="plan-aside__divider" />

      {/* <div className="plan-aside__row plan-aside__row--total">
        <span className="plan-aside__row-label">Tổng tiền gửi</span>
        <span className="plan-aside__row-value plan-aside__row-value--bold">
          {formatCurrency(totalMaturity)}
        </span>
      </div> */}

      <div className="plan-aside__info-box">
        <div className="plan-aside__info-label">Điền thông tin để nhận đề xuất</div>
        <div className="plan-aside__info-desc">
          Hệ thống sẽ so sánh và chọn gói lãi suất tốt nhất phù hợp nhu cầu của bạn.
        </div>
      </div>
    </aside>
  )
}
