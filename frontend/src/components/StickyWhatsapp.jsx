import { assets } from "../assets/assets.js";

const StickyWhatsapp = () => {
    return (
        <div className="fixed bottom-7 right-5 z-50">
            <a
                href="https://wa.me/905415048662?text=Merhaba, Tulumbak İzmir Baklava sitesinden yazıyorum. Sipariş ve bilgi alabilir miyim?"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    src={assets.whatsapp_icon}
                    alt="whatsapp-icon"
                    className="w-23 h-23 hover:opacity-80"
                />
            </a>


        </div>
    );
};

export default StickyWhatsapp;
