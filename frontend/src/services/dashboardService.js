import api from "../api/axios"

export const getDashboardSummary =
  async () => {

    const response =
      await api.get(
        "/complaints/complaints/dashboard-summary/"
      )

    return response.data
  }