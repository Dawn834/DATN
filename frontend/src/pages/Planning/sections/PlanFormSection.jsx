export function PlanFormSection({ form, onFormChange }) {
  const updateField = (field, value) => {
    onFormChange({ ...form, [field]: value })
  }

  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const numValue = rawValue ? parseInt(rawValue, 10) : "";
    updateField("targetAmount", numValue);
  };

  return (
    <section className="plan-form">
      <div className="plan-form__grid">
        {/* Tên mục tiêu */}
        <div className="plan-form__field">
          <label className="plan-form__label">Tên mục tiêu</label>
          <input
            className="plan-form__input"
            placeholder="Nhập tên mục tiêu"
            value={form.planName}
            onChange={(e) => updateField("planName", e.target.value)}
          />
        </div>

        {/* Số tiền cần đạt */}
        <div className="plan-form__field">
          <label className="plan-form__label">Số tiền cần đạt (Vnđ)</label>
          <input
            className="plan-form__input"
            placeholder="Nhập số tiền"
            type="text"
            value={formatCurrency(form.targetAmount)}
            onChange={handleAmountChange}
          />
        </div>
      </div>
    </section>
  )
}

