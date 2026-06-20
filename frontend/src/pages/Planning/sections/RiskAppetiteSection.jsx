import { StepHeader } from "@/components/common/StepHeader"

const RISK_OPTIONS = [
  {
    id: "high",
    label: "Rủi ro cao",
    icon: "🔥",
    color: "#e03131",
    bgColor: "rgba(224, 49, 49, 0.08)",
    borderColor: "rgba(224, 49, 49, 0.3)",
    desc: "Ưu tiên lãi suất cao nhất, chấp nhận biến động lãi suất và rủi ro thanh khoản.",
  },
  {
    id: "medium",
    label: "Rủi ro trung bình",
    icon: "⚖️",
    color: "#e67700",
    bgColor: "rgba(230, 119, 0, 0.08)",
    borderColor: "rgba(230, 119, 0, 0.3)",
    desc: "Cân bằng giữa lãi suất tốt và mức độ an toàn. Phù hợp đa số người dùng.",
  },
  {
    id: "low",
    label: "Rủi ro thấp",
    icon: "🛡️",
    color: "#2b8a3e",
    bgColor: "rgba(43, 138, 62, 0.08)",
    borderColor: "rgba(43, 138, 62, 0.3)",
    desc: "Ưu tiên an toàn tuyệt đối, chọn ngân hàng uy tín và kỳ hạn ổn định.",
  },
]

export function RiskAppetiteSection({ riskLevel, onRiskChange, step = 4 }) {
  return (
    <section className="risk-appetite-section">
      <StepHeader
        step={step}
        title="Khẩu vị rủi ro"
        subtitle="Chọn mức độ rủi ro phù hợp với bạn"
      />
      <div className="risk-appetite-section__grid">
        {RISK_OPTIONS.map((option) => {
          const isActive = riskLevel === option.id
          return (
            <button
              key={option.id}
              type="button"
              className={`risk-appetite-section__item ${isActive ? "risk-appetite-section__item--active" : ""}`}
              onClick={() => onRiskChange(option.id)}
              style={{
                "--risk-color": option.color,
                "--risk-bg": option.bgColor,
                "--risk-border": option.borderColor,
              }}
            >
              <span className="risk-appetite-section__item-icon">{option.icon}</span>
              <div className="risk-appetite-section__item-content">
                <span className="risk-appetite-section__item-label">{option.label}</span>
                <span className="risk-appetite-section__item-desc">{option.desc}</span>
              </div>
              {isActive && (
                <span className="risk-appetite-section__check">✓</span>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
