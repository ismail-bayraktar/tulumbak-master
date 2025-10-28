import Title from "../components/Title.jsx";
import {assets} from "../assets/assets.js";
import {Link} from "react-router-dom";

const Contact = () => {
    return (
        <div>
            <div className={"text-center text-4xl pt-10 border-t"}>
                <Title primaryText={'BIZE'} secondaryText={'ULASIN'} />
            </div>
            <div className={"my-10 flex flex-col justify-center md:flex-row gap-10 mb-28"}>
                <img className={"w-full md:max-w-[480px]"} src={assets.contact_img} alt=""/>
                <div className={"flex flex-col justify-center items-start gap-6"}>
                    <p className={"font-semibold text-xl text-gray-600"}>Adresimiz</p>
                    <p className={"text-gray-500"}>Arıkaya Mahallesi<br/> No: 57, Çameli, Denizli</p>
                    <p className={"text-gray-500"}>Tel : +90 541 504 86 62 </p>
                    <Link to={"/collection"}>
                        <button
                            className={"border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500"}> Ürünleri Keşfet </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default Contact;