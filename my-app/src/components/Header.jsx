import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";

import { useCart } from "../contexts/CartContext";

function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cart } = useCart();

  const search = searchParams.get("q") || "";

  const [searchValue, setSearchValue] = useState(search);
  const [isScrolled, setIsScrolled] = useState(false);

  const totalItems = cart?.totalItems || 0;

  const categories = [
    "Fiction",
    "Adventure stories",
    "American fiction",
    "Christian life",
    "Detective and mystery stories",
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();

    const value = searchValue.trim();

    if (!value) {
      navigate("/");
      return;
    }

    navigate(
      `/books/search?q=${encodeURIComponent(value)}`
    );
  };

  return (
    <header
      className={`
        sticky top-0 z-[100] w-full
        transition-all duration-300
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
            <MenuBookRoundedIcon
              sx={{ fontSize: 23 }}
            />
          </div>

          <div className="flex flex-col">
            <span
              className="
                font-['Playfair'] text-[23px] font-bold
                leading-none tracking-[0.04em]
                text-[#171717]
              "
            >
              IVORY{" "}
              <span className="text-[#b5202d]">
                &
              </span>{" "}
              INK
            </span>

            <span
              className="
                mt-[6px] text-[9px] font-medium
                uppercase tracking-[0.22em]
                text-[#8b8680]
              "
            >
              Books for curious minds.
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/books/category/${encodeURIComponent(
                category
              )}`}
              className="
                text-sm font-medium text-[#171717]
                transition hover:text-[#b5202d]
              "
            >
              {category}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <form
            onSubmit={handleSearch}
            className="
              hidden h-[44px] w-[270px] items-center
              rounded-full border border-[#dedad3]
              bg-white px-4 md:flex
              transition
              focus-within:border-[#b5202d]
            "
          >
            <SearchIcon
              sx={{
                fontSize: 20,
                color: "#8a8580",
              }}
            />

            <input
              type="text"
              value={searchValue}
              onChange={(e) =>
                setSearchValue(e.target.value)
              }
              placeholder="Search by title, author, ISBN..."
              className="
                ml-3 w-full bg-transparent
                text-sm text-[#171717]
                outline-none
                placeholder:text-[#aaa59f]
              "
            />
          </form>

          <Link
            to="/cart"
            className="
              relative flex h-11 w-11
              items-center justify-center
              rounded-full text-[#171717]
              transition
              hover:bg-[#eee9e2]
              hover:text-[#b5202d]
            "
            aria-label="View cart"
          >
            <ShoppingBagOutlinedIcon
              sx={{ fontSize: 23 }}
            />

            {totalItems > 0 && (
              <span
                className="
                  absolute -right-1 -top-1
                  flex h-[20px] min-w-[20px]
                  items-center justify-center
                  rounded-full bg-[#b5202d]
                  px-1 text-[11px]
                  font-semibold text-white
                "
              >
                {totalItems}
              </span>
            )}
          </Link>

          <Link
            to="/administrator"
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-full text-[#171717]
              transition
              hover:bg-[#eee9e2]
              hover:text-[#b5202d]
            "
          >
            <PersonOutlineIcon
              sx={{ fontSize: 24 }}
            />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;