import { Link } from "react-router-dom";

import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function Footer() {
  return (
    <footer className="bg-[#171717] text-white">
      <div className="mx-auto max-w-[1400px] px-6 py-20">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-white no-underline"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#b5202d]">
                <MenuBookRoundedIcon sx={{ fontSize: 24 }} />
              </div>

              <div className="flex flex-col">
                <span className="font-['Playfair'] text-[24px] font-bold leading-none tracking-[0.04em]">
                  IVORY <span className="text-[#d94a55]">&</span> INK
                </span>

                <span className="mt-[6px] text-[9px] font-medium uppercase tracking-[0.22em] text-white/40">
                  Books for curious minds.
                </span>
              </div>
            </Link>

            <p className="mt-6 max-w-[360px] text-[15px] leading-7 text-white/55">
              Thoughtfully selected books, unforgettable stories and
              new ideas for curious readers.
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-[#d94a55]"
            >
              Browse collection
              <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </Link>
          </div>

          <div>
            <h3 className="font-['Playfair'] text-lg font-semibold">
              Explore
            </h3>

            <ul className="mt-6 space-y-4 text-sm text-white/55">
              <li>
                <Link
                  to="/"
                  className="transition hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/?genre=Romance"
                  className="transition hover:text-white"
                >
                  Romance
                </Link>
              </li>

              <li>
                <Link
                  to="/?genre=Thriller"
                  className="transition hover:text-white"
                >
                  Thriller
                </Link>
              </li>

              <li>
                <Link
                  to="/?genre=Fantasy"
                  className="transition hover:text-white"
                >
                  Fantasy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-['Playfair'] text-lg font-semibold">
              Customer Care
            </h3>

            <ul className="mt-6 space-y-4 text-sm text-white/55">
              <li className="cursor-pointer transition hover:text-white">
                Contact us
              </li>

              <li className="cursor-pointer transition hover:text-white">
                Shipping information
              </li>

              <li className="cursor-pointer transition hover:text-white">
                Returns
              </li>

              <li className="cursor-pointer transition hover:text-white">
                FAQ
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-['Playfair'] text-lg font-semibold">
              Get in touch
            </h3>

            <div className="mt-6 space-y-5 text-sm text-white/55">
              <div className="flex items-start gap-3">
                <LocationOnOutlinedIcon
                  sx={{
                    fontSize: 20,
                    color: "#d94a55",
                  }}
                />

                <div>
                  <p>123 Library Street</p>
                  <p className="mt-1">
                    New York, NY 10001
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <EmailOutlinedIcon
                  sx={{
                    fontSize: 20,
                    color: "#d94a55",
                  }}
                />

                <p>hello@ivoryandink.com</p>
              </div>

              <div className="flex items-center gap-3">
                <PhoneOutlinedIcon
                  sx={{
                    fontSize: 20,
                    color: "#d94a55",
                  }}
                />

                <p>+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-7 text-sm text-white/35 md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 Ivory & Ink. All rights reserved.
          </p>

          <div className="flex gap-6">
            <button className="transition hover:text-white">
              Privacy Policy
            </button>

            <button className="transition hover:text-white">
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}