import { StatCardsSection } from "./sections/StatCardsSection"
import { AlertBannerSection } from "./sections/AlertBannerSection"
import { PlanListSection } from "./sections/PlanListSection"
import { AssetChartSection } from "./sections/AssetChartSection"
import "./ManagementPage.scss"

export function ManagementPage() {
  return (
    <div className="management-page">
      <div className="management-page__header">
        <div>
          <h1 className="management-page__title">📊 Quản lý tài chính</h1>
          <p className="management-page__subtitle">
            Tổng quan 3 kế hoạch đang hoạt động · Cập nhật 10/05/2025
          </p>
        </div>
        <div className="management-page__actions">
          <button className="management-page__btn management-page__btn--outline">
            Xuất báo cáo
          </button>
          <button className="management-page__btn management-page__btn--primary">
            + Thêm kế hoạch mới
          </button>
        </div>
      </div>

      <AlertBannerSection />
      <StatCardsSection />

      <div className="management-page__grid">
        <PlanListSection />
        <AssetChartSection />
      </div>
    </div>
  )
}
