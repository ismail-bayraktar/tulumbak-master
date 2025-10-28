import Title from "../components/Title.jsx";
import {assets} from "../assets/assets.js";

const About = () => {
    return (
        <div>
            <div className={"text-4xl text-center pt-8 border-t"}>
                <Title primaryText={"TULUMBAK"} secondaryText={"İZMİR BAKLAVA"} />
            </div>
            <div className={"my-10 flex flex-col md:flex-row gap-16"}>
                <img className={"w-full md:max-w-[450px]"} src={assets.about_img} alt=""/>
                <div className={"flex flex-col justify-center gap-6 md:w-2/4 text-gray-600"}>
                    <p>Tulumbak İzmir Baklava: İzmir’in taze, günlük üretilen baklavasını en lezzetli haliyle sunuyoruz. Ustalıkla açılan ince hamur, kaliteli Antep fıstığı ve geleneksel şerbet dengesiyle fark yaratıyoruz.</p>
                    <p>İzmir içi hızlı teslimat ve özenli paketleme ile özel günlerinize lezzet katıyoruz. Mottomuz: her gün taze üretim, her lokmada İzmir’in özel baklava lezzeti.</p>
                </div>
            </div>
            <div className={"text-4xl py-4"}>
                <Title primaryText={"NEDEN"} secondaryText={"BİZ"} />
            </div>
            <div className={"flex flex-col md:flex-row text-sm mb-20"}>
                <div className={"border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5"}>
                    <b>Doğallık ve Tazelik</b>
                    <p className={"text-gray-600"}>Her gün taze üretim: ince hamur, dengeli şerbet, bol fıstık. İzmir’in taze baklavasını en hızlı şekilde sofranıza ulaştırıyoruz.</p>
                </div>
                <div className={"border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5"}>
                    <b>Sağlıklı Yaşam</b>
                    <p className={"text-gray-600"}>Kaliteli malzeme ve hijyenik üretim standartlarımızla güvenilir ve özenli bir baklava deneyimi sunuyoruz.</p>
                </div>
                <div className={"border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5"}>
                    <b>Sürdürülebilirlik</b>
                    <p className={"text-gray-600"}>Tedarikten paketlemeye kadar süreçlerimizde israfı azaltır, yerel üreticileri destekleriz.</p>
                </div>
            </div>
            {/*<NewsLetter/>*/}
        </div>
    );
};
export default About;