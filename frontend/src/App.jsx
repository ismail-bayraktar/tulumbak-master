import {Route, Routes, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import Home from "./pages/Home.jsx";
import Collection from "./pages/Collection.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import ModernProductDetail from "./components/ModernProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import PlaceOrder from "./pages/PlaceOrder.jsx";
import Orders from "./pages/Orders.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import SearchBar from "./components/SearchBar.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentFailPage from "./pages/PaymentFailPage.jsx";
import WhatsAppSupport from "./components/WhatsAppSupport.jsx";
import MaintenancePage from "./pages/MaintenancePage.jsx";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ScrollToTop = () => {
    const { pathname } = useLocation();
    
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname]);
    
    return null;
};

const App = () => {
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [checkingMaintenance, setCheckingMaintenance] = useState(true);

    useEffect(() => {
        // Check maintenance mode on app load
        const checkMaintenanceMode = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/settings/maintenance-status`);
                const data = await response.json();

                if (data.success) {
                    setMaintenanceMode(data.maintenanceMode);
                }
            } catch (error) {
                console.error('Error checking maintenance mode:', error);
                // On error, assume site is available
                setMaintenanceMode(false);
            } finally {
                setCheckingMaintenance(false);
            }
        };

        checkMaintenanceMode();
    }, []);

    // Show loading while checking maintenance status
    if (checkingMaintenance) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    // Show maintenance page if enabled
    if (maintenanceMode) {
        return <MaintenancePage />;
    }

    return (
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
            <ScrollToTop />
            <ToastContainer />
            <Navbar />
            <SearchBar />
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/collection" element={<Collection/>} />
                <Route path="/about" element={<About/>} />
                <Route path="/contact" element={<Contact/>} />
                <Route path="/product/:productId" element={<ModernProductDetail/>} />
                <Route path="/cart" element={<Cart/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/place-order" element={<PlaceOrder/>} />
                <Route path="/orders" element={<Orders/>} />
                <Route path="/paymentfail" element={<PaymentFailPage />} />
            </Routes>
            <Footer />
            <WhatsAppSupport />
        </div>
    );
};

export default App;
