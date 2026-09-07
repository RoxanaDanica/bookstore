import { useState } from "react";
import {
  Drawer,
  Box,
  Button,
  TextField,
  Typography
} from "@mui/material";

import { login, register } from "../api/auth";

export default function AuthSidePanel({ open, onClose, onSuccess }) {
  const [mode, setMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleLogin = async () => {
    const res = await login({ email, password });

    localStorage.setItem("token", res.token);
    localStorage.removeItem("guestCheckoutConfirmed");

    onSuccess(res.user);
    onClose();
  };

  const handleRegister = async () => {
    const res = await register({ name, email, password });

    localStorage.setItem("token", res.token);
    localStorage.removeItem("guestCheckoutConfirmed");

    onSuccess(res.user);
    onClose();
  };

  const handleGuest = () => {
    localStorage.setItem("guestCheckoutConfirmed", "true");

    onSuccess();
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 380, p: 3 }}>
        <Typography variant="h5" mb={2}>
          Welcome
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Button onClick={() => setMode("login")}>
            Login
          </Button>

          <Button onClick={() => setMode("register")}>
            Register
          </Button>
        </Box>

        {mode === "register" && (
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
        )}

        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />

        {mode === "login" ? (
          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
          >
            Login
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            onClick={handleRegister}
          >
            Create Account
          </Button>
        )}

        <Button
          fullWidth
          sx={{ mt: 2 }}
          color="secondary"
          onClick={handleGuest}
        >
          Continue as Guest
        </Button>
      </Box>
    </Drawer>
  );
}