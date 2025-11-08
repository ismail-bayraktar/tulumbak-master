import {Route, Routes, useLocation} from "react-router-dom";
import {useEffect} from "react";
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

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ScrollToTop = () => {
    const { pathname } = useLocation();
    
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname]);
    
    return null;
};

const App = () => {
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
