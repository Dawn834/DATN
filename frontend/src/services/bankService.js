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
    const res = await apiClient.get(`/banks/${code}`);
    return res.data;
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
        url = `/banks/search?code=${bankIdOrCode}`;
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
        url = `/banks/search?code=${bankIdOrCode}`;
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

  /** Lấy lãi suất lịch sử 6 tháng gần nhất (TODO: cần API backend hỗ trợ) */
  async getHistoricalRates(bankId) {
    // TODO: Backend chưa có endpoint riêng cho historical rates
    // Khi backend có API: GET /banks/{code}/history → sử dụng apiClient.get()
    console.warn(`[bankService] getHistoricalRates("${bankId}"): Backend chưa có API, trả về rỗng`);
    return [];
  },
};
