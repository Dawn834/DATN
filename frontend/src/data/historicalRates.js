/**
 * Mock data giả lập lịch sử thay đổi lãi suất qua các tháng gần đây.
 * Hỗ trợ định dạng để vẽ biểu đồ cột cho từng ngân hàng.
 */

// Phân nhóm ngân hàng theo nhóm lãi suất thực tế để giả lập chính xác nhất
const TIER_BIG4 = ["VCB", "VCBNEO", "BIDV", "VBA", "AGRIBANK", "CTG", "VIETTINBANK"];

const TIER_MEDIUM = [
  "MB",
  "TPB",
  "SHB",
  "MSB",
  "SSB",
  "SEABANK",
  "VPB",
  "VPBANK",
  "VIB",
  "TCB",
  "TECHCOMBANK",
  "ACB",
  "STB",
  "SACOMBANK",
];

/**
 * Hàm sinh lịch sử lãi suất ổn định & nhất quán (Deterministic) dựa trên mã ngân hàng và lãi suất hiện tại.
 * Đảm bảo:
 *  - Lãi suất tháng hiện tại khớp 100% với dữ liệu thật trong InterestRateTable.
 *  - Các tháng trước đó được sinh tự động dựa trên mức lãi suất hiện tại để giữ độ logic.
 */
export function getMockHistoricalRates(bankCode, currentRates = null) {
  const code = bankCode?.toUpperCase().replace(/[^A-Z0-9]/g, "") || "VCB";

  // Tạo hàm băm (hash) từ mã ngân hàng để tạo độ lệch đặc trưng
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = code.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const months = [
    "Tháng 01/2026",
    "Tháng 02/2026",
    "Tháng 03/2026",
    "Tháng 04/2026",
    "Tháng 05/2026",
    "Tháng 06/2026", // Tháng hiện tại
  ];

  // Kiểm tra xem có dữ liệu lãi suất thật truyền vào không
  const hasCurrent = currentRates && 
                     ((currentRates.online && Object.keys(currentRates.online).length > 0) ||
                      (currentRates.counter && Object.keys(currentRates.counter).length > 0));

  return months.map((month, idx) => {
    const isCurrentMonth = idx === months.length - 1;
    const rates = {
      online: {},
      counter: {},
    };

    // Các kỳ hạn hiển thị biểu đồ
    const terms = [1, 3, 6, 9, 12, 18, 24, 36];

    // Xác định mức lãi suất cơ sở làm fallback nếu không có dữ liệu thật
    let fallbackBaseRates;
    if (TIER_BIG4.includes(code)) {
      fallbackBaseRates = { 1: 1.6, 3: 1.9, 6: 2.9, 9: 2.9, 12: 4.6, 18: 4.6, 24: 4.7, 36: 4.7 };
    } else if (TIER_MEDIUM.includes(code)) {
      fallbackBaseRates = { 1: 2.8, 3: 3.2, 6: 4.2, 9: 4.4, 12: 5.0, 18: 5.2, 24: 5.4, 36: 5.6 };
    } else {
      fallbackBaseRates = { 1: 3.2, 3: 3.5, 6: 4.8, 9: 5.0, 12: 5.8, 18: 6.0, 24: 6.2, 36: 6.5 };
    }

    const bankOffset = ((hash % 5) - 2) * 0.1;

    terms.forEach((term) => {
      // Lấy lãi suất thật từ database làm mốc chuẩn
      let currentOnline = hasCurrent ? currentRates.online[term] : null;
      let currentCounter = hasCurrent ? currentRates.counter[term] : null;

      // Nếu database thiếu kỳ hạn này, sử dụng giá trị fallback
      if (currentOnline === undefined || currentOnline === null) {
        currentOnline = fallbackBaseRates[term] + bankOffset + 0.2;
      }
      if (currentCounter === undefined || currentCounter === null) {
        currentCounter = fallbackBaseRates[term] + bankOffset;
      }

      if (isCurrentMonth) {
        // Tháng hiện tại (Tháng 6): Khớp 100% với bảng lãi suất
        rates.online[term] = parseFloat(currentOnline.toFixed(2));
        rates.counter[term] = parseFloat(currentCounter.toFixed(2));
      } else {
        // Các tháng trước đó: Giảm dần theo xu hướng lịch sử phát triển
        const monthsDiff = months.length - 1 - idx;
        const trendOffset = -monthsDiff * 0.08; // Lãi suất tháng trước thấp hơn
        const microFluctuation = (((hash + idx) % 3) - 1) * 0.04; // Biến động nhỏ riêng biệt

        rates.online[term] = parseFloat(Math.max(0.1, currentOnline + trendOffset + microFluctuation).toFixed(2));
        rates.counter[term] = parseFloat(Math.max(0.1, currentCounter + trendOffset + microFluctuation).toFixed(2));
      }
    });

    return {
      month,
      rates,
    };
  });
}
