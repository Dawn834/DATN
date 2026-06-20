import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { GOAL_TYPES } from "@/constants/planningConstants"
import { GoalTypeSection } from "./sections/GoalTypeSection"
import { PlanFormSection } from "./sections/PlanFormSection"
import { CapitalSection } from "./sections/CapitalSection"
import { RateTypeSection } from "./sections/RateTypeSection"
import { RiskAppetiteSection } from "./sections/RiskAppetiteSection"
import { PlanSummaryAside } from "./sections/PlanSummaryAside"
import { BankSelectionSection } from "./sections/BankSelectionSection"
import { PlanResultsSection } from "./sections/PlanResultsSection"
import { bankService } from "@/services/bankService"
import { savingPlanService } from "@/services/savingPlanService"
import { useToast } from "@/context/ToastContext"
import "./PlanningPage.scss"

const parseAmount = (val) => {
  if (typeof val === "number") return val
  if (!val) return 0
  const clean = val.toString().replace(/\D/g, "")
  return parseFloat(clean) || 0
}

// Map frontend risk level → DB ranking_risk value
const RISK_LEVEL_MAP = { low: 1, medium: 2, high: 3 }

export function PlanningPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeGoal, setActiveGoal] = useState("car")
  const [showResults, setShowResults] = useState(false)
  const [selectedBanks, setSelectedBanks] = useState(["MB", "VIB", "VCB"])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [autoOptimize, setAutoOptimize] = useState(false)
  const [riskLevel, setRiskLevel] = useState("medium")
  const [existingPlans, setExistingPlans] = useState([])
  const [banks, setBanks] = useState([])

  useEffect(() => {
    async function fetchExistingPlans() {
      try {
        const data = await savingPlanService.getPlans()
        if (data) {
          setExistingPlans(data)
        }
      } catch (err) {
        console.error("Failed to load existing plans:", err)
      }
    }
    async function fetchBanks() {
      try {
        const data = await bankService.getBanks()
        if (data) {
          setBanks(data)
        }
      } catch (err) {
        console.error("Failed to load banks:", err)
      }
    }
    fetchExistingPlans()
    fetchBanks()
  }, [])

  const [form, setForm] = useState({
    planName: "Mua xe SH",
    targetAmount: "200000000",
    initialDeposit: "150000000",
    term: 12,
    goalType: "car",
    goalLabel: GOAL_TYPES.find((g) => g.id === "car")?.label || "",
    rateType: "fixed",
    channel: "ONLINE",
  })

  const isDuplicateName = existingPlans.some(
    (p) => p.planName?.trim().toLowerCase() === form.planName?.trim().toLowerCase()
  )

  const handleGoalChange = (goalId) => {
    setActiveGoal(goalId)
    const goal = GOAL_TYPES.find((g) => g.id === goalId)
    setForm((prev) => ({ ...prev, goalType: goalId, goalLabel: goal?.label || "" }))
  }

  const handleToggleBank = (bankCode) => {
    setSelectedBanks((prev) =>
      prev.includes(bankCode)
        ? prev.filter((c) => c !== bankCode)
        : [...prev, bankCode]
    )
  }

  const handleCalculate = async () => {
    if (isDuplicateName) {
      showToast("Tên kế hoạch đã trùng với kế hoạch đã lưu. Vui lòng đổi tên khác.", "error")
      return
    }
    if (!form.targetAmount || parseAmount(form.targetAmount) <= 0) {
      showToast("Vui lòng nhập số tiền cần đạt.", "error")
      return
    }
    if (!form.initialDeposit || parseAmount(form.initialDeposit) <= 0) {
      showToast("Vui lòng nhập số tiền vốn hiện có lớn hơn 0.", "error")
      return
    }
    const validSelectedBanks = selectedBanks.filter(code => banks.some(b => b.code === code))
    if (form.rateType === "dynamic" && !autoOptimize && validSelectedBanks.length === 0) {
      showToast("Vui lòng chọn ít nhất một ngân hàng ưu tiên.", "error")
      return
    }
    let hasPlans = false
    setLoading(true)
    try {
      const initDep = parseAmount(form.initialDeposit) || 0
      const monthDep = 0
      const termMonths = parseInt(form.term) || 12

      // Chỉ gửi risk_group khi section khẩu vị rủi ro hiển thị
      const shouldSendRisk = form.rateType === "fixed" || (form.rateType === "dynamic" && autoOptimize)
      const riskGroupValue = shouldSendRisk ? RISK_LEVEL_MAP[riskLevel] : undefined

      if (form.rateType === "dynamic") {
        // Lấy từ API tối ưu hóa động của backend
        const payload = {
          name: form.planName,
          duration_month: termMonths,
          total_amount: initDep,
          goal_amount: parseAmount(form.targetAmount) || 0,
          prefer_rate: form.channel || "ONLINE",
          codes: autoOptimize ? [] : validSelectedBanks,
          notes: form.goalLabel || "",
          ...(riskGroupValue != null && { risk_group: riskGroupValue }),
        }

        const optimizeResult = await savingPlanService.optimizePlan(payload)

        const topPlans = optimizeResult?.top_plans ||
          optimizeResult?.plan_details?.top_plans ||
          (optimizeResult?.plan_details?.best_plan ? [optimizeResult.plan_details.best_plan] : []);

        if (optimizeResult && topPlans.length > 0) {
          const formatted = topPlans.map((plan, index) => {
            const steps = plan.steps || []
            const uniqueCodes = Array.from(new Set(steps.map(s => s.bank_id).filter(Boolean))).map(c => c.toUpperCase())
            const displayCodes = uniqueCodes.length > 0 ? uniqueCodes.join(", ") : "Đa ngân hàng"

            return {
              id: `dynamic_${plan.rank || index}`,
              bankCode: "DYNAMIC",
              bankName: `Phương án ${index + 1} (${displayCodes})`,
              bankColor: "#3B5BDB",
              rate: parseFloat(plan.interest_rate_effective_pct?.toFixed(2) || 0),
              term: termMonths,
              totalAmount: Math.round(plan.final_amount || 0),
              interestEarned: Math.round(plan.interest_earned || 0),
              // badge: index === 0 ? "Tối ưu nhất" : "",
              isDynamic: true,
              planDetails: plan,
            }
          })
          setResults(formatted)
          hasPlans = true
        } else {
          setResults([])
        }
      } else {
        // Lãi suất cứng (Gọi API của backend)
        const payload = {
          total_amount: initDep,
          term_month: termMonths,
          channel: form.channel || "ONLINE",
          ...(riskGroupValue != null && { risk_group: riskGroupValue }),
        }

        const fixedResult = await savingPlanService.planByTerm(payload)

        if (fixedResult) {
          const bank = await bankService.getBankByCode(fixedResult.bank_code)
          const formatted = [{
            id: fixedResult.bank_code,
            bankCode: fixedResult.bank_code,
            bankName: fixedResult.bank_code ? fixedResult.bank_code.toUpperCase() : fixedResult.bank_name,
            bankColor: bank ? bank.color : "#1A73E8",
            rate: fixedResult.annual_rate_pct,
            term: fixedResult.term_month,
            totalAmount: Math.round(fixedResult.final_amount),
            interestEarned: Math.round(fixedResult.achieved_interest),
            badge: "Lãi suất tốt nhất (Cố định)",
            isDynamic: false,
            planDetails: fixedResult.plan_details,
          }]
          setResults(formatted)
          hasPlans = true
        } else {
          setResults([])
        }
      }
      setShowResults(true)
      if (hasPlans) {
        showToast("Đã tạo phương án thành công!", "success")
      } else {
        showToast("Không tìm thấy phương án tối ưu phù hợp.", "warning")
      }
    } catch (err) {
      console.error("Calculation error:", err)
      showToast("Lỗi khi lập kế hoạch: " + (err.message || err), "error")
    } finally {
      setLoading(false)
    }
  }

  const handleSavePlan = async (selectedResult) => {
    if (isDuplicateName) {
      showToast("Tên kế hoạch đã trùng với kế hoạch đã lưu. Vui lòng đổi tên khác.", "error")
      return
    }
    if (!form.targetAmount || parseAmount(form.targetAmount) <= 0) {
      showToast("Vui lòng nhập số tiền cần đạt trước khi lưu kế hoạch.", "error")
      return
    }
    try {
      const now = new Date()
      const startDateStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`

      const endDate = new Date(now.setMonth(now.getMonth() + selectedResult.term))
      const endDateStr = `${String(endDate.getDate()).padStart(2, "0")}/${String(endDate.getMonth() + 1).padStart(2, "0")}/${endDate.getFullYear()}`

      const newPlan = {
        planName: form.planName,
        bankCode: selectedResult.bankCode,
        bankName: selectedResult.bankName,
        goalType: form.goalType,
        targetAmount: parseAmount(form.targetAmount) || 0,
        initialDeposit: parseAmount(form.initialDeposit) || 0,
        monthlyDeposit: 0,
        currentAmount: parseAmount(form.initialDeposit) || 0,
        rate: selectedResult.rate,
        term: selectedResult.term,
        startDate: startDateStr,
        endDate: endDateStr,
        estimatedInterest: selectedResult.interestEarned,
        planDetails: selectedResult.planDetails,
        riskLevel: riskLevel,
      }

      await savingPlanService.createPlan(newPlan)
      showToast("Đã lưu kế hoạch tiết kiệm thành công!", "success")
      navigate("/management")
    } catch (err) {
      showToast("Không thể lưu kế hoạch: " + err.message, "error")
    }
  }

  return (
    <div className="planning-page">
      <div className="planning-page__header">
        <h1 className="planning-page__title">Lập kế hoạch tiết kiệm</h1>
        <p className="planning-page__subtitle">
          Nhập mục tiêu — Hệ thống đề xuất gói tiết kiệm tối ưu từ 20 ngân hàng
        </p>
      </div>

      <div className="planning-page__body">
        <div className="planning-page__main">
          <GoalTypeSection activeGoal={activeGoal} onGoalChange={handleGoalChange} />

          <PlanFormSection form={form} onFormChange={setForm} isDuplicate={isDuplicateName} />

          <CapitalSection form={form} onFormChange={setForm} />

          <RateTypeSection form={form} onFormChange={setForm} />

          {form.rateType === "dynamic" && (
            <BankSelectionSection
              selectedBanks={selectedBanks}
              onToggleBank={handleToggleBank}
              autoOptimize={autoOptimize}
              onToggleAutoOptimize={() => setAutoOptimize((prev) => !prev)}
              banks={banks}
            />
          )}

          {(form.rateType === "fixed" || (form.rateType === "dynamic" && autoOptimize)) && (
            <RiskAppetiteSection
              riskLevel={riskLevel}
              onRiskChange={setRiskLevel}
              step={form.rateType === "fixed" ? 4 : 5}
            />
          )}

          <button className="planning-submit" onClick={handleCalculate} disabled={loading}>
            {loading ? "✨ Đang tính toán..." : "✨ Tìm gói tiết kiệm tốt nhất →"}
          </button>
        </div>

        <div className="planning-page__sidebar">
          <PlanSummaryAside form={form} />

          <PlanResultsSection
            visible={showResults}
            results={results}
            planName={form.planName}
            targetAmount={parseAmount(form.targetAmount) || 0}
            onSavePlan={handleSavePlan}
            riskLevel={riskLevel}
          />
        </div>
      </div>
    </div>
  )
}
