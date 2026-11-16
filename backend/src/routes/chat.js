
import express from "express";
import { chat, getConversation, startConversation } from "../services/chatService.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/health", async (req, res) => {
  const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";

  try {
    const response = await fetch(`${aiServiceUrl}/health`, {
      signal: AbortSignal.timeout(90000)
    });

    if (!response.ok) {
      return res.status(503).json({
        status: "unavailable"
      });
    }

    return res.json({
      status: "ok"
    });

  } catch (error) {
    console.error("Ivy health check failed:", error.message);

    return res.status(503).json({
      status: "unavailable"
    });
  }
});

router.post("/start", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await startConversation(userId);

    res.json(result);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Could not start conversation"
    });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversation_id, message } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    const result = await chat(
      userId,
      conversation_id,
      message,
      token
    );

    res.json(result);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "AI service error"
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await getConversation(userId);

    res.json(result);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "AI service error"
    });
  }
});

export default router;
