/**
 * Các hàm tiện ích format tiền tệ Việt Nam
 * Tách riêng khỏi mockData.js vì đây là logic thuần tuý, không phải dữ liệu mock
 */

/** Format số tiền đầy đủ theo chuẩn Việt Nam: 1.000.000 đ */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN").format(amount) + " VND"
}

/** Format số tiền viết tắt: 1.5 tỷ, 200 triệu, 50K */
export function formatShortCurrency(amount) {
  if (amount >= 1e9) return (amount / 1e9).toFixed(1) + " tỷ"
  if (amount >= 1e6) return (amount / 1e6).toFixed(0) + " triệu"
  if (amount >= 1e3) return (amount / 1e3).toFixed(0) + "K"
  return amount.toString()
}
