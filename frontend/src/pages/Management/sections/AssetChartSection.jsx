export function AssetChartSection({ plans }) {
  const total = (plans || []).reduce((sum, p) => sum + (p.initialDeposit || 0), 0)

  // Nhóm và tính tổng vốn ban đầu theo từng ngân hàng
  const groups = {}
  ;(plans || []).forEach((p) => {
    if (!groups[p.bankCode]) {
      groups[p.bankCode] = {
        amount: 0,
        bankName: p.bankName || p.bankCode,
        bankColor: p.bankColor || "#64748B",
      }
    }
    groups[p.bankCode].amount += (p.initialDeposit || 0)
  })

  const allocation = Object.entries(groups).map(([bankCode, info]) => {
    const percentage = total > 0 ? Math.round((info.amount / total) * 100) : 0
    return {
      bank: info.bankName,
      amount: info.amount,
      percentage,
      color: info.bankColor,
    }
  })

  // Sắp xếp giảm dần theo số tiền phân bổ
  allocation.sort((a, b) => b.amount - a.amount)

  const totalFormatted = total >= 1e9
    ? (total / 1e9).toFixed(1) + " tỷ"
    : (total / 1e6).toFixed(0) + " tr"

  // Xây dựng conic-gradient
  let gradient = "conic-gradient(#E2E8F0 0% 100%)"
  if (allocation.length > 0) {
    let gradientParts = []
    let currentPct = 0
    allocation.forEach((a) => {
      const nextPct = currentPct + a.percentage
      gradientParts.push(`${a.color} ${currentPct}% ${nextPct}%`)
      currentPct = nextPct
    })
    if (gradientParts.length > 0) {
      gradient = `conic-gradient(${gradientParts.join(", ")})`
    }
  }

  return (
    <section className="asset-chart">
      <h3 className="asset-chart__title">📊 Phân bổ tài sản</h3>

      {allocation.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8" }}>
          Chưa có dữ liệu phân bổ
        </div>
      ) : (
        <>
          <div className="asset-chart__donut" style={{ background: gradient }}>
            <div className="asset-chart__donut-center">
              <span className="asset-chart__donut-center-value">{totalFormatted}</span>
            </div>
          </div>

          <div className="asset-chart__legend">
            {allocation.map((item, i) => (
              <div key={i} className="asset-chart__legend-item">
                <span className="asset-chart__legend-dot" style={{ background: item.color }} />
                <span>{item.bank}</span>
                <span className="asset-chart__legend-pct">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
