import "./StatCard.scss"

export function StatCard({ icon, iconBg, label, value, change, changeType }) {
  return (
    <div className="stat-card">
      <div className="stat-card__icon" style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="stat-card__content">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__value">{value}</span>
        {change && (
          <span className={`stat-card__change stat-card__change--${changeType || "up"}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  )
}
