import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import {Routes, Route} from "react-router-dom";
import Add from "./pages/Add.jsx";
import List from "./pages/List.jsx";
import Orders from "./pages/Orders.jsx";
import Edit from "./pages/Edit.jsx";
import Slider from "./components/ModernSlider.jsx";
import DeliveryZones from "./pages/DeliveryZones.jsx";
import TimeSlots from "./pages/TimeSlots.jsx";
import Coupons from "./pages/Coupons.jsx";
import CorporateOrders from "./pages/CorporateOrders.jsx";
import Settings from "./pages/Settings.jsx";
import BackendStatus from "./pages/BackendStatus.jsx";
import Reports from "./pages/Reports.jsx";
import CourierManagement from "./pages/CourierManagement.jsx";
import CourierIntegrationSettings from "./pages/CourierIntegrationSettings.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EmailLogs from "./pages/EmailLogs.jsx";
import SmsLogs from "./pages/SmsLogs.jsx";
import Branches from "./pages/Branches.jsx";
import MediaLibrary from "./pages/MediaLibrary.jsx";
import OrderProcessing from "./pages/OrderProcessing.jsx";
import BranchAssignmentSettings from "./pages/BranchAssignmentSettings.jsx";
import {useEffect, useState} from "react";
import Login from "./components/Login.jsx";
import { ToastContainer } from 'react-toastify';
import { SidebarProvider } from "./context/SidebarContext.jsx";
import { ThemeProvider, useTheme } from "./context/ThemeContext.jsx";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '₺';

const ToastContainerWrapper = () => {
    const { isDarkMode } = useTheme();
    return (
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={isDarkMode ? "dark" : "light"}
            className="text-sm"
        />
    );
};

const App = () => {
    const [token, setToken] = useState(localStorage.getItem("token")
        ? localStorage.getItem("token") : "");

    useEffect(() => {
        localStorage.setItem("token", token);
    }, [token]);

    return (
        <ThemeProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <ToastContainerWrapper />
                {token === "" ? (
                    <Login setToken={setToken} />
                ) : (
                    <SidebarProvider>
                        <div className="flex h-screen overflow-hidden">
                        {/* Modern Sidebar */}
                        <Sidebar />

                        {/* Main Content Area */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            {/* Modern Navbar */}
                            <Navbar setToken={setToken} />

                            {/* Page Content */}
                            <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                                <div className="p-6 lg:p-8">
                                    <Routes>
                                        <Route path="/" element={<Dashboard token={token} />}/>
                                        <Route path="/dashboard" element={<Dashboard token={token} />}/>
                                        <Route path="/add" element={<Add token={token} />}/>
                                        <Route path="/list" element={<List token={token} />}/>
                                        <Route path="/slider" element={<Slider token={token} />}/>
                                        <Route path="/edit/:id" element={<Edit token={token} />}/>
                                        <Route path="/orders" element={<Orders token={token} />}/>
                                        <Route path="/order-processing" element={<OrderProcessing token={token} />}/>
                                        <Route path="/branch-assignment-settings" element={<BranchAssignmentSettings token={token} />}/>
                                        <Route path="/delivery-zones" element={<DeliveryZones token={token} />}/>
                                        <Route path="/time-slots" element={<TimeSlots token={token} />}/>
                                        <Route path="/coupons" element={<Coupons token={token} />}/>
                                        <Route path="/corporate-orders" element={<CorporateOrders token={token} />}/>
                                        <Route path="/settings" element={<Settings token={token} />}/>
                                        <Route path="/email-logs" element={<EmailLogs token={token} />}/>
                                        <Route path="/sms-logs" element={<SmsLogs token={token} />}/>
                                        <Route path="/reports" element={<Reports token={token} />}/>
                                        <Route path="/courier-management" element={<CourierManagement token={token} />}/>
                                        <Route path="/courier-integration" element={<CourierIntegrationSettings token={token} />}/>
                                        <Route path="/branches" element={<Branches token={token} />}/>
                                        <Route path="/media-library" element={<MediaLibrary token={token} />}/>
                                    </Routes>
                                </div>
                            </main>
                        </div>
                        </div>
                    </SidebarProvider>
                )}
            </div>
        </ThemeProvider>
    );
};

export default App;
