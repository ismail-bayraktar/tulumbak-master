import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import {Routes, Route} from "react-router-dom";
import Add from "./pages/Add.jsx";
import List from "./pages/List.jsx";
import Orders from "./pages/Orders.jsx";
import Edit from "./pages/Edit.jsx";
import Slider from "./pages/Slider.jsx";
import DeliveryZones from "./pages/DeliveryZones.jsx";
import TimeSlots from "./pages/TimeSlots.jsx";
import Coupons from "./pages/Coupons.jsx";
import {useEffect, useState} from "react";
import Login from "./components/Login.jsx";
import { ToastContainer } from 'react-toastify';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '₺';
const App = () => {
    const [token, setToken] = useState(localStorage.getItem("token")
        ? localStorage.getItem("token") : "");

    useEffect(() => {
        localStorage.setItem("token", token);
    }, [token]);

    return (
        <div className={"bg-gray-50 min-h-screen"}>
            <ToastContainer />
            {token === ""
                ? <Login setToken={setToken} />
                : <>
                    <Navbar setToken={setToken} />
                    <hr/>
                    <div className={"flex w-full"}>
                        <Sidebar/>
                        <div className={"w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base"}>
                            <Routes>
                                <Route path={"/add"} element={<Add token={token} />}/>
                                <Route path={"/list"} element={<List token={token} />}/>
                                <Route path={"/slider"} element={<Slider token={token} />}/>
                                <Route path={"/edit/:id"} element={<Edit token={token} />}/>
                                <Route path={"/orders"} element={<Orders token={token} />}/>
                                <Route path={"/delivery-zones"} element={<DeliveryZones token={token} />}/>
                                <Route path={"/time-slots"} element={<TimeSlots token={token} />}/>
                                <Route path={"/coupons"} element={<Coupons token={token} />}/>
                            </Routes>
                        </div>
                    </div>
                </>}
        </div>
    );
};

export default App;
