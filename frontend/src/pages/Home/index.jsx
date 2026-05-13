import { useState } from "react"
import { BANKS } from "@/data/mockData"
import { BankInfoSection } from "./sections/BankInfoSection"
import { InterestRateTable } from "./sections/InterestRateTable"
import { InterestHistorySection } from "./sections/InterestHistorySection"
import "./HomePage.scss"

export function HomePage() {
  const [activeBank, setActiveBank] = useState(BANKS.find((b) => b.code === "BIDV") || BANKS[0])

  return (
    <div className="home-page">
      <h1 className="home-page__title">Tra cứu lãi suất</h1>
      <p className="home-page__subtitle">Theo dõi và so sánh lãi suất tiết kiệm từ các ngân hàng mới nhất.</p>

      <BankInfoSection activeBank={activeBank} onBankChange={setActiveBank} />
      <InterestRateTable bankCode={activeBank.code} />
      <InterestHistorySection bankCode={activeBank.code} />
    </div>
  )
}
