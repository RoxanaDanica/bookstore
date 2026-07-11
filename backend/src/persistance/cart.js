import { retrieveConnection } from "./db.js";
import { v4 as uuidv4 } from "uuid";

export const findActiveCart = async (userId) => {
    const [rows] = await retrieveConnection().execute(
        `
        SELECT *
        FROM carts
        WHERE user_id = ?
        AND status = 'active'
        AND expires_at > NOW()
        LIMIT 1
        `,
        [userId]
    );
    return rows[0];
};

export const createCart = async (userId) => {
    const id = uuidv4();
    await retrieveConnection().execute(
        `
        INSERT INTO carts (
            id,
            user_id,
            status,
            expires_at
        )
        VALUES (
            ?,
            ?,
            'active',
            DATE_ADD(NOW(), INTERVAL 30 MINUTE)
        )
        `,
        [
            id,
            userId
        ]
    );
    return {
        id,
        user_id: userId
    };
};

export const lockBook = async (bookId) => {
    const [rows] = await retrieveConnection().execute(
        `
        SELECT
            id,
            stock
        FROM books
        WHERE id = ?
        FOR UPDATE
        `,
        [bookId]
    );
    return rows[0];
};

export const getReservedQuantity = async (bookId) => {
    const [rows] = await retrieveConnection().execute(
        `
        SELECT
            COALESCE(SUM(ci.quantity), 0) AS reserved
        FROM cart_items ci
        INNER JOIN carts c
            ON c.id = ci.cart_id
        WHERE
            ci.book_id = ?
            AND c.status = 'active'
            AND c.expires_at > NOW()
        `,
        [bookId]
    );
    return rows[0].reserved;
};

export const findCartItem = async (cartId, bookId) => {
    const [rows] = await retrieveConnection().execute(
        `
        SELECT *
        FROM cart_items
        WHERE cart_id = ?
        AND book_id = ?
        `,
        [
            cartId,
            bookId
        ]
    );
    return rows[0];
};

export const upsertCartItem = async (
    cartId,
    bookId,
    quantity
) => {
    const existing = await findCartItem(
        cartId,
        bookId
    );
    if (existing) {

        await retrieveConnection().execute(
            `
            UPDATE cart_items
            SET quantity = ?
            WHERE cart_id = ?
            AND book_id = ?
            `,
            [
                quantity,
                cartId,
                bookId
            ]
        );
    } else {

        await retrieveConnection().execute(
            `
            INSERT INTO cart_items(
                id,
                cart_id,
                book_id,
                quantity
            )
            VALUES(
                ?,
                ?,
                ?,
                ?
            )
            `,
            [
                uuidv4(),
                cartId,
                bookId,
                quantity
            ]
        );
    }
};

export const refreshCartExpiration = async (cartId) => {
    await retrieveConnection().execute(
        `
        UPDATE carts
        SET expires_at =
            DATE_ADD(
                NOW(),
                INTERVAL 30 MINUTE
            )
        WHERE id = ?
        `,
        [cartId]
    );
};

export const getCart = async (userId) => {
    const [rows] = await retrieveConnection().execute(
        `
        SELECT
            c.id AS cart_id,

            ci.book_id,
            ci.quantity,

            b.title,
            b.thumbnail,
            b.authors,
            b.categories,
            b.price

        FROM carts c

        INNER JOIN cart_items ci
            ON ci.cart_id = c.id

        INNER JOIN books b
            ON b.id = ci.book_id

        WHERE
            c.user_id = ?
            AND c.status = 'active'
            AND c.expires_at > NOW()
        `,
        [userId]
    );
    return rows;
};

export const updateCartItemQuantity = async (cartId, bookId, quantity) => {
    await retrieveConnection().execute(
        `
        UPDATE cart_items
        SET quantity = ?
        WHERE cart_id = ?
        AND book_id = ?
        `,
        [quantity, cartId, bookId]
    );
};

export const removeCartItem = async (cartId, bookId) => {
    await retrieveConnection().execute(
        `
        DELETE FROM cart_items
        WHERE cart_id = ?
        AND book_id = ?
        `,
        [cartId, bookId]
    );
};