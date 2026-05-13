import { INTEREST_RATES, RATE_CHANGES, TERMS } from "@/data/mockData"

export function InterestRateTable({ bankCode }) {
  const rates = INTEREST_RATES[bankCode] || {}
  const changes = RATE_CHANGES[bankCode] || {}

  const renderChange = (val) => {
    if (!val || val === 0) return <span className="rate-table__change rate-table__change--neutral">-</span>
    if (val > 0) return <span className="rate-table__change rate-table__change--up">+{val}%</span>
    return <span className="rate-table__change rate-table__change--down">{val}%</span>
  }

  return (
    <section className="rate-table">
      <div className="rate-table__title">
        Lãi suất tiền gửi cá nhân - {bankCode}
        <span className="rate-table__badge">Đơn vị: %/năm</span>
      </div>

      <table>
        <thead>
          <tr>
            <th></th>
            {TERMS.map((t) => (
              <th key={t.value}>{t.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Lãi suất</td>
            {TERMS.map((t) => (
              <td key={t.value}>
                <span className="rate-table__rate">{rates[t.value] ?? "-"}</span>
              </td>
            ))}
          </tr>
          <tr>
            <td>Thay đổi</td>
            {TERMS.map((t) => (
              <td key={t.value}>{renderChange(changes[t.value])}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </section>
  )
}
