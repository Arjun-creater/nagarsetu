import api from "../api/axios"

export const analyzeComplaintImage =
  async (image) => {

    const formData =
      new FormData()

    formData.append(
      "image",
      image
    )

    const response =
      await api.post(
        "/ai/analyze-image/",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      )
    
    console.log(response.data)

    return response.data
}