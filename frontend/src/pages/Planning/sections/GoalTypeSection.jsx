import { GOAL_TYPES } from "@/data/mockData"

export function GoalTypeSection({ activeGoal, onGoalChange }) {
  return (
    <section className="goal-type">
      <h3 className="goal-type__title">Mục tiêu tiết kiệm</h3>
      <div className="goal-type__grid">
        {GOAL_TYPES.map((goal) => (
          <button
            key={goal.id}
            className={`goal-type__item ${activeGoal === goal.id ? "goal-type__item--active" : ""}`}
            onClick={() => onGoalChange(goal.id)}
          >
            <span className="goal-type__item-icon">{goal.icon}</span>
            <span className="goal-type__item-label">{goal.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
