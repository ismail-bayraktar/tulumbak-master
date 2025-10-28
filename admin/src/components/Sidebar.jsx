import {NavLink} from "react-router-dom";
import {assets} from "../assets/assets.js";

const Sidebar = () => {
    return (
        <div className={"w-[18%] min-h-screen border-r-2"}>
            <div className={"flex flex-col gap-4 pt-6 pl-[20%] text-[15px]"}>
                <NavLink className={"flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"} to={"/add"}>
                    <img className={"w-5 h-5"} src={assets.add_icon} alt={""} />
                    <p className={"hidden md:block"}>Ürün Ekle</p>
                </NavLink>

                <NavLink className={"flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"} to={"/list"}>
                    <img className={"w-5 h-5"} src={assets.order_icon} alt={""} />
                    <p className={"hidden md:block"}>Ürün Listesi</p>
                </NavLink>

                <NavLink className={"flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"} to={"/slider"}>
                    <img className={"w-5 h-5"} src={assets.order_icon} alt={""} />
                    <p className={"hidden md:block"}>Slider Yönetimi</p>
                </NavLink>

                <NavLink className={"flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"} to={"/orders"}>
                    <img className={"w-5 h-5"} src={assets.order_icon} alt={""} />
                    <p className={"hidden md:block"}>Siparişler</p>
                </NavLink>

                <NavLink className={"flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"} to={"/delivery-zones"}>
                    <img className={"w-5 h-5"} src={assets.order_icon} alt={""} />
                    <p className={"hidden md:block"}>Teslimat Bölgeleri</p>
                </NavLink>

                <NavLink className={"flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"} to={"/time-slots"}>
                    <img className={"w-5 h-5"} src={assets.order_icon} alt={""} />
                    <p className={"hidden md:block"}>Zaman Aralıkları</p>
                </NavLink>

                <NavLink className={"flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"} to={"/coupons"}>
                    <img className={"w-5 h-5"} src={assets.order_icon} alt={""} />
                    <p className={"hidden md:block"}>Kuponlar</p>
                </NavLink>

                <NavLink className={"flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"} to={"/corporate-orders"}>
                    <img className={"w-5 h-5"} src={assets.order_icon} alt={""} />
                    <p className={"hidden md:block"}>Kurumsal Siparişler</p>
                </NavLink>
            </div>

        </div>
    );
};

export default Sidebar;
