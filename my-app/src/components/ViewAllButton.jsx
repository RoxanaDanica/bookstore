import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function ViewAllButton({
  label = "View all",
  to,
  className = "",
}) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
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
      <span>{label}</span>

      <span className="overflow-hidden">
        <ArrowForwardIcon
          sx={{ fontSize: 18 }}
          className="
            transition-transform duration-300 ease-out
            group-hover:translate-x-1
          "
        />
      </span>

      <span
        className="
          absolute bottom-0 left-0
          h-px w-full
          bg-[#d8d2cb]
        "
      />

      <span
        className="
          absolute bottom-0 left-0
          h-px w-0
          bg-[#b5202d]
          transition-all duration-300 ease-out
          group-hover:w-full
        "
      />
    </button>
  );
}