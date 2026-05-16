import NotificationPanel from "../../components/notifications/NotificationPanel"

const NotificationsPage = () => {

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
          Notifications Center
        </h1>

        <p
          className="
            text-slate-500
            mt-2
            text-lg
          "
        >
          Real-time civic complaint activity and AI updates
        </p>

      </div>



      {/* Main Notifications */}

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

        <NotificationPanel />

      </div>

    </div>
  )
}

export default NotificationsPage