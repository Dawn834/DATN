import { AlertTriangle } from "lucide-react"

export function AlertBannerSection() {
  return (
    <section className="alert-banner">
      <div className="alert-banner__icon">
        <AlertTriangle size={18} />
      </div>
      <div className="alert-banner__content">
        <span className="alert-banner__text">
          &quot;Mua căn hộ 2026&quot; sắp đáo hạn trong <strong>5 ngày</strong>
        </span>
        <span className="alert-banner__meta">
          MBBank · 12 tháng Online · 720,000,000 đ · Đáo hạn 15/05/2025
        </span>
      </div>
      <button className="alert-banner__cta">
        ⚡ Lên kế hoạch mới ngay
      </button>
    </section>
  )
}
