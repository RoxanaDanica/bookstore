import { Link, useNavigate, useSearchParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoginIcon from '@mui/icons-material/Login';
import InputAdornment from "@mui/material/InputAdornment";
import { useLocation } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search") || "";
    const location = useLocation();
    const genre = searchParams.get("genre");

    const breadcrumbs = [
        { label: "Home", to: "/" },
        ];

        if (genre) {
            breadcrumbs.push({
                label: genre,
            });
        }

        if (location.pathname === "/cart") {
            breadcrumbs.push({
                label: "Cart",
        });
    }

    return (
    <header>
        <nav className="grid grid-cols-[auto_1fr_auto] gap-[20px]">
            <div className="flex gap-[20px] py-[38px] items-center">
                <Link to="/" className="no-underline hover:no-underline">
                    <div className="flex items-center gap-[8px] pl-[52px]">
                        <svg  viewBox="0 0 40 32" width="40"  fill="#e52334"><path xmlns="http://www.w3.org/2000/svg" class="cls-1" d="M37.65,9.52c-.23-.06-.34-.16-.33-.4,0-.57,0-1.15,0-1.72a2.28,2.28,0,0,1,1.59-2.28.51.51,0,0,0,.21-.1c.16-.21.4-.41.43-.63S39.26,4,39,3.94Q32.68,2.05,26.37.13A3,3,0,0,0,25,0L14.58,1.5C11.06,2,7.54,2.49,4,3A2.8,2.8,0,0,0,1.45,5.3a6.59,6.59,0,0,0,1.12,5.77c-.51.16-1,.31-1.55.48s-.51.5-.19.77a8.19,8.19,0,0,0,.77.45,3.23,3.23,0,0,1,.82.68,4.08,4.08,0,0,1,.52,2.65c0,.86-.08.84-.9,1.13a18.67,18.67,0,0,0-1.74.71c-.11.06-.17.24-.26.36a1.86,1.86,0,0,0,.35.22,6,6,0,0,0,.64.16,9.19,9.19,0,0,0-.77,1.58,7,7,0,0,0,.4,4.82A2.68,2.68,0,0,0,2.3,26.61l14.17,4.58a1.51,1.51,0,0,0,.79,0l15.12-3.65,6.17-1.5a2,2,0,0,0,.42-.24,2.12,2.12,0,0,0-.33-.39,2.59,2.59,0,0,0-.6-.3c-.54-.2-1.09-.36-1.62-.57-.12,0-.28-.18-.28-.28a14,14,0,0,1,0-2.15,2.11,2.11,0,0,1,1.55-2,1.24,1.24,0,0,0,.46-.29.45.45,0,0,0-.18-.81l-.7-.23a4.72,4.72,0,0,0,1.65-3.59,5,5,0,0,0-.83-3.82l2.11-.59v-.24c-.41-.21-.81-.46-1.24-.64A12.23,12.23,0,0,0,37.65,9.52ZM19,9.38l18-3.7a7.57,7.57,0,0,0-.4,4.09L18.89,14.18C18.94,12.55,19,11,19,9.38ZM2.75,5.47a1,1,0,0,1,1.48-.71Q11.06,7,17.87,9.2a.46.46,0,0,1,.38.55c-.06,1.22-.08,2.45-.12,3.68,0,.23,0,.47,0,.73l-3.85-1.07L3.9,10.2A1.36,1.36,0,0,1,3,9.37,5.42,5.42,0,0,1,2.75,5.47ZM16.88,29.23l-4.64-1.3L2.69,25.27a1.41,1.41,0,0,1-.94-.82,5.47,5.47,0,0,1-.24-3.86A1.06,1.06,0,0,1,3,19.83l13.59,4.43c.31.1.43.22.41.56C17,26.27,16.93,27.72,16.88,29.23ZM3.64,17.3a7.52,7.52,0,0,0-.41-4.08l18,3.69c.05,1.6.1,3.17.15,4.8Zm31.73,4.87a23,23,0,0,0,0,2.35c0,.2,0,.33-.25.39L17.82,29.2a.83.83,0,0,1-.16,0c.05-1.57.1-3.14.15-4.75L20.07,24c.38-.08.77-.17,1.15-.23a5.93,5.93,0,0,1,.73,0,1.21,1.21,0,0,0,.38,0A61.33,61.33,0,0,1,30,21.93c1.83-.4,3.66-.75,5.49-1.12l.2,0A8.37,8.37,0,0,0,35.37,22.17Zm1.89-5.25a1.63,1.63,0,0,1-1.21.89q-6.72,1.86-13.43,3.76l-.48.13c0-1.12-.09-2.19-.12-3.26,0-.51-.2-1.15,0-1.49s.89-.39,1.37-.55L36,12.3A1.05,1.05,0,0,1,37.5,13,5.42,5.42,0,0,1,37.26,16.92Z"/></svg>
                        <h2 className="font-bold uppercase text-black text-[30px]">BOOKSTORE</h2>
                    </div>
                </Link>
            </div>
            <div className="flex gap-[20px] py-[38px] items-center">
                <Link className="no-underline hover:no-underline text-black font-medium uppercase mx-[25px]" to="/?genre=Romance">Romance</Link>
                <Link className="no-underline hover:no-underline text-black font-medium uppercase mx-[25px]" to="/?genre=Thriller">Thriller</Link>
                <Link className="no-underline hover:no-underline text-black font-medium uppercase mx-[25px]" to="/?genre=SciFi">SciFi</Link>
                <Link className="no-underline hover:no-underline text-black font-medium uppercase mx-[25px]" to="/?genre=Fantasy">Fantasy</Link>
            </div>

            <div className="flex gap-[35px] py-[38px] items-center mr-[5px]">
                <TextField
                size="small"
                value={search}
                placeholder="Find your next read..."
                className="bg-[#f5f4f0] w-[300px] pt-[10px] pb-[10px] pl-[20px] pr-[50px]"
                onChange={(e) => {
                const value = e.target.value;

                if (value === "") {
                    navigate("/");
                } else {
                    navigate(`/?search=${value}`);
                }
                }}
                InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                    <SearchIcon  sx={{ color: "black" }}/>
                    </InputAdornment>
                ),
                }}
                />
                <Link className="no-underline hover:no-underline text-black font-medium uppercase" to="/cart">
                    <ShoppingCartIcon titleAccess="Cart" sx={{ color: "black" }} />
                </Link>
                <Link className="no-underline hover:no-underline text-black font-medium uppercase" to="/administrator">
                    <LoginIcon titleAccess="Administrator" sx={{ color: "black" }} />
                </Link>
            </div>
        </nav>

        <div className="py-[45px] mb-[40px] bg-gradient-to-r from-[#ebeae4] to-[#e9e9e9] text-sm text-gray-600 flex items-center justify-center gap-2 text-black">
        {breadcrumbs.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
            {index === 0 ? (
                <span
                className="cursor-pointer capitalize text-black"
                onClick={() => navigate("/")}
                >
                {item.label}
                </span>
            ) : (
                <span className="capitalize text-black">{item.label}</span>
            )}

            {index < breadcrumbs.length - 1 && <span>|</span>}
            </div>
        ))}
        </div>
    </header>
    );
}

export default Header;