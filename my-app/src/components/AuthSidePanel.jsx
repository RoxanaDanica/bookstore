import { useState } from "react";
import { Drawer } from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

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
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "#f8f6f2",
        },
      }}
    >
      <div className="flex min-h-full w-screen max-w-[430px] flex-col bg-[#f8f6f2] px-7 py-8 sm:px-9">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b5202d]">
              Ivory & Ink
            </p>

            <h2 className="mt-2 font-['Playfair'] text-[30px] font-semibold leading-tight text-[#171717]">
              Welcome
            </h2>

            <p className="mt-3 max-w-[300px] text-sm leading-6 text-[#817b75]">
              Sign in to continue, create an account, or checkout as a guest.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-full bg-[#eee9e2]
              text-[#77716b] transition
              hover:bg-[#e4ded6]
              hover:text-[#171717]
            "
          >
            <CloseRoundedIcon sx={{ fontSize: 21 }} />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 rounded-xl bg-[#ebe6df] p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`
              rounded-lg px-4 py-2.5 text-sm font-semibold transition hover:cursor-pointer
              ${
                mode === "login"
                  ? "bg-white text-[#171717] shadow-sm"
                  : "text-[#8b8580] hover:text-[#171717]"
              }
            `}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => setMode("register")}
            className={`
              rounded-lg px-4 py-2.5 text-sm font-semibold transition hover:cursor-pointer
              ${
                mode === "register"
                  ? "bg-white text-[#171717] shadow-sm"
                  : "text-[#8b8580] hover:text-[#171717]"
              }
            `}
          >
            Register
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {mode === "register" && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#171717]">
                Name
              </label>

              <div
                className="
                  flex items-center rounded-xl
                  border border-[#ddd7d0]
                  bg-[#faf9f7] px-4
                  transition
                  focus-within:border-[#b5202d]
                  focus-within:bg-white
                "
              >
                <PersonOutlineRoundedIcon
                  sx={{
                    fontSize: 20,
                    color: "#9b958f",
                  }}
                />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="
                    w-full bg-transparent px-3 py-3.5
                    text-sm text-[#171717]
                    outline-none
                    placeholder:text-[#aaa49d]
                  "
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#171717]">
              Email
            </label>

            <div
              className="
                flex items-center rounded-xl
                border border-[#ddd7d0]
                bg-[#faf9f7] px-4
                transition
                focus-within:border-[#b5202d]
                focus-within:bg-white
              "
            >
              <MailOutlineRoundedIcon
                sx={{
                  fontSize: 20,
                  color: "#9b958f",
                }}
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="
                  w-full bg-transparent px-3 py-3.5
                  text-sm text-[#171717]
                  outline-none
                  placeholder:text-[#aaa49d]
                "
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#171717]">
              Password
            </label>

            <div
              className="
                flex items-center rounded-xl
                border border-[#ddd7d0]
                bg-[#faf9f7] px-4
                transition
                focus-within:border-[#b5202d]
                focus-within:bg-white
              "
            >
              <LockOutlinedIcon
                sx={{
                  fontSize: 19,
                  color: "#9b958f",
                }}
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="
                  w-full bg-transparent px-3 py-3.5
                  text-sm text-[#171717]
                  outline-none
                  placeholder:text-[#aaa49d]
                "
              />
            </div>
          </div>

          <button
            type="button"
            onClick={
              mode === "login"
                ? handleLogin
                : handleRegister
            }
            className="
              mt-2 w-full rounded-xl
              bg-[#171717] px-5 py-3.5
              text-sm font-semibold text-white
              transition
              hover:bg-[#b5202d]
              hover:cursor-pointer
            "
          >
            {mode === "login"
              ? "Login"
              : "Create account"}
          </button>
        </div>

        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#ddd7d0]" />

          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#aaa49d]">
            or
          </span>

          <div className="h-px flex-1 bg-[#ddd7d0]" />
        </div>

        <button
          type="button"
          onClick={handleGuest}
          className="
            w-full rounded-xl border border-[#d8d2cb]
            bg-transparent px-5 py-3.5
            text-sm font-semibold text-[#171717]
            transition
            hover:border-[#171717]
            hover:bg-white
            hover:cursor-pointer
          "
        >
          Continue as Guest
        </button>

        <div className="mt-auto pt-10">
          <div className="rounded-2xl bg-[#efeae3] p-5">
            <p className="font-['Playfair'] text-[17px] font-semibold text-[#171717]">
              Books for curious minds.
            </p>

            <p className="mt-2 text-xs leading-6 text-[#817b75]">
              Your cart will stay ready while you choose how you'd like to continue.
            </p>
          </div>
        </div>
      </div>
    </Drawer>
  );
}