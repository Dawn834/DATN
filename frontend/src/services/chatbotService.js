/**
 * Chatbot Service — xử lý tin nhắn AI chatbot
 * Sử dụng bankService và apiClient để kết nối với backend AI Agent
 */
import { bankService } from "./bankService";
import { apiClient } from "./apiClient";

export const chatbotService = {
  async sendMessage(messageHistory, text) {
    console.log("[Chatbot Service] Sending message to backend:", text);

    try {
      const token = localStorage.getItem("datn_token");
      const endpoint = token ? "/chatbot/stream" : "/chatbot/public";
      const res = await apiClient.post(endpoint, { prompt: text });

      if (res?.data && res.data.answer) {
        return {
          role: "ai",
          content: res.data.answer,
        };
      }
    } catch (err) {
      console.warn("[Chatbot Service] Backend API failed, falling back to local rules:", err);
    }

    // --- FALLBACK LOCAL HEURISTICS ---
    // Giả lập độ trễ 1 giây
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const cleanText = text.toLowerCase().trim();

    // Lấy dữ liệu ngân hàng từ backend
    let banks = [];
    try {
      banks = await bankService.getBanks();
    } catch (err) {
      console.warn("[Chatbot] Không thể lấy danh sách ngân hàng:", err);
    }

    // 1. Tìm ngân hàng có lãi suất cao nhất
    if (cleanText.includes("cao nhất") || cleanText.includes("lãi suất cao")) {
      try {
        const ratesData = await bankService.getBankRates(12);
        if (ratesData && ratesData.length > 0) {
          const sorted = [...ratesData].sort((a, b) => b.rate - a.rate);
          const top = sorted[0];
          return {
            role: "ai",
            content: `Hiện tại, lãi suất cao nhất cho kỳ hạn **12 tháng** là **${top.rate}%/năm** tại ngân hàng **${top.bank || "chưa xác định"}**.\n\nNgoài ra, các ngân hàng thương mại cổ phần tư nhân cũng đang có mức lãi suất hấp dẫn. Bạn có thể tra cứu chi tiết trên trang **Tra cứu lãi suất**.`,
          };
        }
      } catch (err) {
        console.warn("[Chatbot] Lỗi khi tìm lãi suất cao nhất:", err);
      }

      return {
        role: "ai",
        content: "Xin lỗi, tôi chưa thể tra cứu lãi suất lúc này. Vui lòng thử lại sau hoặc kiểm tra trên trang **Tra cứu lãi suất**.",
      };
    }

    // 2. Tra cứu theo kỳ hạn cụ thể (ví dụ: 12 tháng)
    const termMatch = cleanText.match(/(kỳ hạn|thời hạn|gửi)\s*(\d+)\s*tháng/);
    if (termMatch) {
      const term = Number(termMatch[2]);
      try {
        const ratesData = await bankService.getBankRates(term);
        if (ratesData && ratesData.length > 0) {
          const sorted = [...ratesData].sort((a, b) => b.rate - a.rate);
          const top3 = sorted.slice(0, 3);
          const topList = top3.map((item, idx) => `${idx + 1}. **${item.bank || "Ngân hàng"}**: ${item.rate}%/năm`).join("\n");

          return {
            role: "ai",
            content: `Dưới đây là Top 3 ngân hàng có lãi suất tốt nhất cho kỳ hạn **${term} tháng**:\n\n${topList}\n\nBạn có thể vào tab **Lập kế hoạch** để tính toán số tiền lãi chính xác nhận được dựa trên số vốn ban đầu của mình nhé!`,
          };
        }
      } catch (err) {
        console.warn("[Chatbot] Lỗi khi tra cứu kỳ hạn:", err);
      }

      return {
        role: "ai",
        content: `Xin lỗi, tôi chưa tìm được dữ liệu lãi suất cho kỳ hạn ${term} tháng. Vui lòng kiểm tra trên trang **Tra cứu lãi suất**.`,
      };
    }

    // 3. Tư vấn chọn ngân hàng
    if (cleanText.includes("ngân hàng nào") || cleanText.includes("nên gửi") || cleanText.includes("so sánh")) {
      return {
        role: "ai",
        content: `Khi gửi tiết kiệm, bạn nên cân nhắc giữa **mức độ an toàn** và **lợi nhuận (lãi suất)**:\n\n1. **Nhóm Big 4 (Vietcombank, BIDV, VietinBank):** Độ an toàn tuyệt đối, tuy nhiên lãi suất thường thấp hơn, dao động quanh mức **4.7%/năm** cho kỳ hạn 12 tháng.\n2. **Nhóm Thương mại cổ phần tư nhân (Techcombank, VPBank, MBBank, HDBank):** Lãi suất hấp dẫn hơn, từ **5.0% - 5.6%/năm** cho kỳ hạn 12 tháng, giao diện số tiện lợi.\n\nNếu bạn muốn tối ưu lợi nhuận mà vẫn an toàn, bạn nên chia nhỏ dòng tiền gửi ở 2-3 ngân hàng khác nhau.`,
      };
    }

    // 4. Hướng dẫn lập kế hoạch tiết kiệm
    if (cleanText.includes("lập kế hoạch") || cleanText.includes("tính lãi") || cleanText.includes("tiết kiệm")) {
      return {
        role: "ai",
        content: `Để lập kế hoạch tiết kiệm tốt nhất, bạn hãy làm theo các bước sau:\n\n1. Chuyển sang tab **Lập kế hoạch tiết kiệm** từ thanh menu bên trái.\n2. Chọn mục tiêu gửi (Mua nhà, mua xe, du lịch, học tập...).\n3. Nhập số tiền mục tiêu cần có, số tiền gửi ban đầu và số tiền tích lũy hàng tháng.\n4. Chọn các ngân hàng bạn tin tưởng để so sánh.\n5. Bấm **Tìm gói tiết kiệm tốt nhất**, hệ thống sẽ tự động tính toán phương án gửi tối ưu nhất cho bạn.`,
      };
    }

    // 5. Câu trả lời mặc định
    return {
      role: "ai",
      content: `Chào bạn! Tôi có thể giúp bạn:\n- Tra cứu xem ngân hàng nào lãi suất cao nhất (Ví dụ: gõ *"lãi suất cao nhất"*).\n- Tra cứu lãi suất theo kỳ hạn gửi (Ví dụ: gõ *"kỳ hạn 12 tháng"*).\n- Tư vấn nên chọn ngân hàng nào để gửi tiền an toàn hoặc tối ưu lãi suất.\n\nBạn cần tôi giải đáp thông tin nào trong số các mục trên?`,
    };
  },
};
