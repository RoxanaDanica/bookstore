import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BackButton({
  label = "Back to previous page",
  className = "",
  to = null,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
      return;
    }

    navigate(-1);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        group relative inline-flex items-center gap-3
        pb-2 text-[13px] font-semibold
        tracking-[0.02em] text-[#171717]
        transition-colors duration-300
        hover:cursor-pointer
        hover:text-[#b5202d]
        ${className}
      `}
    >
      <span className="overflow-hidden">
        <ArrowBackIcon
          sx={{ fontSize: 18 }}
          className="
            transition-transform duration-300 ease-out
            group-hover:-translate-x-1
          "
        />
      </span>

      <span>{label}</span>

      <span
        className="
          absolute bottom-0 left-0
          h-[1px] w-full
          bg-[#d8d2cb]
        "
      />

      <span
        className="
          absolute bottom-0 left-0
          h-[1px] w-0
          bg-[#b5202d]
          transition-all duration-300 ease-out
          group-hover:w-full
        "
      />
    </button>
  );
}