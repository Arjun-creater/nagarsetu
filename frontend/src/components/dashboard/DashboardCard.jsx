const DashboardCard = ({
  title,
  children,
}) => {
  return (

    <div
      className="
        bg-white
        rounded-2xl
        shadow-sm
        border
        border-gray-100
        p-5
      "
    >

      {title && (

        <div className="mb-4">

          <h2
            className="
              text-lg
              font-semibold
              text-slate-800
            "
          >
            {title}
          </h2>

        </div>

      )}

      {children}

    </div>
  )
}

export default DashboardCard