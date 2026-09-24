import express from "express";
import bcrypt from "bcrypt";

import { generateToken } from "../services/authService.js";
import { getUserByEmail, createUser,insertGuestUser } from "../persistance/auth.js";
import { authMiddleware,optionalAuthMiddleware } from "../middleware/authMiddleware.js";
import { transferGuestCart, mergeGuestCart } from "../services/cartService.js";

const authRouter = express.Router();

authRouter.post( "/register", authMiddleware, async (req, res) => {
  try {
    const guestId = req.user.id;
    const { name, email,password } = req.body;
    const existing = await getUserByEmail(email);

    if (existing) {
      return res.status(400).json({
        error: "User already exists"
      });
    }

    const hashed = await bcrypt.hash( password, 10);
    const user = await createUser({name, email,password_hash: hashed });

    if (req.user.type === "guest") {
      await transferGuestCart(
        guestId,
        user.id
      );
    }

    const token = generateToken(user);
    res.status(201).json({user, token});
  } catch (err) {
    console.error(
      "Register error:",
      err
    );

    res.status(500).json({
      error: err.message
    });
  }
});

authRouter.post("/login", optionalAuthMiddleware, async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await getUserByEmail(email);

      if (!user) {
        return res.status(400).json({
          error: "User not found"
        });
      }

      const ok = await bcrypt.compare( password, user.password_hash );

      if (!ok) {
        return res.status(400).json({
          error: "Wrong password"
        });
      }

      if ( req.user && req.user.type === "guest") {
        await mergeGuestCart( req.user.id,  user.id);
      }

      const token = generateToken(user);

      res.json({user, token });
    } catch (err) {
      console.error("Login error:", err );

      res.status(500).json({
        error: err.message
      });
    }
  }
);

authRouter.post( "/guest", async (req, res) => {
    try {
      const user = await insertGuestUser();
      const token = generateToken(user);

      res.status(201).json({ user, token });
    } catch (err) {
      console.error( "Guest error:",  err);

      res.status(500).json({
        error: err.message
      });
    }
  }
);

authRouter.get("/me", authMiddleware, (req, res) => {
    res.json(req.user);
  }
);

export default authRouter;