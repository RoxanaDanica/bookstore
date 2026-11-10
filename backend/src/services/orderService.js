
import { retrieveConnection } from "../persistance/db.js";
import {
    createOrderFromCart,
    getOrdersByUser
} from "../persistance/order.js";

export const placeOrder = async (userId) => {
    const conn = await retrieveConnection().getConnection();
    let transactionStarted = false;

    try {
        await conn.beginTransaction();
        transactionStarted = true;

        const order = await createOrderFromCart(userId, conn);

        await conn.commit();
        transactionStarted = false;

        return order;
    } catch (err) {
        if (transactionStarted) {
            try {
                await conn.rollback();
            } catch (rollbackError) {
                console.error(
                    "Order rollback failed:",
                    rollbackError
                );
            }
        }

        throw err;
    } finally {
        conn.release();
    }
};

export const getUserOrders = async (userId) => {
    return await getOrdersByUser(userId);
};
