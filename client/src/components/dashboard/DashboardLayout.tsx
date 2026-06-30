import { Outlet } from "react-router-dom"
import Sidebar from "@/components/dashboard/Sidebar"

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-9 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout