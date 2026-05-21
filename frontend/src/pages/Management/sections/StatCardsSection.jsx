import { StatCard } from "@/components/common/StatCard"
import { MANAGEMENT_STATS } from "@/data/mockData"

export function StatCardsSection() {
  return (
    <section className="stat-cards">
      {MANAGEMENT_STATS.slice(0, 3).map((stat, i) => (
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
