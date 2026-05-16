import {
  FiHome,
  FiAlertTriangle,
  FiMap,
  FiBarChart2,
  FiPlusCircle,
  FiFileText,
  FiLogOut,
} from "react-icons/fi"

import {
  NavLink,
} from "react-router-dom"
import {
  
  useNavigate,
} from "react-router-dom"
const Sidebar = () => {

  const navigate = useNavigate()

  const handleLogout = () => {

    localStorage.removeItem(
      "access"
    )

    localStorage.removeItem(
      "refresh"
    )

    navigate("/login")
  }
  const menuItems = [

    {
      title: "Dashboard",
      icon: <FiHome />,
      path: "/dashboard",
    },

    {
      title: "Complaints",
      icon: <FiAlertTriangle />,
      path: "/complaints",
    },

    {
      title: "My Complaints",
      icon: <FiFileText />,
      path: "/my-complaints",
    },

    {
      title: "Hotspots",
      icon: <FiMap />,
      path: "/hotspots",
    },

    {
      title: "Analytics",
      icon: <FiBarChart2 />,
      path: "/analytics",
    },

  ]

  return (

    <aside
      className="
         w-64
  h-screen
  bg-[#0f172a]
  text-white
  flex
  flex-col
      "
    >

      {/* Logo Section */}

      <div
        className="
          p-6
          border-b
          border-slate-700
        "
      >

        <h1
          className="
            text-2xl
            font-bold
          "
        >
          NagarSetu
        </h1>

        <p
          className="
            text-sm
            text-slate-400
            mt-1
          "
        >
          Civic Intelligence Platform
        </p>

      </div>



      {/* Main Navigation */}

      <nav
         className="
    flex-1
    p-4
    space-y-2
    overflow-y-auto
  "
      >

        {menuItems.map((item) => (

          <NavLink
            key={item.title}
            to={item.path}

            className={({ isActive }) => `
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              transition-all
              duration-200

              ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }
            `}
          >

            <span className="text-lg">
              {item.icon}
            </span>

            <span className="font-medium">
              {item.title}
            </span>

          </NavLink>

        ))}



        {/* Create Complaint CTA */}

        <NavLink
          to="/create-complaint"

          className={({ isActive }) => `
            mt-6
            flex
            items-center
            justify-center
            gap-3
            px-4
            py-4
            rounded-2xl
            font-semibold
            transition-all
            duration-200
            shadow-lg

            ${
              isActive
                ? "bg-emerald-500 text-white"
                : "bg-emerald-500 hover:bg-emerald-600 text-white"
            }
          `}
        >

          <FiPlusCircle className="text-xl" />

          Create Complaint

        </NavLink>

      </nav>



      {/* Bottom Section */}

      <div
        className="
          p-4
          border-t
          border-slate-700
        "
      >

        <button
          className="
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-xl
            text-slate-300
            hover:bg-red-500
            hover:text-white
            transition-all
            duration-200
          "
          onClick={handleLogout}
        >

          <FiLogOut className="text-lg" />

          <span className="font-medium" >
            Logout
          </span>

        </button>

      </div>

    </aside>
  )
}

export default Sidebar