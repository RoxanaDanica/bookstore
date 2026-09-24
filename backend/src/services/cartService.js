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

export const addItemToCart = async (userId, bookId, quantity) => {
    await retrieveConnection().beginTransaction();

    try {
        let cart = await findActiveCart(userId);
        if (!cart) {
            cart = await createCart(userId);
        }

        const book = await lockBook(bookId);

        if (!book) {
            throw new Error("Book not found");
        }

        const reserved = await getReservedQuantity(bookId);
        const existingItem = await findCartItem(cart.id, bookId);
        const currentUserReservation = existingItem ? existingItem.quantity : 0;
        const available = book.stock - reserved + currentUserReservation;

        if (available < quantity) {
            throw new Error(
                `Only ${available} book(s) available`
            );
        }

        const newQuantity = currentUserReservation + quantity;
        await upsertCartItem(cart.id, bookId, newQuantity);
        await refreshCartExpiration(cart.id);
        await retrieveConnection().commit();
        const cartResult = await getCartItems(userId);

        return cartResult;
    } catch (err) {
        await retrieveConnection().rollback();
        throw err;
    }
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
    const totalItems = rows.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = rows.reduce((sum, item) => sum + item.quantity * Number(item.price), 0);

    return {
        id: rows[0].cart_id,
        items: rows.map(row => ({
            book_id: row.book_id,
            title: row.title,
            thumbnail: row.thumbnail,
            authors: row.authors,
            categories: row.categories,
            quantity: row.quantity,
            price: Number(row.price)

        })),
        totalItems,
        cartTotal
    };
};

export const updateCartItem = async (userId, bookId, quantity) => {
    await retrieveConnection().beginTransaction();

    try {
        const cart = await findActiveCart(userId);

        if (!cart) {
            throw new Error("Cart not found.");
        }

        const existingItem = await findCartItem(cart.id, bookId);

        if (!existingItem) {
            throw new Error("Book is not in the cart.");
        }

        const book = await lockBook(bookId);

        if (!book) {
            throw new Error("Book not found.");
        }

        const reserved = await getReservedQuantity(bookId);
        const available = book.stock - reserved + existingItem.quantity;

        if (quantity > available) {
            throw new Error(
                `Only ${available} book(s) available`
            );
        }

        await updateCartItemQuantity( cart.id, bookId, quantity);
        await refreshCartExpiration(cart.id);
        await retrieveConnection().commit();
        return await getCartItems(userId);

    } catch (err) {
        await retrieveConnection().rollback();
        throw err;
    }
};
export const removeItemFromCart = async (userId, bookId) => {
    await retrieveConnection().beginTransaction();

    try {
        const cart = await findActiveCart(userId);

        if (!cart) {
            throw new Error("Cart not found.");
        }

        const existingItem = await findCartItem(cart.id,  bookId);
        if (!existingItem) {
            throw new Error("Book is not in the cart.");
        }

        await removeCartItem(cart.id, bookId);
        await refreshCartExpiration(cart.id);
        await retrieveConnection().commit();
        return await getCartItems(userId);

    } catch (err) {
        await retrieveConnection().rollback();
        throw err;
    }
};

export const transferGuestCart = async (guestUserId, userId ) => {
    await transferCartToUser(guestUserId, userId);
};

export const mergeGuestCart = async (guestUserId, userId) => {
    if (!guestUserId || guestUserId === userId) {
        return;
    }

    await retrieveConnection().beginTransaction();

    try {
        const guestCart =await findActiveCart(guestUserId);

        if (!guestCart) {
            await retrieveConnection().commit();
            return;
        }

        let userCart = await findActiveCart(userId);

        if (!userCart) {
            await transferCartOwnership(guestCart.id, userId );
            await retrieveConnection().commit();
            return;
        }

        const guestItems = await getActiveCartItems(guestUserId);

        for (const guestItem of guestItems) {
            const book = await lockBook(guestItem.book_id);

            if (!book) {
                continue;
            }

            const userItem = await findCartItem(userCart.id,guestItem.book_id);
            const userQuantity = userItem?.quantity || 0;
            const reserved = await getReservedQuantity( guestItem.book_id );
            const currentReservations = userQuantity + guestItem.quantity;
            const availableForBothCarts = book.stock -  reserved +  currentReservations;

            const desiredQuantity = userQuantity +  guestItem.quantity;
            const finalQuantity = Math.min(desiredQuantity, availableForBothCarts );

            if (finalQuantity > 0) {
                await upsertCartItem( userCart.id, guestItem.book_id, finalQuantity);
            }

            await removeCartItem(guestCart.id, guestItem.book_id);
        }

        await refreshCartExpiration(userCart.id );
        await completeCart(guestCart.id);
        await retrieveConnection().commit();
    } catch (err) {
        await retrieveConnection().rollback();
        throw err;
    }
};