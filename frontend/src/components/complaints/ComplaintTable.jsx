import {
  useEffect,
  useState,
} from "react"

import {
  getComplaints,
} from "../../services/complaintService"

import {
  useNavigate,
} from "react-router-dom"

import {
  FiAlertCircle,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi"

const ComplaintTable = ({ limit,})=>{

  const [complaints, setComplaints] =
    useState([])

  const [count, setCount] =
    useState(0)

  const [loading, setLoading] =
    useState(true)

  const navigate = useNavigate()



  const fetchComplaints = async () => {

    try {

      const data =
        await getComplaints()

      console.log("Polling complaints...")
      console.log(data)

      setComplaints(data.results)

      setCount(data.count)

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)
    }
  }



  useEffect(() => {

    fetchComplaints()

    const interval = setInterval(() => {

      fetchComplaints()

    }, 15000)

    return () => clearInterval(interval)

  }, [])



  const getPriorityStyles = (
    priority
  ) => {

    switch (priority?.toLowerCase()) {

      case "high":
        return "bg-red-100 text-red-600"

      case "medium":
        return "bg-yellow-100 text-yellow-700"

      default:
        return "bg-green-100 text-green-700"
    }
  }



  const getStatusStyles = (
    status
  ) => {

    switch (status?.toLowerCase()) {

      case "resolved":
        return {
          style:
            "bg-green-100 text-green-700",
          icon: <FiCheckCircle />,
        }

      case "in_progress":
        return {
          style:
            "bg-yellow-100 text-yellow-700",
          icon: <FiClock />,
        }

      default:
        return {
          style:
            "bg-blue-100 text-blue-700",
          icon: <FiAlertCircle />,
        }
    }
  }



  return (

    <div
      className="
        bg-white
        rounded-2xl
        shadow-sm
        border
        border-gray-100
        overflow-hidden
      "
    >

      {/* Header */}

      <div
        className="
          px-6
          py-5
          border-b
          border-gray-100
          flex
          items-center
          justify-between
        "
      >

        <div>

          <h2
            className="
              text-xl
              font-bold
              text-slate-800
            "
          >
            Recent Complaints
          </h2>

          <p
            className="
              text-sm
              text-slate-500
              mt-1
            "
          >
            {count} complaints reported
          </p>

        </div>

      </div>



      {/* Loading State */}

      {loading ? (

        <div
          className="
            p-10
            text-center
            text-slate-500
          "
        >
          Loading complaints...
        </div>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead
              className="
                bg-slate-50
                text-left
              "
            >

              <tr
                className="
                  text-sm
                  text-slate-500
                "
              >

                <th className="px-6 py-4 font-semibold">
                  Complaint
                </th>

                <th className="px-6 py-4 font-semibold">
                  Department
                </th>

                <th className="px-6 py-4 font-semibold">
                  Priority
                </th>

                <th className="px-6 py-4 font-semibold">
                  Status
                </th>

              </tr>

            </thead>



            <tbody>

              {(
  limit
    ? complaints.slice(0, limit)
    : complaints
).map(
                (complaint) => {

                  const statusConfig =
                    getStatusStyles(
                      complaint.status
                    )

                  return (

                    <tr
                      key={complaint.id}

                      onClick={() =>
                        navigate(
                          `/complaints/${complaint.id}`
                        )
                      }

                      className="
                        border-b
                        border-gray-100
                        hover:bg-slate-50
                        transition-all
                        duration-200
                        cursor-pointer
                      "
                    >

                      {/* Title */}

                      <td className="px-6 py-5">

                        <div>

                          <h3
                            className="
                              font-semibold
                              text-slate-800
                            "
                          >
                            {complaint.title}
                          </h3>

                          <p
                            className="
                              text-sm
                              text-slate-500
                              mt-1
                            "
                          >
                            Complaint ID:
                            {" "}
                            #{complaint.id}
                          </p>

                        </div>

                      </td>



                      {/* Department */}

                      <td className="px-6 py-5">

                        <span
                          className="
                            text-slate-700
                            font-medium
                          "
                        >
                          {
                            complaint.final_ai_department ||
                            "Unassigned"
                          }
                        </span>

                      </td>



                      {/* Priority */}

                      <td className="px-6 py-5">

                        <span
                          className={`
                            px-3
                            py-1.5
                            rounded-full
                            text-xs
                            font-semibold
                            capitalize
                            ${getPriorityStyles(
                              complaint.priority
                            )}
                          `}
                        >

                          {complaint.priority}

                        </span>

                      </td>



                      {/* Status */}

                      <td className="px-6 py-5">

                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-2
                            px-3
                            py-1.5
                            rounded-full
                            text-xs
                            font-semibold
                            capitalize
                            ${statusConfig.style}
                          `}
                        >

                          {statusConfig.icon}

                          {complaint.status}

                        </span>

                      </td>

                    </tr>
                  )
                }
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>
  )
}

export default ComplaintTable