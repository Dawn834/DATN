import { StepHeader } from "@/components/common/StepHeader"

const TIME_OPTIONS = [
  { value: 12, label: "12 tháng" },
  { value: 24, label: "24 tháng" },
  { value: 36, label: "36 tháng" },
  { value: 48, label: "48 tháng" },
  { value: 60, label: "5 năm" },
]

export function CapitalSection({ form, onFormChange }) {
  const updateField = (field, value) => {
    onFormChange({ ...form, [field]: value })
  }

  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const handleDepositChange = (field, val) => {
    const rawValue = val.replace(/\D/g, "");
    const numValue = rawValue ? parseInt(rawValue, 10) : "";
    updateField(field, numValue);
  };

  // Slider value mapping: 1-60 months
  const sliderValue = form.term || 24
  const sliderPercent = ((sliderValue - 1) / (60 - 1)) * 100

  return (
    <section className="capital-section">
      <StepHeader
        step={2}
        title="Vốn hiện có"
        subtitle="Số tiền đang có để bắt đầu tích lũy"
      />

      <div className="capital-section__grid">
        <div className="capital-section__field">
          <label className="capital-section__label">Tiền hiện có (đ)</label>
          <div className="capital-section__input-wrap">
            <input
              className="capital-section__input"
              type="text"
              placeholder="150.000.000"
              value={formatCurrency(form.initialDeposit)}
              onChange={(e) => handleDepositChange("initialDeposit", e.target.value)}
            />
            <span className="capital-section__unit">đ</span>
          </div>
        </div>
      </div>

      <div className="capital-section__slider-section">
        <label className="capital-section__label">Thời gian tích lũy mong muốn</label>
        <div className="capital-section__chips">
          {TIME_OPTIONS.map((t) => (
            <button
              key={t.value}
              className={`capital-section__chip ${form.term === t.value ? "capital-section__chip--active" : ""}`}
              onClick={() => updateField("term", t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="capital-section__slider-wrap">
          <div className="capital-section__slider-header">
            <label className="capital-section__label">Điều chỉnh chính xác</label>
            <span className="capital-section__slider-value">
              {sliderValue < 12 ? (
                <>
                  <span className="capital-section__slider-number">{sliderValue}</span>
                  <span className="capital-section__slider-unit"> tháng</span>
                </>
              ) : sliderValue % 12 === 0 ? (
                <>
                  <span className="capital-section__slider-number">{sliderValue / 12}</span>
                  <span className="capital-section__slider-unit"> năm</span>
                </>
              ) : (
                <>
                  <span className="capital-section__slider-number">{Math.floor(sliderValue / 12)}</span>
                  <span className="capital-section__slider-unit"> năm </span>
                  <span className="capital-section__slider-number">{sliderValue % 12}</span>
                  <span className="capital-section__slider-unit"> tháng</span>
                </>
              )}
            </span>
          </div>
          <div className="capital-section__slider-row">
            <input
              type="range"
              className="capital-section__slider"
              min="1"
              max="60"
              step="1"
              value={sliderValue}
              onChange={(e) => updateField("term", Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, #3B5BDB ${sliderPercent}%, #E2E8F0 ${sliderPercent}%)`,
              }}
            />
          </div>
          <div className="capital-section__slider-marks">
            <span>1T</span>
            <span>12T</span>
            <span>24T</span>
            <span>36T</span>
            <span>48T</span>
            <span>60T</span>
          </div>
        </div>
      </div>
    </section>
  )
}
