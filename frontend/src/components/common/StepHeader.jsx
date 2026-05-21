import "./StepHeader.scss"

export function StepHeader({ step, title, subtitle }) {
  return (
    <div className="step-header">
      <span className="step-header__badge">Bước {step}</span>
      <h3 className="step-header__title">{title}</h3>
      {subtitle && <p className="step-header__subtitle">{subtitle}</p>}
    </div>
  )
}
