/**
 * API Client — giao tiếp với FastAPI backend
 * Tất cả request đều gửi đến backend thật qua /api/v1
 */

const SIMULATED_LATENCY = 100; // ms (có thể đặt = 0 khi production)

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkResponse(response, isLogin = false) {
  if (!response.ok) {
    if (response.status === 401 && !isLogin) {
      const token = localStorage.getItem("datn_token");
      if (token) {
        localStorage.removeItem("datn_token");
        localStorage.removeItem("datn_current_user");
        window.location.reload();
      }
    }
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export const apiClient = {
  async get(url, options = {}) {
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
      const userStr = localStorage.getItem("datn_current_user");
      const user = userStr ? JSON.parse(userStr) : { id: 1 };
      const userId = user.id || 1;
      finalUrl = `/saving-plan/${userId}`;
    } else if (url.match(/^\/saving-plan\/\d+$/)) {
      const planId = url.split("/").pop();
      const userStr = localStorage.getItem("datn_current_user");
      const user = userStr ? JSON.parse(userStr) : { id: 1 };
      const userId = user.id || 1;
      finalUrl = `/saving-plan/${userId}/${planId}`;
    }

    const response = await fetch(`/api/v1${finalUrl}`, {
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

  async post(url, body, options = {}) {
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

      const response = await fetch(`/api/v1/auth/login`, {
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
      const userStr = localStorage.getItem("datn_current_user");
      const user = userStr ? JSON.parse(userStr) : { id: 1 };
      const userId = user.id || 1;
      finalUrl = `/saving-plan/${userId}/save`;
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

    const response = await fetch(`/api/v1${finalUrl}`, {
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

  async put(url, body, options = {}) {
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

    const response = await fetch(`/api/v1${url}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
    const data = await checkResponse(response);
    return { data };
  },

  async delete(url, options = {}) {
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
      const id = url.split("/").pop();
      const userStr = localStorage.getItem("datn_current_user");
      const user = userStr ? JSON.parse(userStr) : { id: 1 };
      const userId = user.id || 1;
      finalUrl = `/saving-plan/${userId}/${id}`;
    }

    const response = await fetch(`/api/v1${finalUrl}`, {
      method: "DELETE",
      headers,
    });
    const data = await checkResponse(response);
    return { data };
  },
};
