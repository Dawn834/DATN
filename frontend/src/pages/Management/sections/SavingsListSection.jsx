import { SAVINGS_ACCOUNTS, BANKS, formatCurrency } from "@/data/mockData"

export function SavingsListSection() {
  return (
    <section className="savings-list">
      <h3 className="savings-list__title">Danh sách khoản tiết kiệm</h3>

      {SAVINGS_ACCOUNTS.map((account) => {
        const bank = BANKS.find((b) => b.code === account.bankCode)
        return (
          <div key={account.id} className="savings-list__item">
            <div className="savings-list__item-header">
              <div className="savings-list__item-bank">
                <div
                  className="savings-list__item-logo"
                  style={{ background: bank?.color || "#333" }}
                >
                  {account.bankCode}
                </div>
                <div>
                  <div className="savings-list__item-name">
                    {account.bankName} - {account.planName}
                    <span
                      className={`savings-list__item-status ${
                        account.status === "near_maturity"
                          ? "savings-list__item-status--near"
                          : "savings-list__item-status--active"
                      }`}
                    >
                      {account.status === "near_maturity" ? "Sắp đáo hạn" : "Đang chạy"}
                    </span>
                  </div>
                  <div className="savings-list__item-plan">
                    {account.startDate} → {account.endDate} • {account.term} tháng
                  </div>
                </div>
              </div>
              <div className="savings-list__item-rate">{account.rate}%/năm</div>
            </div>

            <div className="savings-list__progress">
              <div
                className="savings-list__progress-fill"
                style={{
                  width: `${account.progress}%`,
                  background: account.status === "near_maturity" ? "#F97316" : "#1A73E8",
                }}
              />
            </div>

            <div className="savings-list__item-footer">
              <span>{formatCurrency(account.currentAmount)} / {formatCurrency(account.targetAmount)}</span>
              <span>{account.progress}% hoàn thành</span>
            </div>
          </div>
        )
      })}
    </section>
  )
}
