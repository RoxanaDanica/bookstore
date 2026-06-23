import express from "express";
import { chat } from "../services/chatService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { user_id, conversation_id, message } = req.body;

    const result = await chat(
      user_id,
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

export default router;