import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from "./components/layout/MainLayout"
import { HomePage } from "./pages/Home"
import { PlanningPage } from "./pages/Planning"
import { ManagementPage } from "./pages/Management"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="planning" element={<PlanningPage />} />
          <Route path="management" element={<ManagementPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
