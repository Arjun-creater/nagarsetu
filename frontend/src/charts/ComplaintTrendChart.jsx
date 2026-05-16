import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

import {
  useEffect,
  useState,
} from "react"

import {
  getDailyTrends,
} from "../services/analyticsService"

const ComplaintTrendChart = () => {

  const [data, setData] =
    useState([])

  useEffect(() => {

    fetchData()

  }, [])

  const fetchData = async () => {

    try {

      const trends =
        await getDailyTrends()

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
        Complaint Growth Trends
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="total_complaints"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  )
}

export default ComplaintTrendChart