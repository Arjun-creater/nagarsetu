import HotspotMap from "../../maps/HotspotMap"

import {
  useEffect,
  useState,
} from "react"

import {
  getHotspotSummary,
  getHotspotAreas,
} from "../../services/complaintService"

const HotspotsPage = () => {

  const [hotspotAreas, setHotspotAreas] =
    useState([])

  const [summary, setSummary] =
    useState({
      high_risk_zones: 0,
      active_complaints: 0,
      resolution_rate: 0,
    })



  const fetchHotspotAreas =
    async () => {

      try {

        const data =
          await getHotspotAreas()

        setHotspotAreas(data)

      } catch (error) {

        console.error(error)
      }
    }



  const fetchSummary = async () => {

    try {

      const data =
        await getHotspotSummary()

      setSummary(data)

    } catch (error) {

      console.error(error)
    }
  }



  useEffect(() => {

    fetchSummary()

    fetchHotspotAreas()

    const interval = setInterval(() => {

      fetchSummary()

      fetchHotspotAreas()

    }, 15000)

    return () => clearInterval(interval)

  }, [])



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
          Hotspot Intelligence
        </h1>

        <p
          className="
            text-slate-500
            mt-2
            text-lg
          "
        >
          AI-powered civic issue concentration analysis
        </p>

      </div>



      {/* Insight Cards */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
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

          <p className="text-slate-500 text-sm">
            High Risk Zones
          </p>

          <h2
            className="
              text-4xl
              font-bold
              text-red-500
              mt-3
            "
          >
            {summary.high_risk_zones}
          </h2>

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

          <p className="text-slate-500 text-sm">
            Active Complaints
          </p>

          <h2
            className="
              text-4xl
              font-bold
              text-yellow-500
              mt-3
            "
          >
            {summary.active_complaints}
          </h2>

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

          <p className="text-slate-500 text-sm">
            Resolution Rate
          </p>

          <h2
            className="
              text-4xl
              font-bold
              text-emerald-500
              mt-3
            "
          >
            {summary.resolution_rate}%
          </h2>

        </div>

      </div>



      {/* Top Hotspot Areas */}

      <div
        className="
          bg-white
          rounded-2xl
          shadow-sm
          border
          border-gray-100
          p-6
        "
      >

        <h2
          className="
            text-2xl
            font-bold
            text-slate-800
            mb-6
          "
        >
          Top Hotspot Areas
        </h2>

        <div className="space-y-4">

          {hotspotAreas.map(
            (area, index) => (

              <div
                key={index}
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-gray-100
                  pb-4
                "
              >

                <div>

                  <h3
                    className="
                      font-semibold
                      text-slate-800
                    "
                  >
                    {area.address}
                  </h3>

                  <p
                    className="
                      text-sm
                      text-slate-500
                      mt-1
                    "
                  >
                    Civic complaints concentration
                  </p>

                </div>

                <span
                  className="
                    px-4
                    py-2
                    rounded-full
                    bg-red-100
                    text-red-600
                    font-semibold
                    text-sm
                  "
                >
                  {area.total} complaints
                </span>

              </div>
            )
          )}

        </div>

      </div>



      {/* Map */}

      <HotspotMap />

    </div>
  )
}

export default HotspotsPage