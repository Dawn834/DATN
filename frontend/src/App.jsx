import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from "./components/layout/MainLayout"
import { HomePage } from "./pages/Home"
import { PlanningPage } from "./pages/Planning"
import { ManagementPage } from "./pages/Management"
import { PlanDetailPage } from "./pages/PlanDetail"
import { LoginPage } from "./pages/Login/LoginPage"
import { SignupPage } from "./pages/Signup/SignupPage"
import { ProtectedRoute } from "./components/common/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="planning" element={<PlanningPage />} />
            <Route path="management" element={<ManagementPage />} />
            <Route path="management/plan/:planId" element={<PlanDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
