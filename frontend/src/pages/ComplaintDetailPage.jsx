import {
  useEffect,
  useState,
} from "react"

import {
  useParams,
} from "react-router-dom"

import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiCpu,
  FiMapPin,
  FiShield,
} from "react-icons/fi"

import {
  getComplaintDetail,
} from "../services/complaintService"

import ComplaintTimeline
from "./Complaints/ComplaintTimeline"
const ComplaintDetailPage = () => {

  const { id } = useParams()

  const [complaint, setComplaint] =
    useState(null)

  const [loading, setLoading] =
    useState(true)



  useEffect(() => {

    fetchComplaint()

  }, [id])



  const fetchComplaint = async () => {

    try {

      const data =
        await getComplaintDetail(id)

      setComplaint(data)

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)
    }
  }



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
          icon: <FiAlertTriangle />,
        }
    }
  }



  if (loading) {

    return (

      <div
        className="
          min-h-[400px]
          flex
          items-center
          justify-center
          text-slate-500
        "
      >
        Loading complaint intelligence...
      </div>
    )
  }



  if (!complaint) {

    return (

      <div
        className="
          text-center
          text-red-500
        "
      >
        Complaint not found
      </div>
    )
  }



  const statusConfig =
    getStatusStyles(
      complaint.status
    )



  return (

    <div className="space-y-6">

      {/* Header Card */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-sm
          border
          border-gray-100
          p-8
        "
      >

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-start
            lg:justify-between
            gap-6
          "
        >

          {/* Left */}

          <div className="space-y-5">

            <div>

              <p
                className="
                  text-sm
                  text-slate-500
                  mb-2
                "
              >
                Complaint ID #{complaint.id}
              </p>

              <h1
                className="
                  text-4xl
                  font-bold
                  text-slate-800
                  leading-tight
                "
              >
                {complaint.title}
              </h1>

            </div>



            <p
              className="
                text-slate-600
                text-lg
                leading-relaxed
                max-w-4xl
              "
            >
              {complaint.description}
            </p>



            <div
              className="
                flex
                flex-wrap
                gap-3
              "
            >

              {/* Priority */}

              <span
                className={`
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  font-semibold
                  capitalize
                  ${getPriorityStyles(
                    complaint.priority
                  )}
                `}
              >

                Priority:
                {" "}
                {complaint.priority}

              </span>



              {/* Status */}

              <span
                className={`
                  inline-flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  font-semibold
                  capitalize
                  ${statusConfig.style}
                `}
              >

                {statusConfig.icon}

                {complaint.status}

              </span>

            </div>

          </div>



          {/* Right */}

          <div
            className="
              bg-slate-50
              rounded-2xl
              p-5
              min-w-[280px]
            "
          >

            <div className="space-y-5">

              <div>

                <p
                  className="
                    text-sm
                    text-slate-500
                    mb-1
                  "
                >
                  Assigned Department
                </p>

                <h3
                  className="
                    text-lg
                    font-bold
                    text-slate-800
                  "
                >
                  {
                    complaint.final_ai_department ||
                    "Pending"
                  }
                </h3>

              </div>



              <div>

                <p
                  className="
                    text-sm
                    text-slate-500
                    mb-1
                  "
                >
                  Manual Review
                </p>

                <h3
                  className="
                    text-lg
                    font-semibold
                  "
                >
                  {
                    complaint.requires_manual_review
                      ? "Required"
                      : "Not Required"
                  }
                </h3>

              </div>

            </div>

          </div>

        </div>

      </div>



      {/* Intelligence Grid */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        "
      >

      <ComplaintTimeline
  complaintId={id}
  complaint={complaint}
/>


        {/* Operational Intelligence */}

        <div
          className="
            bg-white
            rounded-3xl
            shadow-sm
            border
            border-gray-100
            p-8
          "
        >

          <div
            className="
              flex
              items-center
              gap-4
              mb-8
            "
          >

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-emerald-100
                flex
                items-center
                justify-center
                text-emerald-600
                text-2xl
              "
            >

              <FiShield />

            </div>



            <div>

              <h2
                className="
                  text-2xl
                  font-bold
                  text-slate-800
                "
              >
                Operational Intelligence
              </h2>

              <p className="text-slate-500">
                Complaint management insights
              </p>

            </div>

          </div>



          <div className="space-y-5">

            <div
              className="
                bg-slate-50
                rounded-2xl
                p-5
              "
            >

              <p
                className="
                  text-sm
                  text-slate-500
                  mb-2
                "
              >
                Priority Level
              </p>

              <h3
                className="
                  font-bold
                  capitalize
                  text-slate-800
                "
              >
                {complaint.priority}
              </h3>

            </div>



            <div
              className="
                bg-slate-50
                rounded-2xl
                p-5
              "
            >

              <p
                className="
                  text-sm
                  text-slate-500
                  mb-2
                "
              >
                Current Status
              </p>

              <h3
                className="
                  font-bold
                  capitalize
                  text-slate-800
                "
              >
                {complaint.status}
              </h3>

            </div>



            <div
              className="
                bg-slate-50
                rounded-2xl
                p-5
              "
            >

              <p
                className="
                  text-sm
                  text-slate-500
                  mb-2
                "
              >
                Address
              </p>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-slate-700
                "
              >

                <FiMapPin />

                <span>
                  {
                    complaint.address ||
                    "Location unavailable"
                  }
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default ComplaintDetailPage