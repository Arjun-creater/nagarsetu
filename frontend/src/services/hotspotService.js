import api from "../api/axios"

export const getHotspotGeoJSON =
  async () => {

    const response = await api.get(
      "/analytics/hotspots/geojson/"
    )

    return response.data
}