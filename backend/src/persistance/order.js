
import { retrieveConnection } from "./db.js";
import { v4 as uuidv4 } from "uuid";

const getDb = (conn) => conn ?? retrieveConnection();

export const createOrderFromCart = async (userId, conn) => {
    const db = getDb(conn);

    const [cartRows] = await db.execute(
        `
        SELECT *
        FROM carts
        WHERE user_id = ?
          AND status = 'active'
          AND expires_at > NOW()
        FOR UPDATE
        `,
        [userId]
    );

    const cart = cartRows[0];

    if (!cart) {
        throw new Error("You do not have an active cart.");
    }

    const [items] = await db.execute(
        `
        SELECT
            ci.book_id,
            ci.quantity,
            b.price
        FROM cart_items ci
        INNER JOIN books b
            ON ci.book_id = b.id
        WHERE ci.cart_id = ?
        `,
        [cart.id]
    );

    if (items.length === 0) {
        throw new Error("Your cart is empty.");
    }

    const total = items.reduce(
        (sum, item) =>
            sum + Number(item.price) * Number(item.quantity),
        0
    );

    const orderId = uuidv4();

    await db.execute(
        `
        INSERT INTO orders (
            id,
            user_id,
            total,
            status,
            created_at
        )
        VALUES (?, ?, ?, 'pending', NOW())
        `,
        [orderId, userId, total]
    );

    for (const item of items) {
        await decreaseBookStock(
            item.book_id,
            item.quantity,
            conn
        );

        await db.execute(
            `
            INSERT INTO order_items (
                id,
                order_id,
                book_id,
                quantity,
                unit_price
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                uuidv4(),
                orderId,
                item.book_id,
                item.quantity,
                item.price
            ]
        );
    }

    await db.execute(
        `
        DELETE FROM cart_items
        WHERE cart_id = ?
        `,
        [cart.id]
    );

    await db.execute(
        `
        UPDATE carts
        SET status = 'completed'
        WHERE id = ?
        `,
        [cart.id]
    );

    return { orderId };
};

export const decreaseBookStock = async (
    bookId,
    quantity,
    conn
) => {
    const db = getDb(conn);

    const [result] = await db.execute(
        `
        UPDATE books
        SET stock = stock - ?
        WHERE id = ?
          AND stock >= ?
        `,
        [quantity, bookId, quantity]
    );

    if (result.affectedRows !== 1) {
        throw new Error(
            "Not enough stock available for this book."
        );
    }
};

export const getOrdersByUser = async (userId) => {
    const db = retrieveConnection();

    const [orders] = await db.execute(
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
        const [items] = await db.execute(
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
