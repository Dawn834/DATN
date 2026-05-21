import { ASSET_ALLOCATION } from "@/data/mockData"

export function AssetChartSection() {
  const total = ASSET_ALLOCATION.reduce((sum, a) => sum + a.amount, 0)
  const totalFormatted = (total / 1e6).toFixed(0) + "tr"

  // Build conic-gradient
  let gradientParts = []
  let currentPct = 0
  ASSET_ALLOCATION.forEach((a) => {
    const nextPct = currentPct + a.percentage
    gradientParts.push(`${a.color} ${currentPct}% ${nextPct}%`)
    currentPct = nextPct
  })
  const gradient = `conic-gradient(${gradientParts.join(", ")})`

  return (
    <section className="asset-chart">
      <h3 className="asset-chart__title">📊 Phân bổ tài sản</h3>

      <div className="asset-chart__donut" style={{ background: gradient }}>
        <div className="asset-chart__donut-center">
          <span className="asset-chart__donut-center-value">{totalFormatted}</span>
        </div>
      </div>

      <div className="asset-chart__legend">
        {ASSET_ALLOCATION.map((item, i) => (
          <div key={i} className="asset-chart__legend-item">
            <span className="asset-chart__legend-dot" style={{ background: item.color }} />
            <span>{item.bank}</span>
            <span className="asset-chart__legend-pct">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </section>
  )
}
