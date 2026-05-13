import { FINANCIAL_STATS, formatCurrency, formatShortCurrency } from "@/data/mockData"

const stats = [
  {
    label: "Tổng tiền đang gửi",
    value: formatShortCurrency(FINANCIAL_STATS.totalDeposit),
    icon: "💰",
    iconBg: "#E8F0FE",
    change: "+12% so với tháng trước",
  },
  {
    label: "Lãi ước tính",
    value: formatShortCurrency(FINANCIAL_STATS.estimatedInterest),
    icon: "📈",
    iconBg: "#F0FDF4",
    change: "+5% so với tháng trước",
  },
  {
    label: "Lãi suất TB",
    value: FINANCIAL_STATS.averageRate + "%",
    icon: "⚡",
    iconBg: "#FFF7ED",
    change: null,
  },
  {
    label: "Sắp đáo hạn",
    value: FINANCIAL_STATS.nearMaturityCount + " khoản",
    icon: "⏰",
    iconBg: "#FEF2F2",
    change: null,
  },
]

export function StatCardsSection() {
  return (
    <section className="stat-cards">
      {stats.map((item, idx) => (
        <div key={idx} className="stat-cards__card">
          <div className="stat-cards__card-icon" style={{ background: item.iconBg }}>
            {item.icon}
          </div>
          <span className="stat-cards__card-label">{item.label}</span>
          <span className="stat-cards__card-value">{item.value}</span>
          {item.change && (
            <span className="stat-cards__card-change stat-cards__card-change--up">{item.change}</span>
          )}
        </div>
      ))}
    </section>
  )
}
