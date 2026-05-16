import api from "../api/axios"

export const getComplaints = async (
  url = "/complaints/complaints/"
) => {

  const response = await api.get(url)

  return response.data
}

export const getComplaintDetail =
  async (id) => {

    const response = await api.get(
      `/complaints/complaints/${id}/`
    )

    return response.data
}

export const createComplaint =
  async (complaintData) => {

    const response = await api.post(
      "/complaints/complaints/",
      complaintData
    )

    return response.data
}

export const getHotspotSummary =
  async () => {

    const response = await api.get(
      "/complaints/complaints/hotspot-summary/"
    )

    return response.data
}

export const getHotspotAreas =
  async () => {

    const response = await api.get(
      "/complaints/complaints/hotspot-areas/"
    )

    return response.data
}

export const getMyComplaints =
  async () => {

    const response = await api.get(
      "/complaints/complaints/my-complaints/"
    )

    return response.data
}

export const getComplaintTimeline =
  async (id) => {

    const response = await api.get(
      `/complaints/complaints/${id}/timeline/`
    )

    return response.data
}