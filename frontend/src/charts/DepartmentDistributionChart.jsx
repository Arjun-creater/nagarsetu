import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import {
  useEffect,
  useState,
} from "react"

import {
  getDepartmentTrends,
} from "../services/analyticsService"

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#ca8a04",
  "#9333ea",
]

const DepartmentDistributionChart =
  () => {

    const [data, setData] =
      useState([])

    useEffect(() => {

      fetchData()

    }, [])

    const fetchData = async () => {

      try {

        const trends =
          await getDepartmentTrends()

        setData(trends)

      } catch (error) {

        console.error(error)
      }
    }

    return (

      <div
        className="
          bg-white
          rounded-2xl
          shadow-sm
          p-6
        "
      >

        <h2 className="text-xl font-bold mb-6">
          Department Distribution
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <PieChart>

<Pie
  data={data}
  dataKey="total_complaints"
  nameKey="department"
  outerRadius={100}
 label={({ payload, value }) =>
  `${payload["department__name"] || "Unassigned"}: ${value}`
}
>
  {data.map((entry, index) => (
    <Cell
      key={index}
      fill={COLORS[index % COLORS.length]}
    />
  ))}
</Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>
    )
}

export default DepartmentDistributionChart