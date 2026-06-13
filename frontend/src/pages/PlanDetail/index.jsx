import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { formatCurrency, formatShortCurrency } from "@/utils/formatters"
import { StatCard } from "@/components/common/StatCard"
import { savingPlanService } from "@/services/savingPlanService"
import "./PlanDetailPage.scss"

export function PlanDetailPage() {
  const { planId } = useParams()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [monthlyData, setMonthlyData] = useState([])

  useEffect(() => {
    async function loadPlanDetail() {
      try {
        setLoading(true)
        const data = await savingPlanService.getPlanById(planId)
        if (data) {
          setPlan(data)
          // Tạo bảng tiến độ dòng tiền hàng tháng tự động
          const table = generateProgressTable(data)
          setMonthlyData(table)
        }
      } catch (err) {
        console.error("Error loading plan details:", err)
      } finally {
        setLoading(false)
      }
    }
    loadPlanDetail()
  }, [planId])

  // Hàm tự động tính toán dòng tiền lãi hàng tháng
  const generateProgressTable = (p) => {
    const table = []
    const init = p.initialDeposit || 0
    const rate = p.rate || 0
    const term = p.term || 12

    const parts = (p.startDate || "01/01/2026").split("/")
    let dateObj = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))

    let currentTotal = init
    const r_monthly = (rate / 100) / 12

    for (let i = 1; i <= term; i++) {
      dateObj.setMonth(dateObj.getMonth() + 1)
      const label = `T${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`
      
      const monthlyInterest = currentTotal * r_monthly
      currentTotal = currentTotal + monthlyInterest

      table.push({
        month: label,
        rate: rate,
        interest: Math.round(monthlyInterest),
        total: Math.round(currentTotal),
      })
    }
    return table
  }

  if (loading) {
    return (
      <div className="plan-detail" style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "16px", color: "#64748B" }}>Đang tải chi tiết kế hoạch...</div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="plan-detail" style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "16px", color: "#EF4444" }}>Không tìm thấy kế hoạch tiết kiệm nào!</div>
        <Link to="/management" style={{ marginTop: "20px", display: "inline-block", color: "#1A73E8" }}>
          Quay lại quản lý
        </Link>
      </div>
    )
  }

  const bank = { name: plan.bankName || plan.bankCode, color: plan.bankColor || "#333" }

  const statCards = [
    { icon: "💵", iconBg: "#EDF2FF", label: "Tiền gửi ban đầu", value: formatCurrency(plan.initialDeposit) },
    { icon: "🎯", iconBg: "#FFF7ED", label: "Mục tiêu", value: formatCurrency(plan.targetAmount) },
    { icon: "⏳", iconBg: "#FDF2F8", label: "Kỳ hạn", value: `${plan.term} tháng` },
  ]

  // Tính toán phân bổ của tài khoản tiết kiệm cụ thể này
  const totalContributed = plan.initialDeposit
  const totalMaturity = totalContributed + plan.estimatedInterest

  const donutData = [
    { label: "Vốn gốc ban đầu", amount: plan.initialDeposit, color: "#1A73E8" },
    { label: "Lãi dự kiến nhận", amount: plan.estimatedInterest, color: "#F59E0B" },
  ].filter(d => d.amount > 0)

  const donutTotal = donutData.reduce((sum, d) => sum + d.amount, 0)
  donutData.forEach(d => {
    d.percentage = donutTotal > 0 ? Math.round((d.amount / donutTotal) * 100) : 0
  })

  let gradientParts = []
  let currentPct = 0
  donutData.forEach((d) => {
    const nextPct = currentPct + d.percentage
    gradientParts.push(`${d.color} ${currentPct}% ${nextPct}%`)
    currentPct = nextPct
  })

  // Tính tổng lãi cộng dồn
  const accumulatedInterest = plan.estimatedInterest

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
          <button className="plan-detail__btn plan-detail__btn--outline" onClick={() => window.print()}>
            In báo cáo
          </button>
          <Link to="/planning" className="plan-detail__btn plan-detail__btn--primary">
            ⚡ Lập kế hoạch mới ngay
          </Link>
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
                  Kỳ hạn {plan.term} tháng · Mở ngày {plan.startDate}
                </div>
              </div>
            </div>
            <div>
              <div className="plan-detail__table-info-label">Gửi ban đầu</div>
              <div className="plan-detail__table-info-value">{formatCurrency(plan.initialDeposit)}</div>
            </div>
            {/* Gửi thêm option removed */}
            <div>
              <div className="plan-detail__table-info-label">Lãi suất</div>
              <div className="plan-detail__table-info-value">{plan.rate}%/năm</div>
            </div>
            <div>
              <div className="plan-detail__table-info-label">Lãi dự kiến</div>
              <div className="plan-detail__table-info-value plan-detail__table-info-value--green">
                +{formatCurrency(accumulatedInterest)}
              </div>
            </div>
          </div>

          <table className="plan-detail__table">
            <thead>
              <tr>
                <th>Tháng</th>
                <th>Lãi suất thực tế</th>
                <th>Lãi nhận trong tháng</th>
                <th>Tổng tích lũy kế</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((row, i) => (
                <tr key={i}>
                  <td>{row.month}</td>
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
            <h3 className="plan-detail__donut-title">📊 Cơ cấu số tiền</h3>
            <div
              className="plan-detail__donut"
              style={{ background: `conic-gradient(${gradientParts.join(", ")})` }}
            >
              <div className="plan-detail__donut-center">
                <span className="plan-detail__donut-value" style={{ fontSize: "14px" }}>
                  {formatShortCurrency(totalMaturity)}
                </span>
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

          {/* Lịch đóng tiền hàng tháng removed */}
        </div>
      </div>
    </div>
  )
}
