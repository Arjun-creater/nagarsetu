import api from "../../api/axios"

export const sendChatMessage = async (
  message
) => {

  const response = await api.post(
    "/chatbot/chat/",
    {
      message,
    }
  )

  return response.data
}