import "./BankTag.scss"

export function BankTag({ bank, isActive, onClick, className = "" }) {
  return (
    <button
      className={`bank-tag ${isActive ? "bank-tag--active" : ""} ${className}`}
      onClick={() => onClick?.(bank)}
    >
      {/* <span
        className="bank-tag__dot"
        style={{ background: bank.color }}
      /> */}
      <span>{bank.name}</span>
    </button>
  )
}

export function BankTagMore({ count, onClick }) {
  return (
    <button className="bank-tag bank-tag--more" onClick={onClick}>
      + {count} ngân hàng
    </button>
  )
}
