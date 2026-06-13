import { StatCard } from "@/components/common/StatCard"

export function StatCardsSection({ stats }) {
  return (
    <section className="stat-cards">
      {(stats || []).map((stat, i) => (
        <StatCard
          key={i}
          icon={stat.icon}
          iconBg={stat.iconBg}
          label={stat.label}
          value={stat.value}
          change={stat.change}
          changeType={stat.changeType}
        />
      ))}
    </section>
  )
}
