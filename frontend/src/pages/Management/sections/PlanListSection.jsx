import { formatCurrency } from "@/utils/formatters"
import { useNavigate } from "react-router-dom"

export function PlanListSection({ plans, onDeletePlan }) {
  const navigate = useNavigate()

  return (
    <section className="plan-list">
      <h3 className="plan-list__title">Các kế hoạch tiết kiệm</h3>
      <div className="plan-list__badge">Tất cả ({plans?.length || 0})</div>

      <div className="plan-list__items">
        {(!plans || plans.length === 0) ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748B", background: "#F8FAFC", borderRadius: "12px" }}>
            Chưa có kế hoạch tiết kiệm nào. Hãy tạo kế hoạch đầu tiên của bạn!
          </div>
        ) : (
          plans.map((plan) => {
            // bankColor được lưu trong plan_data khi tạo kế hoạch, fallback nếu không có
            const bankColor = plan.bankColor || "#333"
            return (
              <div key={plan.id} className="plan-list__card">
                <div className="plan-list__card-header">
                  <div className="plan-list__card-left">
                    <div className="plan-list__card-logo" style={{ background: bankColor }}>
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
                    </span>
                  </div>
                  {plan.rate && (
                    <div className="plan-list__card-rate">
                      <span className="plan-list__card-rate-value">{plan.rate}%</span>
                      <span className="plan-list__card-rate-label">/năm</span>
                    </div>
                  )}
                </div>

                {plan.estimatedInterest !== undefined && (
                  <div className="plan-list__card-total">
                    <span>Lãi ước tính đáo hạn</span>
                    <span className="plan-list__card-total-value" style={{ color: "#10B981" }}>
                      +{formatCurrency(plan.estimatedInterest)}
                    </span>
                  </div>
                )}

                <div className="plan-list__card-actions">
                  <button
                    className="plan-list__card-btn plan-list__card-btn--outline"
                    onClick={() => navigate(`/management/plan/${plan.id}`)}
                  >
                    Xem chi tiết
                  </button>
                  <button 
                    className="plan-list__card-btn plan-list__card-btn--outline"
                    style={{ color: "#EF4444", borderColor: "#EF4444" }}
                    onClick={() => onDeletePlan(plan.id)}
                  >
                    Xóa kế hoạch
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
