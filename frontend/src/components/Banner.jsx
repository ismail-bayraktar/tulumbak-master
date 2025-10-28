import {assets} from "../assets/assets.js";
import {Link} from "react-router-dom";

const Hero = () => {
    return (
        <div className="flex flex-col sm:flex-row border border-gray-400">
            {/* Hero Left Side */}
            <img className={"w-full sm:w-1/2"} src={assets.banner} alt={"hero-image"}/>
            {/* Hero Right Side */}
            <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
                <div className={"text-[#414141]"}>
                    <div className={"flex items-center gap-2"}>
                        <p className={"w-8 md:w-11 h-[2px] bg-[#414141]"}></p>
                        <p className={"prata-regular font-medium text-sm md:text-base"}>Tazelikten Gelen Doğallık!</p>
                    </div>
                    <h1 className={"prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed"}>Tulumbak İzmir Baklava</h1>
                    <div className={"flex items-center gap-2"}>
                        <p className={"font-semibold text-sm md:text-base"}>İzmir’in meşhur baklavası; özenli ustalık, özel lezzet.</p>
                        <p className={"w-8 md:w-11 h-[2px] bg-[#414141]"}></p>
                    </div>
                    <div className={"py-6"}>
                        <Link to={"/collection"}>
                            <button
                                className={"border border-black px-10 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500"}> Ürünleri Keşfet </button>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Hero;