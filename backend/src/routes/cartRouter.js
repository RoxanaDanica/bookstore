import express from "express";
import {
    addItemToCart,
    updateCartItem,
    removeItemFromCart,
    getCartItems
} from "../services/cartService.js";
import { placeOrder } from "../services/orderService.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const cartRouter = express.Router();

cartRouter.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await getCartItems(userId);
        res.json(cart);
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

cartRouter.post("/items", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookId, quantity } = req.body;
        const result = await addItemToCart(userId,bookId,quantity);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

cartRouter.put("/items", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookId, quantity } = req.body;
        const result = await updateCartItem(userId,bookId,quantity);
        res.json(result);
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }

});

cartRouter.delete("/items/:bookId", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const bookId = Number(req.params.bookId);
        await removeItemFromCart(userId,bookId);
        res.json({
            message: "Item removed successfully."
        });
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

cartRouter.post("/checkout", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await placeOrder(userId);
        console.log("Order after placeOrder call:", result);
        res.status(201).json({
            message: "Order placed successfully",
            orderId: result.orderId
        });
    } catch (err) {
        console.error("Checkout error:", err);
        res.status(400).json({
            error: err.message
        });
    }
});

export default cartRouter;