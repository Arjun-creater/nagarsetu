import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import DashboardLayout from "../layouts/DashboardLayout"

import DashboardPage from "../pages/DashboardPage"
import ComplaintDetailPage from "../pages/ComplaintDetailPage"

import HotspotsPage from "../pages/Hotspots/HotspotsPage"
import NotificationsPage from "../pages/Notifications/NotificationsPage"
import AnalyticsPage from "../pages/Analytics/AnalyticsPage"
import ComplaintsPage from "../pages/Complaints/ComplaintsPage"

import LoginPage from "../pages/auth/LoginPage"
import SignupPage from "../pages/auth/SignupPage"

import ProtectedRoute from "./ProtectedRoute"

import CreateComplaintPage from "../pages/CreateComplaintPage"
import MyComplaintsPage
from "../pages/Complaints/MyComplaintsPage"
const AppRoutes = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public Routes */}

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<SignupPage />} />



        {/* Protected Dashboard Routes */}

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
              
            </ProtectedRoute>
          }
        >

          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/create-complaint"
            element={<CreateComplaintPage />}
          />

          <Route
            path="/complaints"
            element={<ComplaintsPage />}
          />
          <Route
  path="/my-complaints"
  element={<MyComplaintsPage />}
/>

          <Route
            path="/complaints/:id"
            element={<ComplaintDetailPage />}
          />

          <Route
            path="/hotspots"
            element={<HotspotsPage />}
          />

          <Route
            path="/analytics"
            element={<AnalyticsPage />}
          />

          <Route
            path="/notifications"
            element={<NotificationsPage />}
          />

        </Route>



        {/* Redirect Unknown Routes */}

        <Route
  path="*"
  element={

    localStorage.getItem("access")
      ? (
        <Navigate
          to="/dashboard"
          replace
        />
      ) : (
        <Navigate
          to="/login"
          replace
        />
      )

  }
/>

      </Routes>

    </BrowserRouter>
  )
}

export default AppRoutes