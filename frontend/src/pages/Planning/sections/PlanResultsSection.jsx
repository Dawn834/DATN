import { useState } from "react"
import { formatCurrency } from "@/utils/formatters"
import { PlanDetailsModal } from "@/components/common/PlanDetailsModal"
import { Banknote } from "lucide-react"

export function PlanResultsSection({ visible, results, planName, targetAmount, onSavePlan }) {
  const [selectedPlan, setSelectedPlan] = useState(null)

  if (!visible || !results || results.length === 0) return null

  // Tính toán tiến độ dựa trên phương án tốt nhất (nằm đầu danh sách)
  const bestOption = results[0]
  const progressPct = targetAmount > 0 ? Math.min(100, Math.round((bestOption.totalAmount / targetAmount) * 100)) : 0
  const remaining = Math.max(0, targetAmount - bestOption.totalAmount)

  return (
    <section className="plan-results">
      <div className="plan-results__header">
        <div>
          <h3 className="plan-results__title">
            Phương án cho mục tiêu &quot;{planName}&quot;
          </h3>
          <p className="plan-results__subtitle">
            {results.length} ngân hàng được đề xuất so sánh
          </p>
        </div>
      </div>

      <div className="plan-results__progress-overview">
        <div className="plan-results__progress-circle">
          <span className="plan-results__progress-pct">{progressPct}%</span>
          <span className="plan-results__progress-label">đạt mục tiêu</span>
        </div>
        <div className="plan-results__progress-detail">
          <p className="plan-results__progress-note">
            {remaining > 0 ? `Còn thiếu ${formatCurrency(remaining)}` : "Đã đạt mục tiêu!"}
          </p>
          <div className="plan-results__progress-banks">
            {results.map((p) => (
              <div key={p.id} className="plan-results__progress-bank">
                <span className="plan-results__progress-dot" style={{ background: p.bankColor || "#333" }} />
                <span>{p.bankName}</span>
                <span className="plan-results__progress-amt">{formatCurrency(p.totalAmount)}</span>
              </div>
            ))}
          </div>
          <p className="plan-results__progress-hint">
            Đạt {progressPct}% mục tiêu ({formatCurrency(bestOption.totalAmount)}). 
            {remaining > 0 ? " Cân nhắc tăng số tiền tích lũy hoặc chọn ngân hàng có lãi suất cao hơn." : ""}
          </p>
        </div>
      </div>

      <div className="plan-results__cards">
        {results.map((plan, idx) => (
            <div key={plan.id} className={`plan-results__card ${idx === 0 ? "plan-results__card--best" : ""}`}>
              {plan.badge && <span className="plan-results__card-badge">{plan.badge}</span>}
              <div className="plan-results__card-header">
                <div className="plan-results__card-bank">
                  <div className="plan-results__card-logo" style={{ background: plan.bankColor || "#333" }}>
                    <Banknote size={20} />
                  </div>
                  <div>
                    <div className="plan-results__card-name">{plan.bankName}</div>
                    <div className="plan-results__card-term">{plan.term} tháng</div>
                  </div>
                </div>
                <div className="plan-results__card-rate">
                  <span className="plan-results__card-rate-value">{plan.rate}%</span>
                  <span className="plan-results__card-rate-label">/năm</span>
                </div>
              </div>

              <div className="plan-results__card-stats">
                <div>
                  <span className="plan-results__card-stat-label">Tổng đáo hạn</span>
                  <span className="plan-results__card-stat-value">{formatCurrency(plan.totalAmount)}</span>
                </div>
                <div>
                  <span className="plan-results__card-stat-label">Tiền lãi nhận được</span>
                  <span className="plan-results__card-stat-value plan-results__card-stat-value--green">
                    +{formatCurrency(plan.interestEarned)}
                  </span>
                </div>
              </div>

              <div className="plan-results__card-actions">
                <button 
                  className="plan-results__card-btn plan-results__card-btn--primary"
                  onClick={() => onSavePlan(plan)}
                >
                  Lưu kế hoạch
                </button>
                <button 
                  className="plan-results__card-btn plan-results__card-btn--outline"
                  onClick={() => setSelectedPlan(plan)}
                >
                  Chi tiết
                </button>
              </div>
            </div>
          )
        )}
      </div>

      <PlanDetailsModal 
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        plan={selectedPlan}
      />
    </section>
  )
}
