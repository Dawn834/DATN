// ============================================
// Mock Data cho toàn bộ dự án
// ============================================

// ---- Danh sách Ngân hàng ----
export const BANKS = [
  { code: "VCB", name: "Vietcombank", fullName: "Ngân hàng TMCP Ngoại Thương Việt Nam", color: "#00713D" },
  { code: "BIDV", name: "BIDV", fullName: "Ngân hàng TMCP Đầu Tư và Phát Triển VN", color: "#003B7A" },
  { code: "CTG", name: "VietinBank", fullName: "Ngân hàng TMCP Công Thương Việt Nam", color: "#004A8F" },
  { code: "TCB", name: "Techcombank", fullName: "Ngân hàng TMCP Kỹ Thương Việt Nam", color: "#EE0033" },
  { code: "MB", name: "MB Bank", fullName: "Ngân hàng TMCP Quân Đội", color: "#004A8F" },
  { code: "VPB", name: "VPBank", fullName: "Ngân hàng TMCP Việt Nam Thịnh Vượng", color: "#036B3F" },
  { code: "ACB", name: "ACB", fullName: "Ngân hàng TMCP Á Châu", color: "#1A1A6C" },
  { code: "HDB", name: "HDBank", fullName: "Ngân hàng TMCP Phát Triển TP.HCM", color: "#E2231A" },
  { code: "TPB", name: "TPBank", fullName: "Ngân hàng TMCP Tiên Phong", color: "#5E2E8E" },
  { code: "VIB", name: "VIB", fullName: "Ngân hàng TMCP Quốc Tế Việt Nam", color: "#1B3C87" },
  { code: "SHB", name: "SHB", fullName: "Ngân hàng TMCP Sài Gòn - Hà Nội", color: "#005BAA" },
  { code: "STB", name: "Sacombank", fullName: "Ngân hàng TMCP Sài Gòn Thương Tín", color: "#00599D" },
  { code: "MSB", name: "MSB", fullName: "Ngân hàng TMCP Hàng Hải Việt Nam", color: "#002B5C" },
  { code: "LPB", name: "LPBank", fullName: "Ngân hàng TMCP Bưu Điện Liên Việt", color: "#00338D" },
  { code: "SSB", name: "SeABank", fullName: "Ngân hàng TMCP Đông Nam Á", color: "#C8102E" },
  { code: "OCB", name: "OCB", fullName: "Ngân hàng TMCP Phương Đông", color: "#1B4E9B" },
  { code: "KLB", name: "Kienlongbank", fullName: "Ngân hàng TMCP Kiên Long", color: "#E8272C" },
  { code: "NAB", name: "Nam A Bank", fullName: "Ngân hàng TMCP Nam Á", color: "#003DA5" },
  { code: "BVB", name: "BaoViet Bank", fullName: "Ngân hàng TMCP Bảo Việt", color: "#E4002B" },
  { code: "ABB", name: "ABBank", fullName: "Ngân hàng TMCP An Bình", color: "#005BAA" }
]

// ---- Các kỳ hạn (tháng) ----
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

// ---- Lãi suất theo ngân hàng ----
export const INTEREST_RATES = {
  VCB:  { 1: 1.6, 3: 2.0, 6: 3.0, 9: 3.0, 12: 4.7, 18: 4.7, 24: 4.7, 36: 4.7 },
  BIDV: { 1: 1.7, 3: 2.0, 6: 3.0, 9: 3.0, 12: 4.7, 18: 4.7, 24: 4.7, 36: 4.7 },
  CTG:  { 1: 1.7, 3: 2.0, 6: 3.0, 9: 3.0, 12: 4.7, 18: 4.7, 24: 4.7, 36: 4.7 },
  TCB:  { 1: 2.75, 3: 3.35, 6: 4.95, 9: 4.95, 12: 5.25, 18: 5.35, 24: 5.35, 36: 5.35 },
  MB:   { 1: 2.59, 3: 3.09, 6: 4.39, 9: 4.39, 12: 5.09, 18: 5.09, 24: 5.09, 36: 5.09 },
  VPB:  { 1: 2.9, 3: 3.4, 6: 5.0, 9: 5.0, 12: 5.3, 18: 5.3, 24: 5.4, 36: 5.4 },
  ACB:  { 1: 2.5, 3: 2.8, 6: 3.9, 9: 3.9, 12: 4.6, 18: 4.5, 24: 4.6, 36: 4.6 },
  HDB:  { 1: 2.85, 3: 3.35, 6: 4.85, 9: 4.95, 12: 5.55, 18: 5.65, 24: 5.65, 36: 5.65 },
  TPB:  { 1: 2.6, 3: 3.0, 6: 4.7, 9: 4.8, 12: 5.2, 18: 5.3, 24: 5.3, 36: 5.4 },
  VIB:  { 1: 2.3, 3: 2.9, 6: 4.3, 9: 4.4, 12: 5.0, 18: 5.0, 24: 5.0, 36: 5.0 },
  SHB:  { 1: 2.2, 3: 2.8, 6: 4.2, 9: 4.3, 12: 5.2, 18: 5.3, 24: 5.3, 36: 5.3 },
  STB:  { 1: 2.5, 3: 3.0, 6: 4.5, 9: 4.6, 12: 5.0, 18: 5.0, 24: 5.1, 36: 5.1 },
  MSB:  { 1: 2.7, 3: 3.2, 6: 4.7, 9: 4.8, 12: 5.3, 18: 5.4, 24: 5.4, 36: 5.4 },
  LPB:  { 1: 2.6, 3: 3.1, 6: 4.8, 9: 4.9, 12: 5.4, 18: 5.5, 24: 5.5, 36: 5.6 },
  SSB:  { 1: 2.65, 3: 3.15, 6: 4.75, 9: 4.85, 12: 5.2, 18: 5.3, 24: 5.3, 36: 5.4 },
  OCB:  { 1: 2.5, 3: 3.0, 6: 4.6, 9: 4.7, 12: 5.1, 18: 5.2, 24: 5.2, 36: 5.3 },
  KLB:  { 1: 2.9, 3: 3.4, 6: 5.1, 9: 5.1, 12: 5.5, 18: 5.5, 24: 5.6, 36: 5.7 },
  NAB:  { 1: 2.6, 3: 3.1, 6: 4.6, 9: 4.7, 12: 5.2, 18: 5.3, 24: 5.3, 36: 5.4 },
  BVB:  { 1: 2.55, 3: 3.05, 6: 4.5, 9: 4.6, 12: 5.1, 18: 5.2, 24: 5.2, 36: 5.3 },
  ABB:  { 1: 2.7, 3: 3.2, 6: 4.8, 9: 4.9, 12: 5.3, 18: 5.4, 24: 5.4, 36: 5.5 },
}

// ---- Thay đổi lãi suất so với tháng trước (đơn vị %) ----
export const RATE_CHANGES = {
  VCB:  { 1: 0, 3: 0, 6: 0, 9: 0, 12: 0.2, 18: 0.2, 24: 0.2, 36: 0 },
  BIDV: { 1: 0, 3: 0, 6: 0.1, 9: 0, 12: 0.2, 18: 0.2, 24: 0.2, 36: 0 },
  CTG:  { 1: 0, 3: 0, 6: 0, 9: 0, 12: 0.2, 18: 0.2, 24: 0, 36: 0 },
  TCB:  { 1: 0.15, 3: 0.25, 6: 0.35, 9: 0.35, 12: 0.1, 18: 0.1, 24: 0.1, 36: 0 },
  MB:   { 1: 0, 3: 0.1, 6: 0.2, 9: 0.2, 12: 0.1, 18: 0, 24: 0, 36: 0 },
  VPB:  { 1: 0.1, 3: 0.2, 6: 0.3, 9: 0.3, 12: 0.2, 18: 0.1, 24: 0.1, 36: 0 },
  ACB:  { 1: 0, 3: -0.1, 6: 0, 9: 0, 12: 0.1, 18: 0, 24: 0.1, 36: 0 },
  HDB:  { 1: 0.1, 3: 0.15, 6: 0.25, 9: 0.35, 12: 0.3, 18: 0.2, 24: 0.2, 36: 0.1 },
}

// ---- Lãi suất lịch sử 6 tháng gần nhất ----
export const HISTORICAL_RATES = {
  VCB: [
    { month: "T10/2025", rates: { 1: 1.6, 6: 2.8, 12: 4.5 } },
    { month: "T11/2025", rates: { 1: 1.6, 6: 2.9, 12: 4.5 } },
    { month: "T12/2025", rates: { 1: 1.6, 6: 3.0, 12: 4.5 } },
    { month: "T01/2026", rates: { 1: 1.6, 6: 3.0, 12: 4.5 } },
    { month: "T02/2026", rates: { 1: 1.6, 6: 3.0, 12: 4.5 } },
    { month: "T03/2026", rates: { 1: 1.6, 6: 3.0, 12: 4.7 } },
  ],
  BIDV: [
    { month: "T10/2025", rates: { 1: 1.7, 6: 2.7, 12: 4.5 } },
    { month: "T11/2025", rates: { 1: 1.7, 6: 2.8, 12: 4.5 } },
    { month: "T12/2025", rates: { 1: 1.7, 6: 2.9, 12: 4.5 } },
    { month: "T01/2026", rates: { 1: 1.7, 6: 2.9, 12: 4.5 } },
    { month: "T02/2026", rates: { 1: 1.7, 6: 3.0, 12: 4.5 } },
    { month: "T03/2026", rates: { 1: 1.7, 6: 3.0, 12: 4.7 } },
  ],
  TCB: [
    { month: "T10/2025", rates: { 1: 2.5, 6: 4.5, 12: 5.0 } },
    { month: "T11/2025", rates: { 1: 2.6, 6: 4.6, 12: 5.1 } },
    { month: "T12/2025", rates: { 1: 2.6, 6: 4.6, 12: 5.15 } },
    { month: "T01/2026", rates: { 1: 2.6, 6: 4.6, 12: 5.15 } },
    { month: "T02/2026", rates: { 1: 2.6, 6: 4.6, 12: 5.15 } },
    { month: "T03/2026", rates: { 1: 2.75, 6: 4.95, 12: 5.25 } },
  ],
}

// ---- Loại mục tiêu tiết kiệm ----
export const GOAL_TYPES = [
  { id: "house", label: "Mua nhà", icon: "🏠" },
  { id: "car", label: "Mua xe", icon: "🚗" },
  { id: "travel", label: "Du lịch", icon: "✈️" },
  { id: "education", label: "Học tập", icon: "🎓" },
  { id: "health", label: "Sức khỏe", icon: "🏥" },
  { id: "other", label: "Khác", icon: "💡" },
]

// ---- Phương thức rút lãi ----
export const WITHDRAWAL_METHODS = [
  { id: "compound", label: "Rút một lần", description: "Lãi gộp vào gốc, rút khi đáo hạn" },
  { id: "periodic", label: "Rút theo đợt", description: "Rút lãi hàng tháng/quý" },
]

// ---- Kỳ hạn cho planning ----
export const PLAN_TERMS = [
  { value: 6, label: "6 tháng" },
  { value: 12, label: "12 tháng" },
  { value: 24, label: "24 tháng" },
  { value: 36, label: "36 tháng" },
]

// ---- Kết quả phương án mẫu ----
export const PLAN_RESULTS = [
  {
    id: 1,
    bankCode: "MB",
    bankName: "MB Bank",
    rate: 5.09,
    term: 12,
    totalAmount: 10204082,
    interestEarned: 495240,
    monthlyDeposit: 0,
    maturityDate: "10/2026",
    badge: "Lãi suất tốt nhất"
  },
  {
    id: 2,
    bankCode: "VIB",
    bankName: "VIB",
    rate: 5.0,
    term: 12,
    totalAmount: 9705918,
    interestEarned: 237466,
    monthlyDeposit: 0,
    maturityDate: "10/2026",
    badge: null
  }
]

// ---- Danh sách khoản tiết kiệm đang quản lý ----
export const SAVINGS_ACCOUNTS = [
  {
    id: 1,
    bankCode: "MB",
    bankName: "MB Bank",
    planName: "Mua xe SH",
    goalType: "car",
    targetAmount: 88000000,
    currentAmount: 65000000,
    initialDeposit: 20000000,
    monthlyDeposit: 5000000,
    rate: 5.09,
    term: 12,
    startDate: "01/10/2025",
    endDate: "01/10/2026",
    progress: 74,
    status: "active",
    estimatedInterest: 556341,
  },
  {
    id: 2,
    bankCode: "TCB",
    bankName: "Techcombank",
    planName: "Du lịch Nhật",
    goalType: "travel",
    targetAmount: 50000000,
    currentAmount: 32500000,
    initialDeposit: 15000000,
    monthlyDeposit: 2500000,
    rate: 5.25,
    term: 12,
    startDate: "15/08/2025",
    endDate: "15/08/2026",
    progress: 65,
    status: "active",
    estimatedInterest: 420000,
  },
  {
    id: 3,
    bankCode: "VCB",
    bankName: "Vietcombank",
    planName: "Quỹ khẩn cấp",
    goalType: "other",
    targetAmount: 30000000,
    currentAmount: 28500000,
    initialDeposit: 20000000,
    monthlyDeposit: 1500000,
    rate: 4.7,
    term: 6,
    startDate: "01/12/2025",
    endDate: "01/06/2026",
    progress: 95,
    status: "near_maturity",
    estimatedInterest: 310000,
  },
  {
    id: 4,
    bankCode: "BIDV",
    bankName: "BIDV",
    planName: "Học MBA",
    goalType: "education",
    targetAmount: 200000000,
    currentAmount: 45000000,
    initialDeposit: 30000000,
    monthlyDeposit: 5000000,
    rate: 4.7,
    term: 24,
    startDate: "01/06/2025",
    endDate: "01/06/2027",
    progress: 22,
    status: "active",
    estimatedInterest: 1850000,
  },
]

// ---- Thống kê tổng quan Quản lý tài chính ----
export const FINANCIAL_STATS = {
  totalDeposit: 197000000,
  estimatedInterest: 8250000,
  averageRate: 5.25,
  nearMaturityCount: 2,
}

// ---- Phân bổ tài sản ----
export const ASSET_ALLOCATION = [
  { bank: "MB Bank", amount: 65000000, percentage: 38, color: "#004A8F" },
  { bank: "Techcombank", amount: 32500000, percentage: 19, color: "#EE0033" },
  { bank: "Vietcombank", amount: 28500000, percentage: 17, color: "#00713D" },
  { bank: "BIDV", amount: 45000000, percentage: 26, color: "#003B7A" },
]

// ---- Lịch sử hoạt động gần đây ----
export const RECENT_ACTIVITIES = [
  { id: 1, type: "deposit", description: "Gửi thêm 5.000.000đ vào kế hoạch \"Mua xe SH\"", date: "13/05/2026", bankCode: "MB" },
  { id: 2, type: "interest", description: "Nhận lãi 127.500đ từ kế hoạch \"Du lịch Nhật\"", date: "10/05/2026", bankCode: "TCB" },
  { id: 3, type: "create", description: "Tạo kế hoạch mới \"Quỹ khẩn cấp\"", date: "01/05/2026", bankCode: "VCB" },
  { id: 4, type: "deposit", description: "Gửi thêm 2.500.000đ vào kế hoạch \"Du lịch Nhật\"", date: "28/04/2026", bankCode: "TCB" },
  { id: 5, type: "maturity", description: "Kế hoạch \"Quỹ dự phòng\" đã đáo hạn", date: "25/04/2026", bankCode: "VPB" },
]

// ---- Thống kê trang Quản lý (theo Figma) ----
export const MANAGEMENT_STATS = [
  {
    icon: "💰",
    iconBg: "#EDF2FF",
    label: "Tổng tiền gửi",
    value: "997 tr",
    change: "▲ 8.2% 3 kế hoạch · MBBank & TCB",
    changeType: "up",
  },
  {
    icon: "📈",
    iconBg: "#F0FDF4",
    label: "Lãi ước tính",
    value: "82 tr",
    change: "▲ 12.4% Tổng đề MB lãi 8.50%",
    changeType: "up",
  },
  {
    icon: "📊",
    iconBg: "#FFF7ED",
    label: "Tổng tài sản",
    value: "997tr",
    change: "",
    changeType: "up",
  },
]

// ---- Danh sách kế hoạch cho trang Quản lý (theo Figma) ----
export const SAVINGS_PLANS = [
  {
    id: 1,
    planName: "Mua căn hộ 2026",
    bankCode: "MB",
    bankName: "MB Bank",
    initialDeposit: 100000000,
    monthlyDeposit: 30000000,
    targetAmount: 800000000,
    totalAmount: 808947390,
    rate: 8.5,
    term: 12,
    startDate: "08/05/2025",
    endDate: "08/05/2026",
    progress: 95,
    currentAmount: 190054040,
    status: "active",
    badge: "Tốt nhất",
  },
  {
    id: 2,
    planName: "Mua xe SH",
    bankCode: "MB",
    bankName: "MB Bank",
    initialDeposit: 100000000,
    monthlyDeposit: 30000000,
    targetAmount: 200000000,
    totalAmount: 808947390,
    rate: 8.2,
    term: 12,
    startDate: "08/05/2025",
    endDate: "08/05/2026",
    progress: 75,
    currentAmount: 150000000,
    status: "active",
    badge: "Đang chạy",
  },
  {
    id: 3,
    planName: "Du lịch Châu Âu",
    bankCode: "TCB",
    bankName: "Techcom Bank",
    initialDeposit: 800000000,
    monthlyDeposit: 0,
    targetAmount: 860000000,
    totalAmount: 808947390,
    rate: 7.68,
    term: 12,
    startDate: "01/05/2025",
    endDate: "01/05/2026",
    progress: 60,
    currentAmount: 52880000,
    status: "active",
    badge: null,
  },
]

// ---- Hàm tiện ích format tiền ----
export function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN").format(amount) + " đ"
}

// ---- Hàm tiện ích format số viết tắt ----
export function formatShortCurrency(amount) {
  if (amount >= 1e9) return (amount / 1e9).toFixed(1) + " tỷ"
  if (amount >= 1e6) return (amount / 1e6).toFixed(0) + " triệu"
  if (amount >= 1e3) return (amount / 1e3).toFixed(0) + "K"
  return amount.toString()
}
