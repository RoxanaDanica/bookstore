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
    removeCartItem
} from "../persistance/cart.js";
import { retrieveConnection } from "../persistance/db.js";


export const addItemToCart = async ( userId, bookId, quantity ) => {
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

        await upsertCartItem(cart.id,bookId,newQuantity);
        await refreshCartExpiration(cart.id);
        await retrieveConnection().commit();
        return {
            cartId: cart.id,
            quantity: newQuantity
        };
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
    const totalItems = rows.reduce(
        (sum, item) => sum + item.quantity,
        0
    );
    const cartTotal = rows.reduce(
        (sum, item) => sum + item.quantity * Number(item.price),
        0
    );

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

        await updateCartItemQuantity(cart.id, bookId, quantity);
        await refreshCartExpiration(cart.id);
        await retrieveConnection().commit();
        return await getCart(userId);

    }

    catch(err){
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

        const existingItem = await findCartItem(cart.id, bookId);

        if (!existingItem) {
            throw new Error("Book is not in the cart.");
        }

        await removeCartItem(cart.id, bookId);
        await refreshCartExpiration(cart.id);
        await retrieveConnection().commit();

        return {
            message: "Item removed from cart"
        };

    } catch (err) {
        await retrieveConnection().rollback();
        throw err;
    }
};

