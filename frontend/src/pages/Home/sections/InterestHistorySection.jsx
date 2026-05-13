import { useState } from "react"
import { HISTORICAL_RATES } from "@/data/mockData"

const FILTER_TERMS = [
  { value: 1, label: "1 tháng" },
  { value: 6, label: "6 tháng" },
  { value: 12, label: "12 tháng" },
]

export function InterestHistorySection({ bankCode }) {
  const [activeTerm, setActiveTerm] = useState(12)
  const history = HISTORICAL_RATES[bankCode] || HISTORICAL_RATES["VCB"]

  const maxRate = Math.max(...history.map((h) => h.rates[activeTerm] || 0))

  return (
    <section className="rate-history">
      <div className="rate-history__header">
        <h3 className="rate-history__title">Lãi suất qua các kỳ - {bankCode}</h3>
        <div className="rate-history__tabs">
          {FILTER_TERMS.map((t) => (
            <button
              key={t.value}
              className={`rate-history__tab ${activeTerm === t.value ? "rate-history__tab--active" : ""}`}
              onClick={() => setActiveTerm(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rate-history__chart">
        {history.map((item, idx) => {
          const rate = item.rates[activeTerm] || 0
          const height = maxRate > 0 ? (rate / maxRate) * 100 : 0
          return (
            <div key={idx} className="rate-history__bar-group">
              <span className="rate-history__bar-value">{rate}%</span>
              <div
                className="rate-history__bar"
                style={{
                  height: `${Math.max(height, 5)}%`,
                  background: idx === history.length - 1 ? "#1A73E8" : "#93C5FD",
                }}
              />
              <span className="rate-history__bar-label">{item.month}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
