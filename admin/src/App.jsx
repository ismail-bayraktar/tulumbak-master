import { Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/layouts/theme-provider"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import Login from "@/pages/auth/login"
import DashboardPage from "@/pages/dashboard"

// Legacy imports (eski sayfalar)
import Add from "./pages/Add"
import List from "./pages/List"
import Orders from "./pages/Orders"
import Edit from "./pages/Edit"
import DeliveryZones from "./pages/DeliveryZones"
import TimeSlots from "./pages/TimeSlots"
import Coupons from "./pages/Coupons"
import CorporateOrders from "./pages/CorporateOrders"
import Settings from "./pages/Settings"
import Reports from "./pages/Reports"
import CourierTestPanel from "./pages/CourierTestPanel"
import EmailLogs from "./pages/EmailLogs"
import SmsLogs from "./pages/SmsLogs"
import Branches from "./pages/Branches"
import MediaLibrary from "./pages/MediaLibrary"
import OrderProcessing from "./pages/OrderProcessing"
import BranchAssignmentSettings from "./pages/BranchAssignmentSettings"

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = "₺"

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  )

  useEffect(() => {
    localStorage.setItem("token", token)
  }, [token])

  return (
    <ThemeProvider defaultTheme="light" storageKey="tulumbak-ui-theme">
      <Toaster position="top-right" richColors />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <DashboardLayout setToken={setToken}>
          <Routes>
            <Route path="/" element={<DashboardPage token={token} />} />
            <Route path="/dashboard" element={<DashboardPage token={token} />} />
            <Route path="/add" element={<Add token={token} />} />
            <Route path="/list" element={<List token={token} />} />
            <Route path="/edit/:id" element={<Edit token={token} />} />
            <Route path="/orders" element={<Orders token={token} />} />
            <Route path="/order-processing" element={<OrderProcessing token={token} />} />
            <Route path="/branch-assignment-settings" element={<BranchAssignmentSettings token={token} />} />
            <Route path="/delivery-zones" element={<DeliveryZones token={token} />} />
            <Route path="/time-slots" element={<TimeSlots token={token} />} />
            <Route path="/coupons" element={<Coupons token={token} />} />
            <Route path="/corporate-orders" element={<CorporateOrders token={token} />} />
            <Route path="/settings" element={<Settings token={token} />} />
            <Route path="/email-logs" element={<EmailLogs token={token} />} />
            <Route path="/sms-logs" element={<SmsLogs token={token} />} />
            <Route path="/reports" element={<Reports token={token} />} />
            <Route path="/courier-test" element={<CourierTestPanel token={token} />} />
            <Route path="/branches" element={<Branches token={token} />} />
            <Route path="/media-library" element={<MediaLibrary token={token} />} />
          </Routes>
        </DashboardLayout>
      )}
    </ThemeProvider>
  )
}

export default App
