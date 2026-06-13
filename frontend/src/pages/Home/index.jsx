import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { bankService } from "@/services/bankService"
import { BankInfoSection } from "./sections/BankInfoSection"
import { InterestRateTable } from "./sections/InterestRateTable"
import { InterestHistorySection } from "./sections/InterestHistorySection"
import "./HomePage.scss"

export function HomePage() {
  const [banks, setBanks] = useState([])
  const [activeBank, setActiveBank] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const bankIdParam = searchParams.get("bankId")

  useEffect(() => {
    async function loadBanks() {
      try {
        setLoading(true)
        const list = await bankService.getBanks()
        setBanks(list)
        
        const initial = bankIdParam
          ? list.find((b) => String(b.id) === bankIdParam) || list.find((b) => b.code === "BIDV") || list[0]
          : list.find((b) => b.code === "BIDV") || list[0]
        setActiveBank(initial)
      } catch (err) {
        console.error("Error loading banks:", err)
      } finally {
        setLoading(false)
      }
    }
    loadBanks()
  }, [])

  useEffect(() => {
    if (banks.length > 0 && bankIdParam) {
      const selected = banks.find((b) => String(b.id) === bankIdParam)
      if (selected) {
        setActiveBank(selected)
      }
    }
  }, [bankIdParam, banks])

  if (loading || !activeBank) {
    return (
      <div className="home-page" style={{ padding: "40px", textAlign: "center" }}>
        <h1 className="home-page__title">Tra cứu lãi suất</h1>
        <div style={{ marginTop: "40px", fontSize: "16px", color: "#64748B" }}>
          Đang tải dữ liệu ngân hàng...
        </div>
      </div>
    )
  }

  return (
    <div className="home-page">
      <h1 className="home-page__title">Tra cứu lãi suất</h1>
      <p className="home-page__subtitle">Theo dõi và so sánh lãi suất tiết kiệm từ các ngân hàng mới nhất.</p>

      <BankInfoSection banks={banks} activeBank={activeBank} onBankChange={setActiveBank} />
      <InterestRateTable bankId={activeBank.id} bankCode={activeBank.code} />
      <InterestHistorySection bankId={activeBank.id} bankCode={activeBank.code} />
    </div>
  )
}
