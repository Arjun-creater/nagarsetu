import {
  useEffect,
  useState,
} from "react"

import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
} from "react-icons/fi"

import {
  getDashboardSummary,
} from "../../services/dashboardService"

const KpiCards = () => {

  const [summary, setSummary] =
    useState(null)

  const [loading, setLoading] =
    useState(true)


const fetchSummary = async () => {

    try {

      const data =
        await getDashboardSummary()

      setSummary(data)

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)
    }
  }


useEffect(() => {

  fetchSummary()

  const interval = setInterval(() => {

    fetchSummary()

  }, 15000)

  return () => clearInterval(interval)

}, [])



  
  if (loading) {

    return (

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
      >

        {[1, 2, 3, 4].map(
          (item) => (

            <div
              key={item}

              className="
                h-32
                bg-slate-100
                rounded-2xl
                animate-pulse
              "
            />

          )
        )}

      </div>
    )
  }



  const cards = [

    {
      title: "Total Complaints",
      value:
        summary?.total_complaints || 0,
      icon: <FiAlertTriangle />,
      bg: "bg-red-500",
    },

    {
      title: "Resolved Cases",
      value:
        summary?.resolved_complaints || 0,
      icon: <FiCheckCircle />,
      bg: "bg-green-500",
    },

    {
      title: "In Progress",
      value:
        summary?.in_progress_complaints || 0,
      icon: <FiClock />,
      bg: "bg-yellow-500",
    },

    {
      title: "Open Complaints",
      value:
        summary?.open_complaints || 0,
      icon: <FiTrendingUp />,
      bg: "bg-blue-500",
    },
  ]



  return (

    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-6
      "
    >

      {cards.map((card) => (

        <div
          key={card.title}

          className="
            bg-white
            rounded-2xl
            p-5
            shadow-sm
            border
            border-gray-100
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-slate-500
                "
              >
                {card.title}
              </p>

              <h2
                className="
                  text-3xl
                  font-bold
                  mt-2
                  text-slate-800
                "
              >
                {card.value}
              </h2>

            </div>



            <div
              className={`
                ${card.bg}
                w-14
                h-14
                rounded-2xl
                flex
                items-center
                justify-center
                text-white
                text-2xl
              `}
            >

              {card.icon}

            </div>

          </div>

        </div>

      ))}

    </div>
  )
}

export default KpiCards