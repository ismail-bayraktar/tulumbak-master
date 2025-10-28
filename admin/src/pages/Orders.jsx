import {useEffect, useState} from 'react'
import axios from "axios";
import {backendUrl, currency} from "../App.jsx";
import {toast} from "react-toastify";
import {assets} from "../assets/assets.js";

const Orders = ({token}) => {

    const [orders, setOrders] = useState([])

    const fetchAllOrders = async () => {
        if (!token) {
            return null;
        }
        try {
            const response = await axios.post(backendUrl + '/api/order/list', {}, {headers: {token}})
            if (response.data.success) {
                setOrders(response.data.orders.reverse());
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const statusHandler = async (event, orderId) => {
        try {
            const response = await axios.post(backendUrl + '/api/order/status', {
                orderId,
                status: event.target.value
            }, {headers: {token}})
            if (response.data.success) {
                await fetchAllOrders()
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }
    useEffect(() => {
        fetchAllOrders();
    }, [token])
    return (
        <div>
            <h3>Order Page</h3>
            <div>
                {orders.map((order, index) => (
                    <div
                        className={"grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"}
                        key={index}>
                        <img className={"w-12"} src={assets.parcel_icon} alt={""}/>
                        <div>
                            <div>
                                {order.items.map((item, index) => {
                                    if (index === order.items.length - 1) {
                                        return <p className={"py-0.5"} key={index}> {item.name} - {item.quantity} adet
                                            <span> {item.size} KG </span>
                                        </p>

                                    } else {
                                        return <p className={"py-0.5"} key={index}> {item.name} - {item.quantity} adet
                                            <span> {item.size} KG </span> , </p>
                                    }
                                })}
                            </div>
                            <p className={"mt-3 mb-2 font-medium"}>{order.address.firstName + " " + order.address.lastName}</p>
                            <div>
                                <p>{order.address.street + ","}</p>
                                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                            </div>
                            <p>{order.address.phone}</p>
                        </div>
                        <div>
                            <p className={"text-sm sm:text-[15px]"}>Ürün Adeti : {order.items.length}</p>
                            <p className={"mt-3"}>Ödeme Yöntemi : {order.paymentMethod}</p>
                            <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
                            <p>Date : {new Date(order.date).toLocaleDateString()}</p>
                            {order.courierStatus && (
                                <p className="mt-2 text-xs">
                                    Kurye: <span className={`font-semibold ${
                                        order.courierStatus === 'delivered' ? 'text-green-600' :
                                        order.courierStatus === 'on_the_way' ? 'text-blue-600' :
                                        order.courierStatus === 'picked_up' ? 'text-orange-600' :
                                        'text-gray-600'
                                    }`}>
                                        {order.courierStatus === 'waiting' ? 'Bekleniyor' :
                                         order.courierStatus === 'picked_up' ? 'Kuryede' :
                                         order.courierStatus === 'on_the_way' ? 'Yolda' :
                                         order.courierStatus === 'delivered' ? 'Teslim Edildi' :
                                         order.courierStatus}
                                    </span>
                                </p>
                            )}
                        </div>
                        <p className={"text-sm sm:text-[15px]"}>{currency} {order.paymentMethod === "PayTR" ? (order.amount / 100) : order.amount}</p>
                        <select onChange={(event) => statusHandler(event, order._id)} value={order.status}
                                className={"p-2 font-semibold"}>
                            <option value="Siparişiniz Alındı">Siparişiniz Alındı</option>
                            <option value="Hazırlanıyor">Hazırlanıyor</option>
                            <option value="Kargoya Verildi">Kargoya Verildi</option>
                            {/*<option value="Out for delivery">Out for delivery</option>*/}
                            {/*<option value="Delivered">Delivered</option>*/}
                        </select>
                    </div>
                ))
                }
            </div>
        </div>
    )
}
export default Orders;
