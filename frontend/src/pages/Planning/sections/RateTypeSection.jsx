import { StepHeader } from "@/components/common/StepHeader"

export function RateTypeSection({ form, onFormChange }) {
  const updateField = (field, value) => {
    onFormChange({ ...form, [field]: value })
  }

  const rateType = form.rateType || "fixed"
  const channel = form.channel || "ONLINE"

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
            <span className="rate-type-section__item-label">Gửi cố định</span>
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
            <span className="rate-type-section__item-label">Gửi linh hoạt</span>
            <span className="rate-type-section__item-desc">
              Hệ thống sẽ tự động tìm phương án gửi tiết kiệm tối ưu nhất để đạt mục tiêu của bạn.
            </span>
          </div>
        </button>
      </div>

      <div className="rate-type-section__channel">
        <span className="rate-type-section__channel-label">Kênh gửi tiết kiệm</span>
        <div className="rate-type-section__channel-toggle">
          <button
            type="button"
            className={`rate-type-section__channel-btn ${channel === "ONLINE" ? "rate-type-section__channel-btn--active" : ""}`}
            onClick={() => updateField("channel", "ONLINE")}
          >
            <span className="rate-type-section__channel-icon">🌐</span>
            Online
          </button>
          <button
            type="button"
            className={`rate-type-section__channel-btn ${channel === "COUNTER" ? "rate-type-section__channel-btn--active" : ""}`}
            onClick={() => updateField("channel", "COUNTER")}
          >
            <span className="rate-type-section__channel-icon">🏦</span>
            Tại quầy
          </button>
        </div>
      </div>
    </section>
  )
}
