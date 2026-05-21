import { PLAN_RESULTS, BANKS, formatCurrency } from "@/data/mockData"

export function PlanResultsSection({ visible }) {
  if (!visible) return null

  return (
    <section className="plan-results">
      <div className="plan-results__header">
        <div>
          <h3 className="plan-results__title">
            Phương án cho mục tiêu &quot;Mua xe SH&quot;
          </h3>
          <p className="plan-results__subtitle">
            {PLAN_RESULTS.length} ngân hàng — tối ưu phân bổ
          </p>
        </div>
      </div>

      <div className="plan-results__progress-overview">
        <div className="plan-results__progress-circle">
          <span className="plan-results__progress-pct">95%</span>
          <span className="plan-results__progress-label">đạt mục tiêu</span>
        </div>
        <div className="plan-results__progress-detail">
          <p className="plan-results__progress-note">Thiếu 10 triệu</p>
          <div className="plan-results__progress-banks">
            {PLAN_RESULTS.map((p) => {
              const bank = BANKS.find((b) => b.code === p.bankCode)
              return (
                <div key={p.id} className="plan-results__progress-bank">
                  <span className="plan-results__progress-dot" style={{ background: bank?.color }} />
                  <span>{p.bankName}</span>
                  <span className="plan-results__progress-amt">{formatCurrency(p.totalAmount)}</span>
                </div>
              )
            })}
          </div>
          <p className="plan-results__progress-hint">
            Đạt 95% mục tiêu (190 triệu đ). Xem xét tăng vốn ban đầu.
          </p>
        </div>
      </div>

      <div className="plan-results__cards">
        {PLAN_RESULTS.map((plan, idx) => {
          const bank = BANKS.find((b) => b.code === plan.bankCode)
          return (
            <div key={plan.id} className={`plan-results__card ${idx === 0 ? "plan-results__card--best" : ""}`}>
              <div className="plan-results__card-header">
                <div className="plan-results__card-bank">
                  <div className="plan-results__card-logo" style={{ background: bank?.color || "#333" }}>
                    {plan.bankCode}
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
                  <span className="plan-results__card-stat-label">Tiền lãi</span>
                  <span className="plan-results__card-stat-value plan-results__card-stat-value--green">
                    +{formatCurrency(plan.interestEarned)}
                  </span>
                </div>
              </div>

              <div className="plan-results__card-actions">
                <button className="plan-results__card-btn plan-results__card-btn--primary">
                  Lưu kế hoạch
                </button>
                <button className="plan-results__card-btn plan-results__card-btn--outline">
                  Hỏi AI
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
