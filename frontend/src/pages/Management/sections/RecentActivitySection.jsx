import { RECENT_ACTIVITIES } from "@/data/mockData"

const ICONS = {
  deposit: { emoji: "💵", type: "deposit" },
  interest: { emoji: "💰", type: "interest" },
  create: { emoji: "📋", type: "create" },
  maturity: { emoji: "🔔", type: "maturity" },
}

export function RecentActivitySection() {
  return (
    <section className="recent-activity">
      <h3 className="recent-activity__title">Hoạt động gần đây</h3>
      <div className="recent-activity__list">
        {RECENT_ACTIVITIES.map((activity) => {
          const icon = ICONS[activity.type] || ICONS.deposit
          return (
            <div key={activity.id} className="recent-activity__item">
              <div className={`recent-activity__item-icon recent-activity__item-icon--${icon.type}`}>
                {icon.emoji}
              </div>
              <div className="recent-activity__item-content">
                <div className="recent-activity__item-text">{activity.description}</div>
                <div className="recent-activity__item-date">{activity.date}</div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
