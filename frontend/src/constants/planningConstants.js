/**
 * Các hằng số UI tĩnh cho phần Planning
 * Đây là cấu hình giao diện (không phải dữ liệu backend), nên giữ ở frontend
 */

/** Loại mục tiêu tiết kiệm (dùng cho UI goal selection) */
export const GOAL_TYPES = [
  { id: "house", label: "Mua nhà", icon: "🏠" },
  { id: "car", label: "Mua xe", icon: "🚗" },
  { id: "travel", label: "Du lịch", icon: "✈️" },
  { id: "education", label: "Học tập", icon: "🎓" },
  { id: "health", label: "Sức khỏe", icon: "🏥" },
  { id: "other", label: "Khác", icon: "💡" },
]

/** Các kỳ hạn tiết kiệm phổ biến */
export const TERMS = [
  { value: 1, label: "1 tháng" },
  { value: 3, label: "3 tháng" },
  { value: 6, label: "6 tháng" },
  { value: 9, label: "9 tháng" },
  { value: 12, label: "12 tháng" },
  { value: 18, label: "18 tháng" },
  { value: 24, label: "24 tháng" },
  { value: 36, label: "36 tháng" },
]
