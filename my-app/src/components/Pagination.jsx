import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

function Pagination({
  page,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];

    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);

    if (start > 1) {
      pages.push(1);

      if (start > 2) {
        pages.push("...");
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (newPage) => {
    if (
      newPage < 1 ||
      newPage > totalPages ||
      newPage === page
    ) {
      return;
    }

    onPageChange(newPage);

    document
      .getElementById("book-catalogue")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <div className="mt-14 flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
        className="
          flex h-11 items-center gap-2 rounded-xl
          border border-[#ded8d1] bg-white
          px-4 text-sm font-semibold text-[#171717]
          transition
          hover:border-[#171717]
          disabled:cursor-not-allowed
          disabled:opacity-35
          hover:cursor-pointer
        "
      >
        <ArrowBackRoundedIcon sx={{ fontSize: 18 }} />
        Previous
      </button>

      <div className="hidden items-center gap-2 sm:flex">
        {getPages().map((item, index) =>
          item === "..." ? (
            <span
              key={`dots-${index}`}
              className="flex h-11 w-8 items-center justify-center text-[#96908a]"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => handlePageChange(item)}
              className={`
                flex h-11 min-w-11 items-center justify-center
                rounded-xl px-3
                text-sm font-semibold
                transition hover:cursor-pointer
                ${
                  item === page
                    ? "bg-[#171717] text-white"
                    : "border border-[#ded8d1] bg-white text-[#171717] hover:border-[#b5202d] hover:text-[#b5202d]"
                }
              `}
            >
              {item}
            </button>
          )
        )}
      </div>

      <div className="px-3 text-sm text-[#77716b] sm:hidden">
        {page} / {totalPages}
      </div>

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
        className="
          flex h-11 items-center gap-2 rounded-xl
          border border-[#ded8d1] bg-white
          px-4 text-sm font-semibold text-[#171717]
          transition
          hover:border-[#171717]
          disabled:cursor-not-allowed
          disabled:opacity-35
          hover:cursor-pointer
        "
      >
        Next
        <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
      </button>
    </div>
  );
}

export default Pagination;