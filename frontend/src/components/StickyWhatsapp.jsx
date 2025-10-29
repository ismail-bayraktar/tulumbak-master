import { assets } from "../assets/assets.js";
import { MessageCircle } from "lucide-react";

const StickyWhatsapp = () => {
    return (
        <div className="fixed bottom-7 right-5 z-50">
            <a
                href="https://wa.me/905415048662?text=Merhaba, Tulumbak İzmir Baklava sitesinden yazıyorum. Sipariş ve bilgi alabilir miyim?"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
                <MessageCircle
                    className="w-12 h-12"
                    fill="white"
                />
            </a>


        </div>
    );
};

export default StickyWhatsapp;
