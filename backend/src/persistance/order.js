import { retrieveConnection } from "./db.js";
import { v4 as uuidv4 } from "uuid";

export const createOrderFromCart = async (userId) => {
    const [cartRows] = await retrieveConnection().execute(
        `SELECT * FROM carts WHERE user_id=? AND status='active'`,
        [userId]
    );

    const cart = cartRows[0];

    if (!cart) {
        throw new Error("You do not have an active cart.");
    }

    const [items] = await retrieveConnection().execute(
        `SELECT * FROM cart_items WHERE cart_id=?`,
        [cart.id]
    );

    if (items.length === 0) {
        throw new Error("Your cart is empty.");
    }

    const orderId = uuidv4();

    await retrieveConnection().execute(
        `INSERT INTO orders (id, user_id, status, created_at)
         VALUES (?, ?, 'pending', NOW())`,
        [orderId, userId]
    );

    for (const item of items) {
        await retrieveConnection().execute(
            `INSERT INTO order_items (id, order_id, book_id, quantity)
             VALUES (?, ?, ?, ?)`,
            [uuidv4(), orderId, item.book_id, item.quantity]
        );

        await decreaseBookStock(item.book_id, item.quantity);
    }

    await retrieveConnection().execute(
        `DELETE FROM cart_items WHERE cart_id=?`,
        [cart.id]
    );

    await retrieveConnection().execute(
        `UPDATE carts SET status='completed' WHERE id=?`,
        [cart.id]
    );

    return { orderId };
};

export const decreaseBookStock = async (bookId, quantity) => {
    await retrieveConnection().execute(
        `
        UPDATE books
        SET stock = stock - ?
        WHERE id = ?
        `,
        [quantity, bookId]
    );
};