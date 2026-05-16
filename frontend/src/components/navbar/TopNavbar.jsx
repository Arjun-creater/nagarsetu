import { FiSearch } from "react-icons/fi"

const TopNavbar = () => {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        shadow-sm
        px-6
        py-4
        flex
        items-center
        justify-between
      "
    >

      <div>

        <h2 className="text-2xl font-bold text-slate-800">
          Dashboard
        </h2>

        <p className="text-slate-500 text-sm">
          Real-time civic intelligence overview
        </p>

      </div>

      <div
        className="
          flex
          items-center
          gap-3
          bg-slate-100
          px-4
          py-2
          rounded-xl
        "
      >

        <FiSearch className="text-slate-500" />

        <input
          type="text"
          placeholder="Search complaints..."
          className="
            bg-transparent
            outline-none
            text-sm
          "
        />

      </div>

    </div>
  )
}

export default TopNavbar