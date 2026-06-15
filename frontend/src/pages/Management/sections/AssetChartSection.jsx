import { useState } from "react"
import { formatCurrency } from "@/utils/formatters"

const PLAN_COLORS = [
  "#3B82F6", // blue
  "#F59E0B", // amber
  "#10B981", // emerald
  "#8B5CF6", // violet
  "#EF4444", // red
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#F97316", // orange
  "#6366F1", // indigo
  "#14B8A6", // teal
  "#E11D48", // rose
  "#84CC16", // lime
]

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
}

export function AssetChartSection({ plans }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const total = (plans || []).reduce((sum, p) => sum + (p.initialDeposit || 0), 0)

  const allocation = (plans || []).map((p, i) => {
    const percentage = total > 0 ? Math.round((p.initialDeposit / total) * 100) : 0
    return {
      name: p.planName || p.bankName || p.bankCode || `Plan ${i + 1}`,
      amount: p.initialDeposit || 0,
      percentage,
      color: PLAN_COLORS[i % PLAN_COLORS.length],
    }
  })

  allocation.sort((a, b) => b.amount - a.amount)

  const totalFormatted = formatCurrency(total)

  // Build SVG arcs
  const cx = 90, cy = 90, outerR = 85, innerR = 55, strokeW = outerR - innerR
  const midR = (outerR + innerR) / 2
  let currentAngle = 0
  const arcs = allocation.map((item, i) => {
    const sweep = (item.percentage / 100) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + Math.max(sweep, 0.5) // min arc for visibility
    currentAngle += sweep
    return { ...item, startAngle, endAngle, index: i }
  })

  return (
    <section className="asset-chart">
      <h3 className="asset-chart__title">📊 Phân bổ tài sản</h3>

      {allocation.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8" }}>
          Chưa có dữ liệu phân bổ
        </div>
      ) : (
        <>
          <div style={{ textAlign: "center", marginBottom: "20px", background: "#F8FAFC", padding: "12px", borderRadius: "12px", border: "1px solid #F1F5F9" }}>
            <div style={{ fontSize: "11px", color: "#64748B", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Tổng tài sản tích lũy</div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: "#1E293B", marginTop: "4px" }}>
              {formatCurrency(total)}
            </div>
          </div>

          <div className="asset-chart__donut-wrapper">
            <svg viewBox="0 0 180 180" className="asset-chart__svg">
              {arcs.map((arc) => (
                <path
                  key={arc.index}
                  d={describeArc(cx, cy, midR, arc.startAngle, arc.endAngle)}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth={hoveredIndex === arc.index ? strokeW + 6 : strokeW}
                  strokeLinecap="butt"
                  style={{
                    transition: "stroke-width 0.2s ease, opacity 0.2s ease",
                    opacity: hoveredIndex !== null && hoveredIndex !== arc.index ? 0.4 : 1,
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHoveredIndex(arc.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              ))}
              {/* Center text */}
              {hoveredIndex !== null ? (
                <>
                  <text x={cx} y={cy - 4} textAnchor="middle" className="asset-chart__svg-value">
                    {arcs[hoveredIndex].percentage}%
                  </text>
                  <text x={cx} y={cy + 14} textAnchor="middle" className="asset-chart__svg-label">
                    {arcs[hoveredIndex].name.length > 16
                      ? arcs[hoveredIndex].name.slice(0, 16) + "…"
                      : arcs[hoveredIndex].name}
                  </text>
                </>
              ) : (
                <>
                  <text x={cx} y={cy - 2} textAnchor="middle" className="asset-chart__svg-value" style={{ fontSize: "15px", fontWeight: "800" }}>
                    100%
                  </text>
                  <text x={cx} y={cy + 12} textAnchor="middle" className="asset-chart__svg-label" style={{ fontSize: "9px", fontWeight: "600" }}>
                    CƠ CẤU
                  </text>
                </>
              )}
            </svg>
          </div>

          <div className="asset-chart__legend">
            {allocation.map((item, i) => (
              <div
                key={i}
                className={`asset-chart__legend-item ${hoveredIndex === i ? "asset-chart__legend-item--active" : ""}`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span className="asset-chart__legend-dot" style={{ background: item.color }} />
                <span className="asset-chart__legend-name">{item.name}</span>
                <span className="asset-chart__legend-pct">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
