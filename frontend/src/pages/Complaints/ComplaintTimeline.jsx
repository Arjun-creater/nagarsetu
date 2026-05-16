import {
  useEffect,
  useState,
} from "react"

import {
  getComplaintTimeline,
} from "../../services/complaintService"

const ComplaintTimeline = ({
  complaintId,
  complaint,
}) => {

  const [timeline, setTimeline] =
    useState([])



  const fetchTimeline =
    async () => {

      try {

        const data =
          await getComplaintTimeline(
            complaintId
          )

        setTimeline(data)

      } catch (error) {

        console.error(error)
      }
    }



  useEffect(() => {

    fetchTimeline()

  }, [complaintId])



  const defaultTimeline = complaint
  ? [
      {
        new_status:
          "Complaint Created",

        remarks:
          "Complaint registered successfully",

        created_at:
          complaint.created_at,
      },

      {
        new_status:
          "Department Assigned",

        remarks:
          `Assigned to ${
            complaint.final_ai_department ||
            "Pending Department"
          }`,

        created_at:
          complaint.created_at,
      },
    ]
  : []



  return (

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

      <div className="mb-8">

        <h2
          className="
            text-2xl
            font-bold
            text-slate-800
          "
        >
          Status Timeline
        </h2>

        <p className="text-slate-500 mt-1">
          Complaint lifecycle tracking
        </p>

      </div>



      <div className="space-y-8">

        {[
          ...defaultTimeline,
          ...timeline,
        ].map(
          (item, index) => (

            <div
              key={index}
              className="flex gap-5"
            >

              {/* Timeline Indicator */}

              <div
                className="
                  flex
                  flex-col
                  items-center
                "
              >

                <div
                  className="
                    w-5
                    h-5
                    rounded-full
                    bg-blue-500
                    border-4
                    border-blue-100
                  "
                />

                {index !==
                  (
                    defaultTimeline.length +
                    timeline.length
                  ) - 1 && (

                  <div
                    className="
                      w-[2px]
                      flex-1
                      bg-slate-200
                      mt-2
                    "
                  />

                )}

              </div>



              {/* Timeline Content */}

              <div className="pb-8">

                <h3
                  className="
                    text-lg
                    font-semibold
                    capitalize
                    text-slate-800
                  "
                >
                  {item.new_status}
                </h3>

                <p
                  className="
                    text-slate-600
                    mt-1
                  "
                >
                  {
                    item.remarks ||
                    "Complaint status updated"
                  }
                </p>

                <p
                  className="
                    text-sm
                    text-slate-400
                    mt-2
                  "
                >
                  {item.created_at
                    ? new Date(
                        item.created_at
                      ).toLocaleString()
                    : "Time unavailable"}
                </p>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  )
}

export default ComplaintTimeline