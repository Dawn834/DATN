import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Info } from "lucide-react"
import { formatCurrency, formatShortCurrency } from "@/utils/formatters"
import { StatCard } from "@/components/common/StatCard"
import { savingPlanService } from "@/services/savingPlanService"
import { GOAL_TYPES } from "@/constants/planningConstants"
import { PlanDetailsTree, getBankColor } from "@/components/common/PlanDetailsTree"
import "./PlanDetailPage.scss"

export function PlanDetailPage() {
  const { planId } = useParams()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dailyInterest, setDailyInterest] = useState({ today: 0, month: 0, total: 0 })

  useEffect(() => {
    async function loadPlanDetail() {
      try {
        setLoading(true)
        const data = await savingPlanService.getPlanById(planId)
        if (data) {
          setPlan(data)
        }
      } catch (err) {
        console.error("Error loading plan details:", err)
      } finally {
        setLoading(false)
      }
    }
    loadPlanDetail()
  }, [planId])

  // Tính toán các hằng số lãi suất
  const accumulatedInterest = plan?.estimatedInterest || 0
  const totalDays = (plan?.term || 12) * 30
  const averageDailyInterest = Math.round(accumulatedInterest / totalDays)
  const monthlyAccumulatedInterest = Math.round(accumulatedInterest / (plan?.term || 12))

  // Tính toán lãi tự động cập nhật sau 12h trưa mỗi ngày
  useEffect(() => {
    if (!plan) return

    const calculateDailyInterestAccrual = () => {
      const now = new Date()

      // Parse start date (dd/mm/yyyy)
      const parts = (plan.startDate || "15/06/2026").split("/")
      const startOfPlan = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))

      // End of plan date
      const endOfPlan = new Date(startOfPlan)
      endOfPlan.setMonth(endOfPlan.getMonth() + plan.term)

      if (now < startOfPlan) {
        return { today: 0, month: 0, total: 0 }
      }

      if (now > endOfPlan) {
        return {
          today: averageDailyInterest,
          month: monthlyAccumulatedInterest,
          total: accumulatedInterest
        }
      }

      // Số ngày trôi qua tính từ ngày bắt đầu đến đầu ngày hôm nay
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      let elapsedDays = Math.round((startOfToday.getTime() - startOfPlan.getTime()) / (24 * 3600 * 1000))

      // Sau 12h trưa mỗi ngày sẽ cộng thêm lãi của ngày hôm đó
      const isAfterNoon = now.getHours() >= 12
      if (isAfterNoon) {
        elapsedDays += 1
      }

      const totalAccrued = Math.min(accumulatedInterest, elapsedDays * averageDailyInterest)
      const todayAccrued = isAfterNoon ? averageDailyInterest : 0

      // Tính số ngày tích lũy trong tháng hiện tại
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      let elapsedDaysThisMonth = Math.round((startOfToday.getTime() - Math.max(startOfPlan.getTime(), startOfThisMonth.getTime())) / (24 * 3600 * 1000))
      if (isAfterNoon && now >= Math.max(startOfPlan, startOfThisMonth)) {
        elapsedDaysThisMonth += 1
      }
      const monthAccrued = Math.min(accumulatedInterest, Math.max(0, elapsedDaysThisMonth * averageDailyInterest))

      return {
        today: todayAccrued,
        month: monthAccrued,
        total: totalAccrued
      }
    }

    setDailyInterest(calculateDailyInterestAccrual())

    // Kiểm tra định kỳ mỗi 1 phút để tự động cập nhật khi qua mốc 12h trưa
    const interval = setInterval(() => {
      setDailyInterest(calculateDailyInterestAccrual())
    }, 60000)

    return () => clearInterval(interval)
  }, [plan, averageDailyInterest, accumulatedInterest, monthlyAccumulatedInterest])

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
  const goalInfo = GOAL_TYPES.find(g => g.id === plan.goalType) || { icon: "💰", label: "Tiết kiệm" }

  const statCards = [
    { icon: goalInfo.icon, iconBg: "#EDF2FF", label: "Tiền gửi ban đầu", value: formatCurrency(plan.initialDeposit) },
    { icon: "🎯", iconBg: "#FFF7ED", label: "Mục tiêu", value: formatCurrency(plan.targetAmount) },
    { icon: "📅", iconBg: "#FDF2F8", label: "Kỳ hạn", value: `${plan.term} tháng` },
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

  // --- Lấy thông tin lãi đơn ngày để tính toán giai đoạn đầu ---
  const rawSteps = plan.planDetails?.steps || [
    {
      month: 0,
      action: "open",
      amount: plan.initialDeposit,
      term: plan.term,
      bank_id: plan.bankCode,
      bank_name: plan.bankName,
      rate_pct: plan.rate,
    }
  ]

  const mappedSteps = rawSteps
    .map(step => {
      if (step.action === "initial") {
        return step
      }
      const newMonth = Math.max(0, (step.month ?? 1) - 1)
      let newNote = step.note || ""
      if (newNote) {
        newNote = newNote.replace(/T(\d+)/g, (match, p1) => {
          const val = parseInt(p1) - 1
          return "T" + (val >= 0 ? val : 0)
        })
      }
      return {
        ...step,
        month: newMonth,
        note: newNote
      }
    })
    .filter(step => {
      const act = (step.action || "").toLowerCase()
      if (act.includes("hold") || act.includes("transfer") || act.includes("wait") || act.includes("initial")) {
        return (step.amount || 0) > 0
      }
      return true
    })

  const openSteps = mappedSteps.filter(s => s.action === "open" || s.action === "open_book")

  const dailyInterestDetails = openSteps.map((step) => {
    const rate = step.rate_pct || step.annual_rate_pct || plan.rate || 0
    const dailyRate = rate / 100 / 365
    const dailyInterest = step.amount * dailyRate
    return {
      name: step.bank_id?.toUpperCase() || step.bank_name || plan.bankCode,
      amount: step.amount,
      rate: rate,
      term: step.term || step.term_months || plan.term,
      dailyInterest: Math.round(dailyInterest),
      month: step.month || 0,
    }
  })

  const initialDailyInterest = dailyInterestDetails
    .filter(d => d.month === 0)
    .reduce((sum, d) => sum + d.dailyInterest, 0)

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
          {/* <button className="plan-detail__btn plan-detail__btn--outline" onClick={() => window.print()}>
            In báo cáo
          </button> */}
          <Link to="/planning" className="plan-detail__btn plan-detail__btn--primary">
            ⚡ Lập kế hoạch mới ngay
          </Link>
        </div>
      </div>

      {/* Top Section (Stats & Donut structures side-by-side) */}
      <div className="plan-detail__top-section">
        {/* Stat Cards */}
        <div className="plan-detail__stats">
          {statCards.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>

        {/* Sidebar / Donut Chart */}
        <div className="plan-detail__sidebar" style={{ width: "100%" }}>
          <div className="plan-detail__donut-section" style={{ height: "100%" }}>
            <h3 className="plan-detail__donut-title">📊 Cơ cấu số tiền</h3>
            <div style={{ textAlign: "center", marginBottom: "20px", background: "#F8FAFC", padding: "12px", borderRadius: "12px", border: "1px solid #F1F5F9" }}>
              <div style={{ fontSize: "11px", color: "#64748B", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Tổng tiền nhận dự kiến</div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#1E293B", marginTop: "4px" }}>
                {formatCurrency(totalMaturity)}
              </div>
            </div>
            <div
              className="plan-detail__donut"
              style={{ background: `conic-gradient(${gradientParts.join(", ")})` }}
            >
              <div className="plan-detail__donut-center" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.5px" }}>Cơ cấu</span>
                <span style={{ fontSize: "15px", fontWeight: "800", color: "#1E293B", marginTop: "2px" }}>100%</span>
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
        </div>
      </div>

      <div className="plan-detail__grid">
        {/* Detail Tree */}
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
            {/* <div>
              <div className="plan-detail__table-info-label">Lãi suất</div>
              <div className="plan-detail__table-info-value">{plan.rate}%/năm</div>
            </div> */}
            <div>
              <div className="plan-detail__table-info-label">Lãi dự kiến</div>
              <div className="plan-detail__table-info-value plan-detail__table-info-value--green">
                +{formatCurrency(accumulatedInterest)}
              </div>
            </div>
          </div>

          <PlanDetailsTree plan={plan} />
        </div>
      </div>
    </div>
  )
}
