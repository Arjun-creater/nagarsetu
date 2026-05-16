import api from "../api/axios"

export const getDepartmentTrends = async () => {

  const response = await api.get(
    "/analytics/trends/departments/"
  )

  return response.data
}

export const getTopHotspots = async () => {

  const response = await api.get(
    "/analytics/hotspots/top/"
  )

  return response.data
}

export const getDailyTrends = async () => {

  const response = await api.get(
    "/analytics/trends/daily/"
  )

  return response.data
}