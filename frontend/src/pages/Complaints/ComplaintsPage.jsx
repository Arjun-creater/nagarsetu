import KpiCards from "../../components/dashboard/KpiCards"
import ComplaintTable from "../../components/complaints/ComplaintTable"

const ComplaintsPage = () => {

  return (

    <div className="space-y-6">

      {/* Header */}

      <div>

        <h1
          className="
            text-4xl
            font-bold
            text-slate-800
          "
        >
          Complaints Management
        </h1>

        <p
          className="
            text-slate-500
            mt-2
            text-lg
          "
        >
          Monitor and manage all civic complaints
        </p>

      </div>



      {/* KPI Section */}

      <KpiCards />



      {/* Table */}

      <ComplaintTable />

    </div>
  )
}

export default ComplaintsPage