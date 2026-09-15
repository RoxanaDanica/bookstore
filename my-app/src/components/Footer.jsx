import { Link } from "react-router-dom";

import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

export default function Footer() {
  return (
    <footer className="bg-[#171717] text-white">
      <div className="mx-auto max-w-[1400px] px-6">
        <div
          className="
            grid gap-14
            border-b border-white/[0.09]
            py-16
            lg:grid-cols-[1.5fr_0.65fr_0.65fr]
            lg:gap-20
          "
        >
          <div>
            <Link
              to="/"
              className="
                inline-block
                font-['Playfair']
                text-[26px] font-bold
                tracking-[0.02em]
                text-white
              "
            >
              IVORY
              <span className="mx-2 text-[#d94a55]">&</span>
              INK
            </Link>

            <p
              className="
                mt-6 max-w-[440px]
                text-[15px] leading-7
                text-white/45
              "
            >
              A thoughtful collection of stories, ideas and
              perspectives for people who never stop being curious.
            </p>

            <Link
              to="/categories"
              className="
                group mt-8
                inline-flex items-center gap-2
                text-[13px] font-semibold
                text-white
                transition-colors duration-300
                hover:text-[#d94a55]
              "
            >
              Browse the collection

              <ArrowOutwardRoundedIcon
                sx={{ fontSize: 17 }}
                className="
                  transition-transform duration-300
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />
            </Link>
          </div>
          <div>
            <p
              className="
                text-[10px] font-semibold
                uppercase tracking-[0.2em]
                text-white/30
              "
            >
              Discover
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <Link
                to="/"
                className="
                  w-fit text-[14px]
                  text-white/65
                  transition-colors duration-300
                  hover:text-[#d94a55]
                "
              >
                Home
              </Link>

              <Link
                to="/categories"
                className="
                  w-fit text-[14px]
                  text-white/65
                  transition-colors duration-300
                  hover:text-[#d94a55]
                "
              >
                Categories
              </Link>

              <Link
                to="/books/featured"
                className="
                  w-fit text-[14px]
                  text-white/65
                  transition-colors duration-300
                  hover:text-[#d94a55]
                "
              >
                Featured
              </Link>
            </div>
          </div>

          <div>
            <p
              className="
                text-[10px] font-semibold
                uppercase tracking-[0.2em]
                text-white/30
              "
            >
              Support
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <button
                type="button"
                className="
                  w-fit text-[14px]
                  text-white/65
                  transition-colors duration-300
                  hover:text-[#d94a55]
                  hover:cursor-pointer
                "
              >
                Contact
              </button>

              <button
                type="button"
                className="
                  w-fit text-[14px]
                  text-white/65
                  transition-colors duration-300
                  hover:text-[#d94a55]
                  hover:cursor-pointer
                "
              >
                Shipping & returns
              </button>

              <button
                type="button"
                className="
                  w-fit text-[14px]
                  text-white/65
                  transition-colors duration-300
                  hover:text-[#d94a55]
                  hover:cursor-pointer
                "
              >
                FAQ
              </button>
            </div>
          </div>
        </div>

        <div
          className="
            flex flex-col gap-5
            border-b border-white/[0.09]
            py-7
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <p className="text-[13px] text-white/40">
            Have a question or looking for a recommendation?
          </p>

          <a
            href="mailto:hello@ivoryandink.com"
            className="
              group flex w-fit items-center gap-3
              text-[13px] font-semibold
              text-white/75
              transition-colors duration-300
              hover:text-white
            "
          >
            <EmailOutlinedIcon
              sx={{
                fontSize: 17,
                color: "#d94a55",
              }}
            />

            hello@ivoryandink.com

            <ArrowOutwardRoundedIcon
              sx={{ fontSize: 15 }}
              className="
                transition-transform duration-300
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5
              "
            />
          </a>
        </div>
        
        <div
          className="
            flex flex-col gap-4
            py-6
            text-[11px]
            text-white/25
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <p>© 2026 Ivory & Ink</p>

          <div className="flex items-center gap-6">
            <button
              type="button"
              className="
                transition-colors duration-300
                hover:text-white/65
                hover:cursor-pointer
              "
            >
              Privacy
            </button>

            <button
              type="button"
              className="
                transition-colors duration-300
                hover:text-white/65
                hover:cursor-pointer
              "
            >
              Terms
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}