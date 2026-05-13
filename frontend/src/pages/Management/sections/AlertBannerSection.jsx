import { FINANCIAL_STATS } from "@/data/mockData"

export function AlertBannerSection() {
  if (FINANCIAL_STATS.nearMaturityCount === 0) return null

  return (
    <section className="alert-banner">
      <div className="alert-banner__content">
        <div className="alert-banner__icon">⚠</div>
        <div className="alert-banner__text">
          <strong>Bạn có {FINANCIAL_STATS.nearMaturityCount} khoản sắp đáo hạn </strong>
          <span>trong 30 ngày tới. Hãy xem xét tái tục hoặc rút tiền.</span>
        </div>
      </div>
      <button className="alert-banner__action">Xem chi tiết</button>
    </section>
  )
}
