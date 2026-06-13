import { StepHeader } from "@/components/common/StepHeader"

export function RateTypeSection({ form, onFormChange }) {
  const updateField = (field, value) => {
    onFormChange({ ...form, [field]: value })
  }

  const rateType = form.rateType || "fixed"

  return (
    <section className="rate-type-section">
      <StepHeader
        step={3}
        title="Phương thức tính lãi suất"
        subtitle="Chọn cách thức phân bổ tiền gửi tiết kiệm"
      />
      <div className="rate-type-section__grid">
        <button
          type="button"
          className={`rate-type-section__item ${rateType === "fixed" ? "rate-type-section__item--active" : ""}`}
          onClick={() => updateField("rateType", "fixed")}
        >
          <span className="rate-type-section__item-icon">🔒</span>
          <div className="rate-type-section__item-content">
            <span className="rate-type-section__item-label">Lãi suất cứng</span>
            <span className="rate-type-section__item-desc">
              Gửi cố định 1 kỳ hạn duy nhất suốt thời gian tích lũy. An toàn, dễ quản lý.
            </span>
          </div>
        </button>

        <button
          type="button"
          className={`rate-type-section__item ${rateType === "dynamic" ? "rate-type-section__item--active" : ""}`}
          onClick={() => updateField("rateType", "dynamic")}
        >
          <span className="rate-type-section__item-icon">⚡</span>
          <div className="rate-type-section__item-content">
            <span className="rate-type-section__item-label">Lãi suất động</span>
            <span className="rate-type-section__item-desc">
              Tối ưu chia nhỏ và tái tục kỳ hạn thông minh (Dynamic Programming). Lợi nhuận cao nhất.
            </span>
          </div>
        </button>
      </div>
    </section>
  )
}
