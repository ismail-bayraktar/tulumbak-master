import {assets} from "../assets/assets.js";

const OurPolicy = () => {
    return (
        <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">

            <div>
                <img
                    src={assets.exchange_icon}
                    alt={"exchange-icon"}
                    className="w-12 m-auto mb-5"
                />
                <p className={"font-semibold "}>Doğallık ve Tazelik</p>
                <p className={"text-gray-400"}>Tulumbak: günlük üretilen İzmir baklavası, hızlı teslimat ve özenli paketleme.</p>
            </div>
            <div>
                <img
                    src={assets.quality_icon}
                    alt={"exchange-icon"}
                    className="w-12 m-auto mb-5"
                />
                <p className={"font-semibold"}>Özenli Üretim</p>
                <p className={"text-gray-400"}>Hijyenik koşullar ve birinci sınıf malzeme ile ustalıkla hazırlanır.</p>
            </div>
            <div>
                <img
                    src={assets.exchange_icon}
                    alt={"exchange-icon"}
                    className="w-12 m-auto mb-5"
                />
                <p className={"font-semibold"}>Sürdürülebilirlik</p>
                <p className={"text-gray-400"}>Ürünlerimizi elde ederken çevreyi korumak ve gelecek nesillere daha yeşil bir dünya bırakıyoruz.</p>
            </div>
        </div>

    );
};

export default OurPolicy;