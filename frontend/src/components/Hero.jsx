import {assets} from "../assets/assets.js";
import {Link} from "react-router-dom";

const Hero = () => {
    return (
        <div className="flex flex-col sm:flex-row border border-gray-400 mt-5">
            {/* Hero Left Side */}
            <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
                <div className={"text-[#414141]"}>
                    <div className={"flex items-center gap-2"}>
                        <p className={"w-8 md:w-11 h-[2px] bg-[#414141]"}></p>
                        <p className={"font-medium text-sm md:text-base"}>Çameli Yaylasından Sofranıza</p>
                    </div>
                    <h1 className={"text-3xl sm:py-3 lg:text-5xl leading-relaxed text-orange-400"}>Tulumbak İzmir Baklava</h1>
                    <div className={"flex items-center gap-2"}>
                        <p className={"font-semibold text-sm md:text-base"}>İzmir’in taze baklavası, günlük üretim ve hızlı teslimat</p>
                        <p className={"w-8 md:w-11 h-[2px] bg-[#414141]"}></p>
                    </div>
                    <div className={"py-6"}>
                        <Link to={"/collection"}>
                            <button
                                className={"border border-black px-10 py-4 text-sm hover:bg-orange-400 hover:text-white transition-all duration-500"}> Ürünleri
                                Keşfet
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            {/* Hero Right Side */}
            <img className={"w-full sm:w-1/2"} src={assets.hero_img} alt={"hero-image"}/>
        </div>
    );
};

export default Hero;
