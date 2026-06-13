import { Navigate, Outlet } from "react-router-dom"

export function ProtectedRoute() {
  const token = localStorage.getItem("datn_token")

  if (!token) {
    // Nếu không có token, điều hướng tới trang đăng nhập
    return <Navigate to="/login" replace />
  }

  // Nếu đã đăng nhập, cho phép render các route con
  return <Outlet />
}
