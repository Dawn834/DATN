import { useState } from "react"
import { GOAL_TYPES } from "@/data/mockData"
import { GoalTypeSection } from "./sections/GoalTypeSection"
import { PlanFormSection } from "./sections/PlanFormSection"
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
    targetAmount: "88000000",
    initialDeposit: "20000000",
    monthlyDeposit: "0",
    withdrawalMethod: "compound",
    term: 12,
    goalLabel: GOAL_TYPES.find((g) => g.id === "car")?.label || "",
  })

  const handleGoalChange = (goalId) => {
    setActiveGoal(goalId)
    const goal = GOAL_TYPES.find((g) => g.id === goalId)
    setForm((prev) => ({ ...prev, goalLabel: goal?.label || "" }))
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
      <h1 className="planning-page__title">Lập kế hoạch tiết kiệm</h1>
      <p className="planning-page__subtitle">Tạo kế hoạch phù hợp với mục tiêu tài chính của bạn.</p>

      <div className="planning-page__body">
        <div className="planning-page__main">
          <GoalTypeSection activeGoal={activeGoal} onGoalChange={handleGoalChange} />
          <PlanFormSection form={form} onFormChange={setForm} />
          <BankSelectionSection selectedBanks={selectedBanks} onToggleBank={handleToggleBank} />

          <button
            className="planning-submit"
            onClick={() => setShowResults(true)}
          >
            Tìm phương án tiết kiệm →
          </button>
        </div>

        <PlanSummaryAside form={form} />
      </div>

      <PlanResultsSection visible={showResults} />
    </div>
  )
}
