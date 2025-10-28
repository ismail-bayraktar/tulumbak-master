import { ShopContext } from "../context/ShopContext.jsx";
import { useContext } from "react";
import Title from "./Title.jsx";

const CartTotal = ({ isBelowMinimum }) => {
    const { currency, getCartAmount, getShippingFee, freeShippingThreshold } = useContext(ShopContext);
    const cartAmount = getCartAmount();
    const shippingFee = getShippingFee();
    const amountForFreeShipping = Math.max(freeShippingThreshold - cartAmount, 0);
    const formattedThreshold = Number.isInteger(freeShippingThreshold)
        ? freeShippingThreshold.toFixed(0)
        : freeShippingThreshold.toFixed(2);

    return (
        <div className={"w-full"}>
            <div className={"text-xl"}>
                <Title primaryText={"SEPET"} secondaryText={"TOPLAMI"} />
            </div>

            <div className={"flex flex-col gap-2 mt-2 text-sm"}>
                <div className={"flex justify-between"}>
                    <p>Sepet Tutarı</p>
                    <p> {currency} {cartAmount.toFixed(2)} </p>
                </div>
                <hr />

                <div className={"flex justify-between"}>
                    <p>Kargo Bedeli</p>
                    <p> {currency} {shippingFee.toFixed(2)} </p>
                </div>
                <hr />

                <div className={"flex justify-between"}>
                    <b>Toplam</b>
                    <b> {currency} {(cartAmount === 0 ? 0 : cartAmount + shippingFee).toFixed(2)} </b>
                </div>
            </div>

            {shippingFee === 0 ? (
                <p className={"text-green-600 text-sm mt-4"}>
                    {`${currency} ${formattedThreshold} ve üzeri alışverişlerde kargo ücretsiz.`}
                </p>
            ) : (
                <p className={"text-gray-500 text-sm mt-4"}>
                    {`Ücretsiz kargo için ${currency} ${amountForFreeShipping.toFixed(2)} daha tutarında ürün ekleyiniz.`}
                </p>
            )}

            {isBelowMinimum && (
                <p className="text-red-500 text-sm mt-2">
                    Sepet tutarı minimum ₺ 1000  olmalıdır. Lütfen daha fazla ürün ekleyin.
                </p>
            )}
        </div>
    );
};

export default CartTotal;
