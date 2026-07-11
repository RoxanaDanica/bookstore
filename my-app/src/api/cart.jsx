import { getAxiosInstance } from "./axios";

export const getCart = () => {
    return getAxiosInstance().get("/cart");
};

export const addCartItem = (bookId, quantity) => {
    return getAxiosInstance().post("/cart/items", {
        bookId,
        quantity
    });
};

export const updateCartItem = (bookId, quantity) => {
    return getAxiosInstance().put("/cart/items", {
        bookId,
        quantity
    });
};

export const removeCartItem = (bookId) => {
    return getAxiosInstance().delete(`/cart/items/${bookId}`);
};

export const checkout = (payload) => {
    return getAxiosInstance().post(
        "/cart/checkout",
        payload
    );
};