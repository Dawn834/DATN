import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { StatCardsSection } from "./sections/StatCardsSection"
import { AlertBannerSection } from "./sections/AlertBannerSection"
import { PlanListSection } from "./sections/PlanListSection"
import { AssetChartSection } from "./sections/AssetChartSection"
import { savingPlanService } from "@/services/savingPlanService"
import { formatCurrency } from "@/utils/formatters"
import { useToast } from "@/context/ToastContext"
import "./ManagementPage.scss"

export function ManagementPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  const loadPlans = async () => {
    try {
      setLoading(true)
      const data = await savingPlanService.getPlans()
      setPlans(data)
    } catch (err) {
      console.error("Error loading savings plans:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPlans()
  }, [])

  const handleDeletePlan = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa kế hoạch tiết kiệm này?")) return
    try {
      await savingPlanService.deletePlan(id)
      showToast("Đã xóa kế hoạch thành công!", "success")
      loadPlans() // Tải lại danh sách
    } catch (err) {
      showToast("Lỗi khi xóa kế hoạch: " + err.message, "error")
    }
  }

  // --- Tính toán thống kê động ---
  const totalDeposit = plans.reduce((sum, p) => sum + (p.initialDeposit || 0), 0)
  const totalInterest = plans.reduce((sum, p) => sum + (p.estimatedInterest || 0), 0)
  const totalAssets = totalDeposit + totalInterest

  // Tạo cấu hình stats truyền xuống StatCardsSection
  const stats = [
    {
      icon: "💰",
      iconBg: "#EDF2FF",
      label: "Tổng tiền gửi",
      value: formatCurrency(totalDeposit),
      change: `${plans.length} kế hoạch đang chạy`,
      changeType: "up",
    },
    {
      icon: "📈",
      iconBg: "#F0FDF4",
      label: "Lãi ước tính",
      value: formatCurrency(totalInterest),
      change: `Lãi suất trung bình: ${(plans.reduce((sum, p) => sum + p.rate, 0) / (plans.length || 1)).toFixed(2)}%`,
      changeType: "up",
    },
    {
      icon: "📊",
      iconBg: "#FFF7ED",
      label: "Tổng tài sản",
      value: formatCurrency(totalAssets),
      change: "Bao gồm gốc + lãi dự kiến",
      changeType: "up",
    },
  ]

  if (loading) {
    return (
      <div className="management-page" style={{ padding: "40px", textAlign: "center" }}>
        <h1 className="management-page__title">📊 Quản lý tài chính</h1>
        <div style={{ marginTop: "40px", fontSize: "16px", color: "#64748B" }}>
          Đang tải thông tin tài chính...
        </div>
      </div>
    )
  }

  return (
    <div className="management-page">
      <div className="management-page__header">
        <div>
          <h1 className="management-page__title">📊 Quản lý tài chính</h1>
          <p className="management-page__subtitle">
            Tổng quan {plans.length} kế hoạch đang hoạt động
          </p>
        </div>
        <div className="management-page__actions">
          {/* <button
            className="management-page__btn management-page__btn--outline"
            onClick={() => window.print()}
          >
            In báo cáo
          </button> */}
          <button
            className="management-page__btn management-page__btn--primary"
            onClick={() => navigate("/planning")}
          >
            + Thêm kế hoạch mới
          </button>
        </div>
      </div>

      <AlertBannerSection />
      <StatCardsSection stats={stats} />

      <div className="management-page__grid">
        <PlanListSection plans={plans} onDeletePlan={handleDeletePlan} />
        <AssetChartSection plans={plans} />
      </div>
    </div>
  )
}
