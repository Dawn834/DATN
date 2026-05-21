import { useState } from "react"
import { GOAL_TYPES } from "@/data/mockData"
import { GoalTypeSection } from "./sections/GoalTypeSection"
import { PlanFormSection } from "./sections/PlanFormSection"
import { CapitalSection } from "./sections/CapitalSection"
import { PlanSummaryAside } from "./sections/PlanSummaryAside"
import { BankSelectionSection } from "./sections/BankSelectionSection"
import { PlanResultsSection } from "./sections/PlanResultsSection"
import "./PlanningPage.scss"

export function PlanningPage() {
  const [activeGoal, setActiveGoal] = useState("car")
  const [showResults, setShowResults] = useState(false)
  const [selectedBanks, setSelectedBanks] = useState(["MB", "VIB", "VCB"])
  const [form, setForm] = useState({
    planName: "Mua xe SH",
    targetAmount: "200000000",
    initialDeposit: "150000000",
    monthlyDeposit: "0",
    term: 24,
    goalType: "car",
    goalLabel: GOAL_TYPES.find((g) => g.id === "car")?.label || "",
  })

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

  return (
    <div className="planning-page">
      <div className="planning-page__header">
        <h1 className="planning-page__title">Lập kế hoạch tiết kiệm</h1>
        <p className="planning-page__subtitle">
          Nhập mục tiêu — Hệ thống đề xuất gói tiết kiệm tốt ưu từ 22 ngân hàng
        </p>
      </div>

      <div className="planning-page__body">
        <div className="planning-page__main">
          <GoalTypeSection activeGoal={activeGoal} onGoalChange={handleGoalChange} />

          <PlanFormSection form={form} onFormChange={setForm} />

          <CapitalSection form={form} onFormChange={setForm} />

          <BankSelectionSection selectedBanks={selectedBanks} onToggleBank={handleToggleBank} />

          <button className="planning-submit" onClick={() => setShowResults(true)}>
            ✨ Tìm gói tiết kiệm tốt nhất →
          </button>
        </div>

        <PlanSummaryAside form={form} />
      </div>

      <PlanResultsSection visible={showResults} />
    </div>
  )
}
