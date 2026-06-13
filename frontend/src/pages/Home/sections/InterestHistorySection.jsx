import { useState, useEffect } from "react"
import { bankService } from "@/services/bankService"
import { TERMS } from "@/constants/planningConstants"


export function InterestHistorySection({ bankId, bankCode }) {
  const [activeTerm, setActiveTerm] = useState(12)
  const [activeChannel, setActiveChannel] = useState("online") // 'online' or 'counter'
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true)
        const data = await bankService.getHistoricalRates(bankId)
        setHistory(data)
      } catch (err) {
        console.error("Error loading historical rates:", err)
      } finally {
        setLoading(false)
      }
    }
    if (bankId) {
      fetchHistory()
    }
  }, [bankId])

  if (loading) {
    return (
      <section className="rate-history" style={{ textAlign: "center", padding: "30px 0" }}>
        <div style={{ color: "#64748B" }}>Đang tải lịch sử lãi suất...</div>
      </section>
    )
  }

  const getRateForTerm = (item, term) => {
    if (!item || !item.rates) return 0
    if (item.rates[activeChannel]) {
      return item.rates[activeChannel][term] || 0
    }
    if (item.rates[term] && typeof item.rates[term] === "object") {
      return item.rates[term][activeChannel] || 0
    }
    return item.rates[term] || 0
  }

  const maxRate = history.length > 0 ? Math.max(...history.map((h) => getRateForTerm(h, activeTerm))) : 0

  return (
    <section className="rate-history">
      <div className="rate-history__header">
        <h3 className="rate-history__title">Lãi suất qua các kỳ - {bankCode}</h3>
        
        <div className="channel-tabs">
          <button
            className={`channel-tab ${activeChannel === "counter" ? "channel-tab--active" : ""}`}
            onClick={() => setActiveChannel("counter")}
          >
            Tại quầy
          </button>
          <button
            className={`channel-tab ${activeChannel === "online" ? "channel-tab--active" : ""}`}
            onClick={() => setActiveChannel("online")}
          >
            Online
          </button>
        </div>

        <div className="rate-history__tabs">
          {TERMS.map((t) => (
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
          const rate = getRateForTerm(item, activeTerm)
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
