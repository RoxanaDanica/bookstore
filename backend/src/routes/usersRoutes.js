import express from "express";
import { retrieveConnection } from "../persistance/db.js";

const router = express.Router();
router.post("/guest", async (req, res) => {
    try {
        const db = retrieveConnection();
        const [result] = await db.execute(
            `
            INSERT INTO users(name, type)
            VALUES (?, 'guest')
            `,
            [
                "Guest"
            ]
        );
        res.json({
            user_id: result.insertId
        });
    } catch(error) {
        console.log(error);
        res.status(500).json({
            error: "Could not create guest"
        });
    }
});

export default router;