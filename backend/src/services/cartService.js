
import {
    findActiveCart,
    createCart,
    lockBook,
    getReservedQuantity,
    findCartItem,
    upsertCartItem,
    refreshCartExpiration,
    getCart,
    updateCartItemQuantity,
    removeCartItem,
    transferCartToUser,
    getActiveCartItems,
    transferCartOwnership,
    completeCart
} from "../persistance/cart.js";

import { retrieveConnection } from "../persistance/db.js";

const withTransaction = async (callback) => {
    const conn = await retrieveConnection().getConnection();
    let transactionStarted = false;

    try {
        await conn.beginTransaction();
        transactionStarted = true;

        const result = await callback(conn);

        await conn.commit();
        transactionStarted = false;

        return result;
    } catch (err) {
        if (transactionStarted) {
            try {
                await conn.rollback();
            } catch (rollbackError) {
                console.error(
                    "Cart transaction rollback failed:",
                    rollbackError
                );
            }
        }

        throw err;
    } finally {
        conn.release();
    }
};

export const addItemToCart = async (
    userId,
    bookId,
    quantity
) => {
    if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("Quantity must be a positive integer.");
    }

    await withTransaction(async (conn) => {
        let cart = await findActiveCart(userId, conn);

        if (!cart) {
            cart = await createCart(userId, conn);
        }

        const book = await lockBook(bookId, conn);

        if (!book) {
            throw new Error("Book not found");
        }

        const reserved = await getReservedQuantity(
            bookId,
            conn
        );

        const existingItem = await findCartItem(
            cart.id,
            bookId,
            conn
        );

        const currentUserReservation = existingItem
            ? Number(existingItem.quantity)
            : 0;

        const available =
            Number(book.stock) -
            reserved +
            currentUserReservation;

        // Verificăm cantitatea totală dorită.
        const newQuantity =
            currentUserReservation + quantity;

        if (newQuantity > available) {
            throw new Error(
                `Only ${available} book(s) available`
            );
        }

        await upsertCartItem(
            cart.id,
            bookId,
            newQuantity,
            conn
        );

        await refreshCartExpiration(cart.id, conn);
    });

    return await getCartItems(userId);
};

export const getCartItems = async (userId) => {
    const rows = await getCart(userId);

    if (rows.length === 0) {
        return {
            items: [],
            totalItems: 0,
            cartTotal: 0
        };
    }

    const totalItems = rows.reduce(
        (sum, item) => sum + Number(item.quantity),
        0
    );

    const cartTotal = rows.reduce(
        (sum, item) =>
            sum +
            Number(item.quantity) * Number(item.price),
        0
    );

    return {
        id: rows[0].cart_id,
        items: rows.map((row) => ({
            book_id: row.book_id,
            title: row.title,
            thumbnail: row.thumbnail,
            authors: row.authors,
            categories: row.categories,
            quantity: Number(row.quantity),
            price: Number(row.price)
        })),
        totalItems,
        cartTotal
    };
};

export const updateCartItem = async (
    userId,
    bookId,
    quantity
) => {
    if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("Quantity must be a positive integer.");
    }

    await withTransaction(async (conn) => {
        const cart = await findActiveCart(userId, conn);

        if (!cart) {
            throw new Error("Cart not found.");
        }

        const existingItem = await findCartItem(
            cart.id,
            bookId,
            conn
        );

        if (!existingItem) {
            throw new Error("Book is not in the cart.");
        }

        const book = await lockBook(bookId, conn);

        if (!book) {
            throw new Error("Book not found.");
        }

        const reserved = await getReservedQuantity(
            bookId,
            conn
        );

        const available =
            Number(book.stock) -
            reserved +
            Number(existingItem.quantity);

        if (quantity > available) {
            throw new Error(
                `Only ${available} book(s) available`
            );
        }

        await updateCartItemQuantity(
            cart.id,
            bookId,
            quantity,
            conn
        );

        await refreshCartExpiration(cart.id, conn);
    });

    return await getCartItems(userId);
};

export const removeItemFromCart = async (
    userId,
    bookId
) => {
    await withTransaction(async (conn) => {
        const cart = await findActiveCart(userId, conn);

        if (!cart) {
            throw new Error("Cart not found.");
        }

        const existingItem = await findCartItem(
            cart.id,
            bookId,
            conn
        );

        if (!existingItem) {
            throw new Error("Book is not in the cart.");
        }

        await removeCartItem(cart.id, bookId, conn);

        await refreshCartExpiration(cart.id, conn);
    });

    return await getCartItems(userId);
};

export const transferGuestCart = async (
    guestUserId,
    userId
) => {
    await transferCartToUser(guestUserId, userId);
};

export const mergeGuestCart = async (
    guestUserId,
    userId
) => {
    if (!guestUserId || guestUserId === userId) {
        return;
    }

    await withTransaction(async (conn) => {
        const guestCart = await findActiveCart(
            guestUserId,
            conn
        );

        if (!guestCart) {
            return;
        }

        const userCart = await findActiveCart(
            userId,
            conn
        );

        if (!userCart) {
            await transferCartOwnership(
                guestCart.id,
                userId,
                conn
            );

            return;
        }

        const guestItems = await getActiveCartItems(
            guestUserId,
            conn
        );

        for (const guestItem of guestItems) {
            const book = await lockBook(
                guestItem.book_id,
                conn
            );

            if (!book) {
                continue;
            }

            const userItem = await findCartItem(
                userCart.id,
                guestItem.book_id,
                conn
            );

            const userQuantity = userItem
                ? Number(userItem.quantity)
                : 0;

            const guestQuantity = Number(
                guestItem.quantity
            );

            const reserved = await getReservedQuantity(
                guestItem.book_id,
                conn
            );

            const currentReservations =
                userQuantity + guestQuantity;

            const availableForBothCarts =
                Number(book.stock) -
                reserved +
                currentReservations;

            const desiredQuantity =
                userQuantity + guestQuantity;

            const finalQuantity = Math.max(
                0,
                Math.min(
                    desiredQuantity,
                    availableForBothCarts
                )
            );

            if (finalQuantity > 0) {
                await upsertCartItem(
                    userCart.id,
                    guestItem.book_id,
                    finalQuantity,
                    conn
                );
            }

            await removeCartItem(
                guestCart.id,
                guestItem.book_id,
                conn
            );
        }

        await refreshCartExpiration(
            userCart.id,
            conn
        );

        await completeCart(guestCart.id, conn);
    });
};
