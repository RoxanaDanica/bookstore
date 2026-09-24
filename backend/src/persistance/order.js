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
        `SELECT
            ci.book_id,
            ci.quantity,
            b.price
        FROM cart_items ci
        JOIN books b ON ci.book_id = b.id
        WHERE ci.cart_id = ?
        `, [cart.id]
    );

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    if (items.length === 0) {
        throw new Error("Your cart is empty.");
    }

    const orderId = uuidv4();

    await retrieveConnection().execute(
        `INSERT INTO orders
        (id, user_id, total, status, created_at)
        VALUES (?, ?, ?, 'pending', NOW())
        `,
        [orderId, userId, total]
    );

    for (const item of items) {
        await retrieveConnection().execute(
            `INSERT INTO order_items (id, order_id, book_id, quantity, unit_price)
             VALUES (?, ?, ?, ?, ?)`,
            [uuidv4(), orderId, item.book_id, item.quantity, item.price]
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
        `UPDATE books
        SET stock = stock - ?
        WHERE id = ?`, [quantity, bookId]
    );
};

export const getOrdersByUser = async (userId) => {
    const [orders] = await retrieveConnection().execute(
        `
        SELECT
            id,
            total,
            status,
            created_at
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
        `,
        [userId]
    );

    for (const order of orders) {
        const [items] = await retrieveConnection().execute(
            `
            SELECT
                oi.book_id,
                oi.quantity,
                oi.unit_price,
                b.title,
                b.thumbnail,
                b.authors
            FROM order_items oi
            INNER JOIN books b
                ON b.id = oi.book_id
            WHERE oi.order_id = ?
            `,
            [order.id]
        );

        order.items = items;
    }

    return orders;
};