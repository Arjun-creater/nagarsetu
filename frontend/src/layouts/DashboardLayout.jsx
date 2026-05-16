import { Outlet } from "react-router-dom"
import Sidebar from "../components/sidebar/Sidebar"

const DashboardLayout = () => {
  return (
    <div
  className="
    flex
    h-screen
    overflow-hidden
    bg-gray-100
  "
>

      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  )
}

export default DashboardLayout