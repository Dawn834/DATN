import { useParams, Link } from "react-router-dom"
import { SAVINGS_PLANS, BANKS, formatCurrency, ASSET_ALLOCATION } from "@/data/mockData"
import { StatCard } from "@/components/common/StatCard"
import "./PlanDetailPage.scss"

// Mock monthly detail data
const MONTHLY_DATA = [
  { month: "T9/2025", deposit: 10000000, rate: 4.2, interest: 2450000, total: 2450000 },
  { month: "T10/2025", deposit: 10000000, rate: 4.2, interest: 3120000, total: 5570000 },
  { month: "T11/2025", deposit: 10000000, rate: 4.3, interest: 3371390, total: 8947390 },
]

export function PlanDetailPage() {
  const { planId } = useParams()
  const plan = SAVINGS_PLANS.find((p) => p.id === Number(planId)) || SAVINGS_PLANS[0]
  const bank = BANKS.find((b) => b.code === plan.bankCode) || {}

  const statCards = [
    { icon: "💵", iconBg: "#EDF2FF", label: "Số tiền ban đầu", value: formatCurrency(plan.initialDeposit) },
    { icon: "📅", iconBg: "#F0FDF4", label: "Số tiền gửi thêm hàng tháng", value: formatCurrency(plan.monthlyDeposit) },
    { icon: "🎯", iconBg: "#FFF7ED", label: "Mục tiêu", value: formatCurrency(plan.targetAmount) },
    { icon: "⏳", iconBg: "#FDF2F8", label: "Kỳ hạn", value: `${plan.term} tháng` },
  ]

  // Donut chart for this plan
  const donutData = [
    { label: bank.name, percentage: 72, color: bank.color || "#333" },
    { label: "Mua xe", percentage: 23, color: "#3B5BDB" },
    { label: "Du lịch", percentage: 5, color: "#22C55E" },
  ]

  let gradientParts = []
  let currentPct = 0
  donutData.forEach((d) => {
    const nextPct = currentPct + d.percentage
    gradientParts.push(`${d.color} ${currentPct}% ${nextPct}%`)
    currentPct = nextPct
  })

  return (
    <div className="plan-detail">
      {/* Breadcrumb */}
      <div className="plan-detail__breadcrumb">
        <Link to="/management">Quản lý tài chính</Link>
        <span> &gt; </span>
        <span>Chi tiết kế hoạch</span>
      </div>

      {/* Header */}
      <div className="plan-detail__header">
        <div>
          <h1 className="plan-detail__title">
            {plan.planName}
            <span className="plan-detail__badge plan-detail__badge--active">Đang chạy</span>
          </h1>
        </div>
        <div className="plan-detail__header-actions">
          <button className="plan-detail__btn plan-detail__btn--outline">Xuất báo cáo</button>
          <button className="plan-detail__btn plan-detail__btn--primary">⚡ Lên kế hoạch mới ngay</button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="plan-detail__stats">
        {statCards.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      <div className="plan-detail__grid">
        {/* Detail Table */}
        <div className="plan-detail__table-section">
          <div className="plan-detail__table-header">
            <div className="plan-detail__table-bank">
              <div className="plan-detail__table-bank-logo" style={{ background: bank.color }}>
                {plan.bankCode}
              </div>
              <div>
                <div className="plan-detail__table-bank-name">{bank.name}</div>
                <div className="plan-detail__table-bank-meta">
                  Kỳ hạn {plan.term} tháng · Mở {plan.startDate}
                </div>
              </div>
            </div>
            <div>
              <div className="plan-detail__table-info-label">Số tiền ban đầu</div>
              <div className="plan-detail__table-info-value">{formatCurrency(plan.initialDeposit)}</div>
            </div>
            <div>
              <div className="plan-detail__table-info-label">Gửi thêm</div>
              <div className="plan-detail__table-info-value">
                {plan.monthlyDeposit > 0 ? formatCurrency(plan.monthlyDeposit) : "+0 đ"}
              </div>
            </div>
            <div>
              <div className="plan-detail__table-info-label">Lãi suất</div>
              <div className="plan-detail__table-info-value">{plan.rate}%/năm</div>
            </div>
            <div>
              <div className="plan-detail__table-info-label">Lãi tích lũy</div>
              <div className="plan-detail__table-info-value plan-detail__table-info-value--green">
                +{formatCurrency(plan.totalAmount - plan.initialDeposit)}
              </div>
            </div>
          </div>

          <table className="plan-detail__table">
            <thead>
              <tr>
                <th>Tháng</th>
                <th>Gửi thêm</th>
                <th>Lãi suất thực tế</th>
                <th>Lãi tháng</th>
                <th>Tổng tích lũy kế</th>
              </tr>
            </thead>
            <tbody>
              {MONTHLY_DATA.map((row, i) => (
                <tr key={i}>
                  <td>{row.month}</td>
                  <td>{formatCurrency(row.deposit)}</td>
                  <td>{row.rate}%</td>
                  <td className="plan-detail__table-green">{formatCurrency(row.interest)}</td>
                  <td className="plan-detail__table-bold">{formatCurrency(row.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sidebar */}
        <div className="plan-detail__sidebar">
          <div className="plan-detail__donut-section">
            <h3 className="plan-detail__donut-title">📊 Phân bổ tài sản</h3>
            <div
              className="plan-detail__donut"
              style={{ background: `conic-gradient(${gradientParts.join(", ")})` }}
            >
              <div className="plan-detail__donut-center">
                <span className="plan-detail__donut-value">997tr</span>
              </div>
            </div>
            <div className="plan-detail__donut-legend">
              {donutData.map((d, i) => (
                <div key={i} className="plan-detail__donut-legend-item">
                  <span className="plan-detail__donut-legend-dot" style={{ background: d.color }} />
                  <span>{d.label}</span>
                  <span className="plan-detail__donut-legend-pct">{d.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="plan-detail__schedule">
            <h4>Lịch đáo hạn</h4>
            <table className="plan-detail__schedule-table">
              <thead>
                <tr>
                  <th>Tháng</th>
                  <th>Gửi thêm</th>
                </tr>
              </thead>
              <tbody>
                {MONTHLY_DATA.map((row, i) => (
                  <tr key={i}>
                    <td>{row.month}</td>
                    <td>{formatCurrency(row.deposit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
