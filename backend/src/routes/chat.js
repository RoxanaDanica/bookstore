import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { message } = req.body;

        const response = await fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });
        const data = await response.json();

        res.json({
            reply: data.response
        });

    } catch (err) {
        res.status(500).json({
            error: "AI service error"
        });
    }
});

export default router;