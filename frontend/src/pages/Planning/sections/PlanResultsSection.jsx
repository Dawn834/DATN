import { PLAN_RESULTS, BANKS, formatCurrency } from "@/data/mockData"

export function PlanResultsSection({ visible }) {
  if (!visible) return null

  return (
    <section className="plan-results">
      <div className="plan-results__header">
        <h3 className="plan-results__title">Phương án cho mục tiêu &quot;Mua xe SH&quot;</h3>
        <span className="plan-results__badge">
          {PLAN_RESULTS.length} ngân hàng • {PLAN_RESULTS.length} phương án tốt
        </span>
      </div>

      {PLAN_RESULTS.map((plan, idx) => {
        const bank = BANKS.find((b) => b.code === plan.bankCode)
        return (
          <div
            key={plan.id}
            className={`plan-results__card ${idx === 0 ? "plan-results__card--best" : ""}`}
          >
            <div className="plan-results__card-bank">
              <div
                className="plan-results__card-logo"
                style={{ background: bank?.color || "#333" }}
              >
                {plan.bankCode}
              </div>
              <div>
                <div className="plan-results__card-name">{plan.bankName}</div>
                <div className="plan-results__card-rate">
                  {plan.rate}% / năm • {plan.term} tháng
                  {plan.badge && (
                    <span style={{
                      marginLeft: 8,
                      fontSize: 11,
                      padding: "2px 8px",
                      borderRadius: 99,
                      background: "#F0FDF4",
                      color: "#22C55E",
                      fontWeight: 600
                    }}>
                      {plan.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="plan-results__card-stats">
              <div>
                <div className="plan-results__card-stat-label">Tổng tiền đáo hạn</div>
                <div className="plan-results__card-stat-value">{formatCurrency(plan.totalAmount)}</div>
              </div>
              <div>
                <div className="plan-results__card-stat-label">Tiền lãi</div>
                <div className="plan-results__card-stat-value plan-results__card-stat-value--green">
                  +{formatCurrency(plan.interestEarned)}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}
