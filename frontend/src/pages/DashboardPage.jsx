import KpiCards from "../components/dashboard/KpiCards"
import ComplaintTable from "../components/complaints/ComplaintTable"
import HotspotMap from "../maps/HotspotMap"
import ComplaintTrendChart from "../charts/ComplaintTrendChart"
import NotificationPanel from "../components/notifications/NotificationPanel"
import DepartmentDistributionChart from "../charts/DepartmentDistributionChart"
import DashboardCard from "../components/dashboard/DashboardCard"

const DashboardPage = () => {
return (

  <div className="space-y-6">

    {/* KPI Cards */}
    <KpiCards />



    {/* Main Grid */}
    <div
      className="
        grid
        grid-cols-1
        lg:grid-cols-3
        gap-6
      "
    >

      {/* Left Section */}
      <div className="lg:col-span-2 space-y-6">
      <DashboardCard title="Complaint Trends">

        <ComplaintTrendChart />
      </DashboardCard>
      <DashboardCard title="Recent Complaints">
        <ComplaintTable limit={5} />
      </DashboardCard>

      </div>



      {/* Right Section */}
      <div className="space-y-6">

        <DashboardCard title="Notifications">
  <NotificationPanel />
</DashboardCard>

<DashboardCard title="Department Distribution">
  <DepartmentDistributionChart />
</DashboardCard>

      </div>

    </div>



    {/* Bottom Map */}
    <DashboardCard title="City Hotspots">
  <HotspotMap />
</DashboardCard>

  </div>

)
}

export default DashboardPage