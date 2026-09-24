import { retrieveConnection } from "../persistance/db.js";
import { createOrderFromCart } from "../persistance/order.js"
import { getOrdersByUser } from "../persistance/order.js"

export const placeOrder = async (userId) => {
    await retrieveConnection().beginTransaction();
    try {
        const order = await createOrderFromCart(userId);
        await retrieveConnection().commit();
        return order;
    } catch (err) {
        await retrieveConnection().rollback();
        throw err;
    }
};

export const getUserOrders = async (userId) => {
    return await getOrdersByUser(userId);
};