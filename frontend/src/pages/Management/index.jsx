import { StatCardsSection } from "./sections/StatCardsSection"
import { AlertBannerSection } from "./sections/AlertBannerSection"
import { SavingsListSection } from "./sections/SavingsListSection"
import { AssetChartSection } from "./sections/AssetChartSection"
import { RecentActivitySection } from "./sections/RecentActivitySection"
import "./ManagementPage.scss"

export function ManagementPage() {
  return (
    <div className="management-page">
      <h1 className="management-page__title">Quản lý tài chính</h1>
      <p className="management-page__subtitle">Theo dõi các khoản tiết kiệm và phân bổ tài sản của bạn.</p>

      <StatCardsSection />
      <AlertBannerSection />

      <div className="management-page__grid">
        <div>
          <SavingsListSection />
        </div>
        <div>
          <AssetChartSection />
          <RecentActivitySection />
        </div>
      </div>
    </div>
  )
}
