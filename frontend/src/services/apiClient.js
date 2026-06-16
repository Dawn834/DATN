/**
 * API Client — giao tiếp với FastAPI backend
 * Tất cả request đều gửi đến backend thật qua /api/v1
 */

const SIMULATED_LATENCY = 100; // ms (có thể đặt = 0 khi production)
const BASE_URL = import.meta.env.VITE_API_URL || "";
//Định nghĩa biến môi trường VITE_API_URL để gọi endpoint sản phẩm trên Render thay vì fix cứng local proxy.

class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function forceLogout() {
  localStorage.removeItem("datn_token");
  localStorage.removeItem("datn_refresh_token");
  localStorage.removeItem("datn_current_user");
  sessionStorage.setItem("logout_reason", "expired");
  window.location.reload();
}

async function performRequest(requestFn) {
  try {
    return await requestFn();
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      const refreshToken = localStorage.getItem("datn_refresh_token");
      if (!refreshToken) {
        forceLogout();
        throw err;
      }

      if (!isRefreshing) {
        isRefreshing = true;
        console.log("[API CLIENT] Access token expired. Attempting refresh...");
        
        fetch(`${BASE_URL}/api/v1/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        })
          .then(async (res) => {
            if (!res.ok) {
              throw new Error("Failed to refresh token");
            }
            const refreshData = await res.json();
            console.log("[API CLIENT] Token refresh successful.");
            localStorage.setItem("datn_token", refreshData.access_token);
            if (refreshData.refresh_token) {
              localStorage.setItem("datn_refresh_token", refreshData.refresh_token);
            }
            isRefreshing = false;
            onRefreshed(refreshData.access_token);
          })
          .catch((refreshErr) => {
            console.error("[API CLIENT] Token refresh failed:", refreshErr);
            isRefreshing = false;
            forceLogout();
          });
      }

      return new Promise((resolve, reject) => {
        subscribeTokenRefresh(() => {
          requestFn().then(resolve).catch(reject);
        });
      });
    }
    throw err;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkResponse(response, isLogin = false) {
  if (!response.ok) {
    if (response.status === 401 && !isLogin) {
      throw new UnauthorizedError();
    }
    let errorMsg = "Network response was not ok";
    try {
      const errData = await response.json();
      
      // Normalize errData. If it has a detail property, use that.
      let detail = errData;
      if (errData && errData.detail !== undefined) {
        detail = errData.detail;
      }
      
      // If detail is a string, check if it's a stringified JSON array/object
      if (typeof detail === "string") {
        try {
          const parsed = JSON.parse(detail);
          if (Array.isArray(parsed) || typeof parsed === "object") {
            detail = parsed;
          }
        } catch (e) {
          // Keep it as string
        }
      }
      
      if (typeof detail === "string") {
        errorMsg = detail;
        const normalized = errorMsg.toLowerCase();
        if (normalized.includes("otp code not valid") || normalized.includes("otp code is invalid") || normalized.includes("otp code expired")) {
          errorMsg = "Mã xác thực (OTP) đã hết hạn hoặc không hợp lệ.";
        } else if (normalized.includes("incorrect email or password")) {
          errorMsg = "Mật khẩu hoặc email không chính xác.";
        } else if (normalized.includes("password change request expired")) {
          errorMsg = "Yêu cầu đổi mật khẩu đã hết hạn.";
        } else if (normalized.includes("token has expired")) {
          errorMsg = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
        } else if (normalized.includes("total_amount must be greater than 0")) {
          errorMsg = "Số tiền tích lũy phải lớn hơn 0.";
        } else if (normalized.includes("term_month must be greater than 0")) {
          errorMsg = "Kỳ hạn tích lũy phải lớn hơn 0.";
        } else if (normalized.includes("saving plan not found")) {
          errorMsg = "Không tìm thấy kế hoạch tiết kiệm.";
        }
      } else if (Array.isArray(detail)) {
        errorMsg = detail
          .map((err) => {
            const field = err.loc ? err.loc[err.loc.length - 1] : "";
            let fieldName = field;
            if (field === "password") fieldName = "Mật khẩu";
            else if (field === "email") fieldName = "Email";
            else if (field === "first_name") fieldName = "Tên";
            else if (field === "last_name") fieldName = "Họ";
            else if (field === "otp_code") fieldName = "Mã OTP";

            if (err.type === "string_too_short" || err.type?.includes("min_length")) {
              const minLen = err.ctx?.min_length || 8;
              return `${fieldName} phải có tối thiểu ${minLen} ký tự.`;
            }
            if (err.type === "value_error" || err.type?.includes("value_error")) {
              let msg = err.msg || "";
              if (msg.includes("at least one uppercase letter")) {
                return "Mật khẩu phải chứa ít nhất một chữ cái viết hoa.";
              }
              if (msg.includes("at least one lowercase letter")) {
                return "Mật khẩu phải chứa ít nhất một chữ cái viết thường.";
              }
              if (msg.includes("at least one digit") || msg.includes("must contain a number")) {
                return "Mật khẩu phải chứa ít nhất một chữ số.";
              }
              return msg.replace("Value error, ", "");
            }
            return err.msg || "Thông tin không hợp lệ";
          })
          .join(" ");
      } else if (detail && typeof detail === "object") {
        errorMsg = detail.message || JSON.stringify(detail);
      }
    } catch (e) {
      // Ignore parse failure if body is empty or not JSON
    }
    throw new Error(errorMsg);
  }
  if (response.status === 204) {
    return {};
  }
  return response.json();
}

export const apiClient = {
  // Public wrapped methods that handle auto-refresh
  async get(url, options = {}) {
    return performRequest(() => this._get(url, options));
  },
  async post(url, body, options = {}) {
    return performRequest(() => this._post(url, body, options));
  },
  async put(url, body, options = {}) {
    return performRequest(() => this._put(url, body, options));
  },
  async delete(url, options = {}) {
    return performRequest(() => this._delete(url, options));
  },

  // Internal raw methods
  async _get(url, options = {}) {
    console.log(`[API CLIENT] GET request to: ${url}`, options);
    await delay(SIMULATED_LATENCY);

    // --- REAL API CALL ---
    let finalUrl = url;
    const token = localStorage.getItem("datn_token");
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Route rewriting for saving plans & auth
    if (url.startsWith("/auth/me")) {
      finalUrl = "/users/me";
    } else if (url === "/saving-plan") {
      finalUrl = "/saving-plan/history";
    } else if (url.match(/^\/saving-plan\/\d+$/)) {
      finalUrl = url;
    }

    const response = await fetch(`${BASE_URL}/api/v1${finalUrl}`, {
      headers,
    });
    let data = await checkResponse(response);

    // Adapt API response back to frontend-compatible format
    if (url === "/saving-plan") {
      data = data.map((item) => ({
        ...item.plan_data,
        id: item.id,
        status: item.is_active ? "active" : "inactive",
      }));
    } else if (url.match(/^\/saving-plan\/\d+$/)) {
      data = {
        ...data.plan_data,
        id: data.id,
        status: data.is_active ? "active" : "inactive",
      };
    }

    return { data };
  },

  async _post(url, body, options = {}) {
    console.log(`[API CLIENT] POST request to: ${url}`, body, options);
    await delay(SIMULATED_LATENCY);

    // --- REAL API CALL ---
    let finalUrl = url;
    let finalBody = body;
    const token = localStorage.getItem("datn_token");
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Transform auth/login body to url-encoded form data (required by FastAPI OAuth2PasswordRequestForm)
    if (url.startsWith("/auth/login")) {
      const params = new URLSearchParams();
      // Since FastAPI login expects form_data.username which is mapped to email in user_service.py
      params.append("username", body.username === "admin" ? "admin@gmail.com" : body.username || "");
      params.append("password", body.password || "");

      const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          ...options.headers,
        },
        body: params.toString(),
      });
      if (!response.ok) throw new Error("Incorrect email or password");
      const resData = await response.json();

      localStorage.setItem("datn_token", resData.access_token);
      localStorage.setItem("datn_refresh_token", resData.refresh_token);
      const user = {
        id: 1,
        username: body.username,
        fullName: body.username === "admin" ? "Nguyễn Văn Bình" : "Người dùng mới",
        email: body.username === "admin" ? "admin@gmail.com" : "user@gmail.com",
        role: body.username === "admin" ? "ADMIN" : "USER",
      };
      localStorage.setItem("datn_current_user", JSON.stringify(user));
      return { data: { access_token: resData.access_token, user } };
    }

    // Transform saving plan creation to backend API schema
    if (url === "/saving-plan") {
      finalUrl = "/saving-plan/save";
      finalBody = {
        name: body.planName,
        duration_month: body.term,
        total_amount: body.initialDeposit,
        goal_amount: body.targetAmount,
        notes: `Ngân hàng: ${body.bankName}`,
        algorithm_used: "dp",
        plan_data: body,
      };
    }

    const response = await fetch(`${BASE_URL}/api/v1${finalUrl}`, {
      method: "POST",
      headers,
      body: JSON.stringify(finalBody),
    });
    let data = await checkResponse(response);

    if (url === "/saving-plan") {
      data = {
        ...data.plan_data,
        id: data.id,
        status: data.is_active ? "active" : "inactive",
      };
    }

    return { data };
  },

  async _put(url, body, options = {}) {
    console.log(`[API CLIENT] PUT request to: ${url}`, body, options);
    await delay(SIMULATED_LATENCY);

    // --- REAL API CALL ---
    const token = localStorage.getItem("datn_token");
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/api/v1${url}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
    const data = await checkResponse(response);
    return { data };
  },

  async _delete(url, options = {}) {
    console.log(`[API CLIENT] DELETE request to: ${url}`, options);
    await delay(SIMULATED_LATENCY);

    // --- REAL API CALL ---
    let finalUrl = url;
    const token = localStorage.getItem("datn_token");
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (url.startsWith("/saving-plan")) {
      finalUrl = url;
    }

    const response = await fetch(`${BASE_URL}/api/v1${finalUrl}`, {
      method: "DELETE",
      headers,
    });
    const data = await checkResponse(response);
    return { data };
  },
};
