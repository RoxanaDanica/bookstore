import express from "express";
import { chat, getConversation, startConversation } from "../services/chatService.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

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

    console.log("POST USER:", userId);

    const result = await chat(
      userId,
      conversation_id,
      message
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

    console.log("GET USER:", userId);

    const result = await getConversation(userId);
    console.log(userId, "GET CONVERSATION RESULT:", result);

    res.json(result);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "AI service error"
    });
  }
});

export default router;