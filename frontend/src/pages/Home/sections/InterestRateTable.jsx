import { useState, useEffect } from "react"
import { bankService } from "@/services/bankService"
import { TERMS } from "@/constants/planningConstants"

// ============================================================================
// REACT COMPONENT — Bảng lãi suất tiền gửi
// Dữ liệu được lấy từ backend API qua bankService
// ============================================================================
export function InterestRateTable({ bankId, bankCode }) {
  const [rates, setRates] = useState({})
  const [changes, setChanges] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)

        // Gửi request đến FastAPI backend
        const liveRates = await bankService.getRatesForBank(bankId)
        const liveChanges = await bankService.getRateChangesForBank(bankId)

        // Cập nhật dữ liệu vào giao diện
        setRates(liveRates)
        setChanges(liveChanges)
      } catch (err) {
        console.error("Lỗi gọi API:", err)
      } finally {
        setLoading(false)
      }
    }

    if (bankId) {
      loadData()
    }
  }, [bankId])

  const renderChange = (val) => {
    if (!val || val === 0) return <span className="rate-table__change rate-table__change--neutral">-</span>
    if (val > 0) return <span className="rate-table__change rate-table__change--up">+{val}%</span>
    return <span className="rate-table__change rate-table__change--down">{val}%</span>
  }

  if (loading) {
    return (
      <section className="rate-table" style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ color: "#1A73E8", fontWeight: "bold" }}>
          🔄 Đang lấy bảng lãi suất của {bankCode}...
        </div>
      </section>
    )
  }

  return (
    <section className="rate-table">
      <div className="rate-table__title">
        Lãi suất tiền gửi cá nhân - {bankCode}
        <span className="rate-table__badge">Đơn vị: %/năm (Dữ liệu từ Web giá)</span>
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
            <td>Lãi suất (tại quầy - online)</td>
            {TERMS.map((t) => (
              <td key={t.value}>
                <span className="rate-table__rate">
                  {rates.counter?.[t.value] ?? "-"} - {rates.online?.[t.value] ?? "-"}
                </span>
              </td>
            ))}
          </tr>
          <tr>
            <td>Thay đổi</td>
            {TERMS.map((t) => {
              const onlineRate = rates.online?.[t.value]
              const counterRate = rates.counter?.[t.value]
              const diff = (onlineRate !== undefined && counterRate !== undefined)
                ? parseFloat((onlineRate - counterRate).toFixed(4))
                : 0
              return (
                <td key={t.value}>
                  {renderChange(diff)}
                </td>
              )
            })}
          </tr>
        </tbody>
      </table>
    </section>
  )
}
