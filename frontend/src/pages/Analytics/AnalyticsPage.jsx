import KpiCards from "../../components/dashboard/KpiCards"

import ComplaintTrendChart from "../../charts/ComplaintTrendChart"

import DepartmentDistributionChart from "../../charts/DepartmentDistributionChart"

const AnalyticsPage = () => {

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
          Civic Analytics
        </h1>

        <p
          className="
            text-slate-500
            mt-2
            text-lg
          "
        >
          AI-driven complaint and operational insights
        </p>

      </div>



      {/* KPI */}

      <KpiCards />



      {/* Charts */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        "
      >

        <div
          className="
            bg-white
            rounded-2xl
            p-6
            shadow-sm
            border
            border-gray-100
          "
        >

          <h2
            className="
              text-xl
              font-bold
              mb-6
            "
          >
            Complaint Trends
          </h2>

          <ComplaintTrendChart />

        </div>



        <div
          className="
            bg-white
            rounded-2xl
            p-6
            shadow-sm
            border
            border-gray-100
          "
        >

          <h2
            className="
              text-xl
              font-bold
              mb-6
            "
          >
            Department Distribution
          </h2>

          <DepartmentDistributionChart />

        </div>

      </div>

    </div>
  )
}

export default AnalyticsPage