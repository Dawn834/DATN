/**
 * Bank Service — gọi API backend để lấy dữ liệu ngân hàng và lãi suất
 */
import { apiClient } from "./apiClient";

export const bankService = {
  /** Lấy danh sách tất cả ngân hàng */
  async getBanks() {
    const res = await apiClient.get("/banks");
    return res.data;
  },

  /** Tìm ngân hàng theo tên */
  async searchBanks(query) {
    const res = await apiClient.get(`/banks/search?name=${encodeURIComponent(query)}`);
    return res.data;
  },

  /** Lấy thông tin 1 ngân hàng theo mã (VCB, BIDV...) */
  async getBankByCode(code) {
    const res = await apiClient.get(`/banks/search?code=${encodeURIComponent(code)}`);
    return Array.isArray(res.data) ? res.data[0] : res.data;
  },

  /** Lấy bảng lãi suất theo kỳ hạn & số tiền */
  async getBankRates(termMonth, amount = 0, type = null) {
    let url = `/banks/bank_rates?term_month=${termMonth}&amount=${amount}`;
    if (type) url += `&type=${type}`;
    const res = await apiClient.get(url);
    return res.data;
  },

  /** Lấy lãi suất của 1 ngân hàng theo tất cả kỳ hạn → { 1: 2.5, 3: 3.0, 12: 5.09 } */
  async getRatesForBank(bankIdOrCode) {
    try {
      let url;
      if (typeof bankIdOrCode === "number" || /^\d+$/.test(bankIdOrCode)) {
        url = `/banks/bank_rates/${bankIdOrCode}`;
      } else {
        const searchRes = await apiClient.get(`/banks/search?code=${bankIdOrCode}`);
        const foundBank = Array.isArray(searchRes.data) ? searchRes.data[0] : searchRes.data;
        if (!foundBank || !foundBank.id) return { counter: {}, online: {} };
        url = `/banks/bank_rates/${foundBank.id}`;
      }
      const res = await apiClient.get(url);
      const bank = Array.isArray(res.data) ? res.data[0] : res.data;
      if (!bank || !bank.interest_rates) return { counter: {}, online: {} };

      const rates = {
        counter: {},
        online: {},
      };

      // Group all rates by (term_month, channel)
      const grouped = {};
      bank.interest_rates.forEach((r) => {
        if (!r.term_month || !r.channel) return;
        const channelKey = r.channel.toUpperCase();
        const term = r.term_month;
        const key = `${term}_${channelKey}`;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(r);
      });

      // For each group, find the current rate
      Object.keys(grouped).forEach((key) => {
        const [term, channelKey] = key.split("_");
        const termNum = parseInt(term, 10);
        const list = grouped[key];

        // Sort: current/latest first, then by date descending, then id descending
        list.sort((a, b) => {
          if (a.is_current !== b.is_current) {
            return a.is_current ? -1 : 1;
          }
          const dateA = new Date(a.updated_at || a.created_at || a.effective_date);
          const dateB = new Date(b.updated_at || b.created_at || b.effective_date);
          return dateB - dateA || b.id - a.id;
        });

        const currentRate = parseFloat(list[0].rate);
        if (channelKey === "COUNTER") {
          rates.counter[termNum] = currentRate;
        } else if (channelKey === "ONLINE") {
          rates.online[termNum] = currentRate;
        }

        // Flat mapping for backwards compatibility (online preferred)
        if (channelKey === "ONLINE" || !rates[termNum]) {
          rates[termNum] = currentRate;
        }
      });

      return rates;
    } catch (err) {
      console.warn("Failed to fetch rates for bank:", bankIdOrCode, err);
      return { counter: {}, online: {} };
    }
  },

  /** Lấy thay đổi lãi suất so với kỳ trước */
  async getRateChangesForBank(bankIdOrCode) {
    try {
      let url;
      if (typeof bankIdOrCode === "number" || /^\d+$/.test(bankIdOrCode)) {
        url = `/banks/bank_rates/${bankIdOrCode}`;
      } else {
        const searchRes = await apiClient.get(`/banks/search?code=${bankIdOrCode}`);
        const foundBank = Array.isArray(searchRes.data) ? searchRes.data[0] : searchRes.data;
        if (!foundBank || !foundBank.id) return { counter: {}, online: {} };
        url = `/banks/bank_rates/${foundBank.id}`;
      }
      const res = await apiClient.get(url);
      const bank = Array.isArray(res.data) ? res.data[0] : res.data;
      if (!bank || !bank.interest_rates) return { counter: {}, online: {} };

      const changes = {
        counter: {},
        online: {},
      };

      // Group all rates by (term_month, channel)
      const grouped = {};
      bank.interest_rates.forEach((r) => {
        if (!r.term_month || !r.channel) return;
        const channelKey = r.channel.toUpperCase();
        const term = r.term_month;
        const key = `${term}_${channelKey}`;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(r);
      });

      Object.keys(grouped).forEach((key) => {
        const [term, channelKey] = key.split("_");
        const termNum = parseInt(term, 10);
        const list = grouped[key];

        // Sort: current/latest first, then by date descending, then id descending
        list.sort((a, b) => {
          if (a.is_current !== b.is_current) {
            return a.is_current ? -1 : 1;
          }
          const dateA = new Date(a.updated_at || a.created_at || a.effective_date);
          const dateB = new Date(b.updated_at || b.created_at || b.effective_date);
          return dateB - dateA || b.id - a.id;
        });

        const currentRate = parseFloat(list[0].rate);
        let previousRate = null;

        if (list.length > 1) {
          previousRate = parseFloat(list[1].rate);
        }

        const changeVal = previousRate !== null ? parseFloat((currentRate - previousRate).toFixed(4)) : 0;

        if (channelKey === "COUNTER") {
          changes.counter[termNum] = changeVal;
        } else if (channelKey === "ONLINE") {
          changes.online[termNum] = changeVal;
        }

        // Flat mapping for compatibility
        if (channelKey === "ONLINE" || !changes[termNum]) {
          changes[termNum] = changeVal;
        }
      });

      return changes;
    } catch (err) {
      console.warn("Failed to fetch changes for bank:", bankIdOrCode, err);
      return { counter: {}, online: {} };
    }
  },

  /** Lấy lãi suất lịch sử 6 tháng gần nhất */
  async getHistoricalRates(bankIdOrCode) {
    // Để tránh xuất hiện lỗi đỏ 404 trong Console trình duyệt (do Backend chưa có API /history),
    // chúng ta sẽ trực tiếp sử dụng dữ liệu mock đồng bộ.
    // Khi nào Backend của bạn xây dựng xong API này, bạn chỉ cần mở lại đoạn code try-catch bên dưới.
    
    /*
    try {
      const res = await apiClient.get(`/banks/${bankIdOrCode}/history`);
      return res.data;
    } catch (err) {
      console.warn(`[bankService] Lỗi gọi API history:`, err);
    }
    */
      
    // Lấy lãi suất hiện tại trước để đồng bộ kỳ hiện tại
    let currentRates = { counter: {}, online: {} };
    let actualCode = typeof bankIdOrCode === "string" ? bankIdOrCode : null;

    try {
      let bankData;
      if (typeof bankIdOrCode === "number" || /^\d+$/.test(bankIdOrCode)) {
        const res = await apiClient.get(`/banks/bank_rates/${bankIdOrCode}`);
        bankData = Array.isArray(res.data) ? res.data[0] : res.data;
      } else {
        const searchRes = await apiClient.get(`/banks/search?code=${bankIdOrCode}`);
        const foundBank = Array.isArray(searchRes.data) ? searchRes.data[0] : searchRes.data;
        if (foundBank && foundBank.id) {
          const res = await apiClient.get(`/banks/bank_rates/${foundBank.id}`);
          bankData = Array.isArray(res.data) ? res.data[0] : res.data;
        }
      }

      if (bankData) {
        actualCode = bankData.code;
        if (bankData.interest_rates) {
          bankData.interest_rates.forEach((r) => {
            if (!r.term_month || !r.channel) return;
            const channelKey = r.channel.toUpperCase();
            const term = r.term_month;
            const rate = parseFloat(r.rate);
            if (channelKey === "COUNTER") {
              currentRates.counter[term] = rate;
            } else if (channelKey === "ONLINE") {
              currentRates.online[term] = rate;
            }
            if (channelKey === "ONLINE" || !currentRates[term]) {
              currentRates[term] = rate;
            }
          });
        }
      }
    } catch (e) {
      console.warn("Không lấy được lãi suất hiện tại để đồng bộ, sử dụng dữ liệu mặc định", e);
    }

    // Trả về dữ liệu mock giả lập từ tệp tin historicalRates.js
    const { getMockHistoricalRates } = await import("../data/historicalRates");
    return getMockHistoricalRates(actualCode || bankIdOrCode, currentRates);
  },
};
