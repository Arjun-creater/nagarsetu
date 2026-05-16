import {
  useEffect,
  useState,
} from "react"

const SOCKET_URL =
  "ws://127.0.0.1:8000/ws/notifications/"

const useNotificationsSocket = () => {

  const [notifications, setNotifications] =
    useState([])

  const [connected, setConnected] =
    useState(false)

  useEffect(() => {

    const socket = new WebSocket(
      SOCKET_URL
    )

    socket.onopen = () => {

      console.log(
        "WebSocket connected"
      )

      setConnected(true)
    }

    socket.onmessage = (event) => {

      const data = JSON.parse(
        event.data
      )

      setNotifications((prev) => [
        data,
        ...prev,
      ])
    }

    socket.onclose = () => {

      console.log(
        "WebSocket disconnected"
      )

      setConnected(false)
    }

    return () => {

      socket.close()
    }

  }, [])

  return {
    notifications,
    connected,
  }
}

export default useNotificationsSocket