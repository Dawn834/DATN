import { PLAN_TERMS, WITHDRAWAL_METHODS } from "@/data/mockData"

export function PlanFormSection({ form, onFormChange }) {
  const updateField = (field, value) => {
    onFormChange({ ...form, [field]: value })
  }

  return (
    <section className="plan-form">
      <h3 className="plan-form__title">Thông tin kế hoạch</h3>
      <div className="plan-form__grid">
        {/* Tên kế hoạch */}
        <div className="plan-form__field">
          <label className="plan-form__label">Tiết kiệm cho</label>
          <input
            className="plan-form__input"
            placeholder="Ví dụ: Mua xe SH"
            value={form.planName}
            onChange={(e) => updateField("planName", e.target.value)}
          />
        </div>

        {/* Số tiền mục tiêu */}
        <div className="plan-form__field">
          <label className="plan-form__label">Giá trị (VNĐ)</label>
          <input
            className="plan-form__input"
            placeholder="88000000"
            type="number"
            value={form.targetAmount}
            onChange={(e) => updateField("targetAmount", e.target.value)}
          />
        </div>

        {/* Số tiền vốn ban đầu */}
        <div className="plan-form__field">
          <label className="plan-form__label">Số tiền vốn có (VNĐ)</label>
          <input
            className="plan-form__input"
            placeholder="20000000"
            type="number"
            value={form.initialDeposit}
            onChange={(e) => updateField("initialDeposit", e.target.value)}
          />
        </div>

        {/* Gửi thêm hàng tháng */}
        <div className="plan-form__field">
          <label className="plan-form__label">Gửi thêm/tháng (VNĐ)</label>
          <input
            className="plan-form__input"
            placeholder="0"
            type="number"
            value={form.monthlyDeposit}
            onChange={(e) => updateField("monthlyDeposit", e.target.value)}
          />
        </div>

        {/* Phương thức rút */}
        <div className="plan-form__field plan-form__field--full">
          <label className="plan-form__label">Bạn muốn rút tiền theo hình thức nào?</label>
          <div className="plan-form__radio-group">
            {WITHDRAWAL_METHODS.map((method) => (
              <label
                key={method.id}
                className={`plan-form__radio ${form.withdrawalMethod === method.id ? "plan-form__radio--active" : ""}`}
              >
                <input
                  type="radio"
                  name="withdrawal"
                  checked={form.withdrawalMethod === method.id}
                  onChange={() => updateField("withdrawalMethod", method.id)}
                />
                <span className="plan-form__radio-label">{method.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Thời hạn */}
        <div className="plan-form__field plan-form__field--full">
          <label className="plan-form__label">Thời hạn mong muốn</label>
          <div className="plan-form__terms">
            {PLAN_TERMS.map((t) => (
              <button
                key={t.value}
                className={`plan-form__term-chip ${form.term === t.value ? "plan-form__term-chip--active" : ""}`}
                onClick={() => updateField("term", t.value)}
              >
                {t.label}
              </button>
            ))}
            <span className="plan-form__date">→ tháng 10/2026</span>
          </div>
        </div>
      </div>
    </section>
  )
}
