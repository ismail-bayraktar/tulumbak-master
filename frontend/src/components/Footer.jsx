import {assets} from "../assets/assets.js";
import {Link} from "react-router-dom";

const Footer = () => {
    return (
        <div>
            <div className={"flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-20 text-sm"}>
                <div>
                    <img src={assets.logo} className={"mb-5 w-32"} alt={"logo"}/>
                    <p className={"w-full md:w-2/3"}>Çameli yaylasından sofralarınıza sunulan kaliteli, sağlıklı ve lezzetli ürünlerin adresi.</p>
                </div>
                <div>
                    <p className={"text-xl font-medium mb-5"}>KURUMSAL</p>
                    <ul className={"flex flex-col gap-1 text-gray-600"}>
                        <Link to={"/"}>Ana Sayfa</Link>
                        <Link to={"/about"}>Hakkımızda</Link>
                        <Link to={"/contact"}>İletişim</Link>
                    </ul>
                </div>
                <div>
                    <p className={"text-xl font-medium mb-5"}>İLETİŞİM</p>
                    <ul className={"flex flex-col gap-1 text-gray-600"}>
                        <li>+90 541 504 86 62</li>
                        <p className={"text-gray-500"}>Arıkaya Mahallesi</p>
                        <p className={"text-gray-500"}>No: 57, Çameli</p>
                        <p className={"text-gray-500"}>Denizli/Türkiye</p>
                    </ul>
                </div>
            </div>

            <div>
                <hr />
                <span className={"text-sm text-center"}>2026 @ Tüm Hakları Saklıdır.</span>{" "}
                <span className={"text-sm text-gray-500 text-center"}>Design & Developed by <a href={"https://www.voyira.com"}><span className={"font-bold"}>voyira.</span></a></span>
            </div>
        </div>
    );
};

export default Footer;