import { useState, useEffect } from "react"

const ICONS = {
  deposit: { emoji: "💵", type: "deposit" },
  interest: { emoji: "💰", type: "interest" },
  create: { emoji: "📋", type: "create" },
  maturity: { emoji: "🔔", type: "maturity" },
}

export function RecentActivitySection() {
  // TODO: Khi backend có API cho activities (GET /activities), thay thế bằng API call:
  // const activities = await apiClient.get("/activities")
  // Hiện tại hiển thị thông báo chưa có dữ liệu
  const [activities] = useState([])

  if (activities.length === 0) {
    return (
      <section className="recent-activity">
        <h3 className="recent-activity__title">Hoạt động gần đây</h3>
        <div style={{ textAlign: "center", padding: "30px", color: "#94A3B8" }}>
          Chưa có hoạt động nào được ghi nhận.
        </div>
      </section>
    )
  }

  return (
    <section className="recent-activity">
      <h3 className="recent-activity__title">Hoạt động gần đây</h3>
      <div className="recent-activity__list">
        {activities.map((activity) => {
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
