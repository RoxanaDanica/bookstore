import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";

import { useCart } from "../context/CartContext";

function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cart } = useCart();

  const search = searchParams.get("search") || "";

  const [isScrolled, setIsScrolled] = useState(false);

  const totalItems = cart?.totalItems || 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;

    if (!value.trim()) {
      navigate("/");
      return;
    }

    navigate(`/?search=${encodeURIComponent(value)}`);
  };

  return (
    <header
      className={`
        sticky top-0 z-[100] w-full transition-all duration-300
        ${
          isScrolled
            ? "bg-white/95 shadow-sm backdrop-blur-md"
            : "bg-[#f8f6f2]"
        }
      `}
    >
      <div className="mx-auto flex h-[88px] max-w-[1400px] items-center justify-between px-6">
        <Link
        to="/"
        className="group flex items-center gap-3.5 text-[#171717] no-underline"
        >
        <div
            className="
            flex h-11 w-11 items-center justify-center
            rounded-full bg-[#b5202d] text-white
            transition-transform duration-300
            group-hover:rotate-[-4deg]
            "
        >
            <MenuBookRoundedIcon sx={{ fontSize: 23 }} />
        </div>

        <div className="flex flex-col">
            <span
            className="
                font-['Playfair'] text-[23px] font-bold
                leading-none tracking-[0.04em] text-[#171717]
            "
            >
            IVORY <span className="text-[#b5202d]">&</span> INK
            </span>

            <span
            className="
                mt-[6px] text-[9px] font-medium uppercase
                tracking-[0.22em] text-[#8b8680]
            "
            >
            Books for curious minds.
            </span>
        </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            to="/"
            className="text-sm font-medium text-[#171717] transition hover:text-[#b5202d]"
          >
            Home
          </Link>

          <Link
            to="/?genre=Romance"
            className="text-sm font-medium text-[#171717] transition hover:text-[#b5202d]"
          >
            Romance
          </Link>

          <Link
            to="/?genre=Thriller"
            className="text-sm font-medium text-[#171717] transition hover:text-[#b5202d]"
          >
            Thriller
          </Link>

          <Link
            to="/?genre=SciFi"
            className="text-sm font-medium text-[#171717] transition hover:text-[#b5202d]"
          >
            Sci-Fi
          </Link>

          <Link
            to="/?genre=Fantasy"
            className="text-sm font-medium text-[#171717] transition hover:text-[#b5202d]"
          >
            Fantasy
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden h-[44px] w-[270px] items-center rounded-full border border-[#dedad3] bg-white px-4 md:flex">
            <SearchIcon
              sx={{
                fontSize: 20,
                color: "#8a8580",
              }}
            />

            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by title, author..."
              className="ml-3 w-full bg-transparent text-sm text-[#171717] outline-none placeholder:text-[#aaa59f]"
            />
          </div>

          <Link
            to="/cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-[#171717] transition hover:bg-[#eee9e2] hover:text-[#b5202d]"
          >
            <ShoppingBagOutlinedIcon sx={{ fontSize: 23 }} />

            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#b5202d] px-1 text-[11px] font-semibold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          <Link
            to="/administrator"
            className="flex h-11 w-11 items-center justify-center rounded-full text-[#171717] transition hover:bg-[#eee9e2] hover:text-[#b5202d]"
          >
            <PersonOutlineIcon sx={{ fontSize: 24 }} />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;