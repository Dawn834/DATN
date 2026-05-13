import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

export function MainLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F0F2F5" }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 260, display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, padding: 24, overflowX: "hidden" }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
