import { ASSET_ALLOCATION, formatShortCurrency } from "@/data/mockData"

export function AssetChartSection() {
  const total = ASSET_ALLOCATION.reduce((sum, a) => sum + a.amount, 0)

  // Build conic-gradient for CSS donut chart
  let gradientParts = []
  let cumulative = 0
  ASSET_ALLOCATION.forEach((item) => {
    const start = cumulative
    cumulative += item.percentage
    gradientParts.push(`${item.color} ${start}% ${cumulative}%`)
  })
  const gradient = `conic-gradient(${gradientParts.join(", ")})`

  return (
    <section className="asset-chart">
      <h3 className="asset-chart__title">Phân bổ tài sản</h3>

      <div className="asset-chart__donut" style={{ background: gradient }}>
        <div className="asset-chart__donut-center">
          <span className="asset-chart__donut-center-value">{formatShortCurrency(total)}</span>
          <span className="asset-chart__donut-center-label">Tổng cộng</span>
        </div>
      </div>

      <div className="asset-chart__legend">
        {ASSET_ALLOCATION.map((item, idx) => (
          <div key={idx} className="asset-chart__legend-item">
            <div className="asset-chart__legend-item-left">
              <div className="asset-chart__legend-dot" style={{ background: item.color }} />
              <span className="asset-chart__legend-name">{item.bank}</span>
            </div>
            <span className="asset-chart__legend-value">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </section>
  )
}
