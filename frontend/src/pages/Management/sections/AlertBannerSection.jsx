import { AlertTriangle } from "lucide-react"

export function AlertBannerSection() {
  return (
    <section className="alert-banner alert-banner--overdue">
      <div className="alert-banner__icon">
        <AlertTriangle size={18} />
      </div>
      <div className="alert-banner__content">
        <span className="alert-banner__text">
          &quot;Mua căn hộ 2026&quot; đã quá hạn <strong>2 ngày</strong>
        </span>
        <span className="alert-banner__meta">
          MBBank · 12 tháng Online · 720.000.000 VND · Đáo hạn 11/05/2026
        </span>
      </div>
      <button className="alert-banner__cta">
        ⚡ Xử lý đáo hạn ngay
      </button>
    </section>
  )
}
