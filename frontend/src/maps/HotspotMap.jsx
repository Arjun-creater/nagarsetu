import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet"

import {
  useEffect,
  useState,
} from "react"

import {
  FiAlertTriangle,
} from "react-icons/fi"

import {
  getHotspotGeoJSON,
} from "../services/hotspotService"

const HotspotMap = () => {

  const [features, setFeatures] =
    useState([])

  const [loading, setLoading] =
    useState(true)



  const fetchHotspots = async () => {

    try {

      const data =
        await getHotspotGeoJSON()

      setFeatures(data.features)

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)
    }
  }



  useEffect(() => {

    fetchHotspots()

    const interval = setInterval(() => {

      fetchHotspots()

    }, 15000)

    return () => clearInterval(interval)

  }, [])



  const getSeverityColor = (
  severity
) => {

  if (severity >= 3) {
    return "#ef4444"
  }

  if (severity >= 2) {
    return "#f59e0b"
  }

  return "#22c55e"
}
const getDepartmentColor = (
  department
) => {

  switch (
    department?.toLowerCase()
  ) {

    case "sanitation":
      return "#ef4444"

    case "water":
      return "#3b82f6"

    case "roads":
      return "#f59e0b"

    case "electricity":
      return "#eab308"

    default:
      return "#22c55e"
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
            Civic Hotspot Intelligence
          </h2>

          <p
            className="
              text-sm
              text-slate-500
              mt-1
            "
          >
            AI-detected complaint concentration zones
          </p>

        </div>



        <div
          className="
            w-12
            h-12
            rounded-2xl
            bg-red-100
            flex
            items-center
            justify-center
            text-red-500
            text-xl
          "
        >

          <FiAlertTriangle />

        </div>

      </div>



      {/* Loading State */}

      {loading ? (

        <div
          className="
            h-[450px]
            flex
            items-center
            justify-center
            text-slate-500
          "
        >
          Loading hotspot intelligence...
        </div>

      ) : (

        <div
          className="
            h-[450px]
            w-full
          "
        >

          <MapContainer
            center={[28.6139, 77.2090]}
            zoom={11}
            className="h-full w-full"
          >

            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />



            {features.map(
              (feature, index) => {

                const coordinates =
                  feature.geometry.coordinates

                const properties =
                  feature.properties

                const severityColor =
                  getSeverityColor(
                    properties.department
                  )

                return (

                  <CircleMarker
                    key={index}

                    center={[
                      coordinates[1],
                      coordinates[0],
                    ]}

                    radius={
                      Math.max(
                        properties.complaint_count * 6,
                        18
                      )
                    }

                    pathOptions={{
                      color: severityColor,
                      fillColor: severityColor,
                      fillOpacity: 0.8,
                      weight: 2,
                      opacity: 1,
                    }}
                  >

                    <Popup>

                      <div className="space-y-3 min-w-[200px]">

                        <div>

                          <h3
                            className="
                              text-lg
                              font-bold
                              text-slate-800
                            "
                          >
                            {
                              properties.department
                            }
                          </h3>

                          <p
                            className="
                              text-sm
                              text-slate-500
                            "
                          >
                            Civic hotspot zone
                          </p>

                        </div>



                        <div
                          className="
                            grid
                            grid-cols-2
                            gap-3
                          "
                        >

                          <div
                            className="
                              bg-slate-100
                              rounded-xl
                              p-3
                            "
                          >

                            <p
                              className="
                                text-xs
                                text-slate-500
                              "
                            >
                              Complaints
                            </p>

                            <h4
                              className="
                                text-lg
                                font-bold
                              "
                            >
                              {
                                properties.complaint_count
                              }
                            </h4>

                          </div>



                          <div
                            className="
                              bg-slate-100
                              rounded-xl
                              p-3
                            "
                          >

                            <p
                              className="
                                text-xs
                                text-slate-500
                              "
                            >
                              Severity
                            </p>

                            <h4
                              className="
                                text-lg
                                font-bold
                              "
                            >
                              {
                                properties.severity_score
                              }
                            </h4>

                          </div>

                        </div>



                        <div
                          className="
                            inline-flex
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-semibold
                            text-white
                          "
                          style={{
                            backgroundColor:
                              severityColor,
                          }}
                        >

                          {properties.department} hotspot

                        </div>

                      </div>

                    </Popup>

                  </CircleMarker>
                )
              }
            )}

          </MapContainer>

        </div>

      )}

    </div>
  )
}

export default HotspotMap