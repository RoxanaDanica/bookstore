import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/joy";

import { useMemo, useState } from "react";

import Checkbox from "@mui/joy/Checkbox";
import Slider from "@mui/material/Slider";

import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function SidebarFilters({
  genres = [],
  authors = [],
  filters,
  setFilters,
}) {
  const [authorSearch, setAuthorSearch] =
    useState("");

  const [genreSearch, setGenreSearch] =
    useState("");

  const [priceRange, setPriceRange] = useState([
    Number(filters.minPrice) || 0,
    Number(filters.maxPrice) || 100,
  ]);

  const visibleAuthors = useMemo(() => {
    const search = authorSearch
      .trim()
      .toLowerCase();

    return authors
      .filter((author) => {
        if (!search) return true;

        return author
          .toLowerCase()
          .includes(search);
      })
      .slice(0, 50);
  }, [authors, authorSearch]);

  const visibleGenres = useMemo(() => {
    const search = genreSearch
      .trim()
      .toLowerCase();

    return genres
      .filter((genre) => {
        if (!search) return true;

        return genre
          .toLowerCase()
          .includes(search);
      })
      .slice(0, 100);
  }, [genres, genreSearch]);

  const handleGenre = (genre) => {
    setFilters((prev) => ({
      ...prev,

      genre: prev.genre.includes(genre)
        ? prev.genre.filter(
            (item) => item !== genre
          )
        : [...prev.genre, genre],
    }));
  };

  const handleAuthor = (author) => {
    setFilters((prev) => ({
      ...prev,

      author: prev.author.includes(author)
        ? prev.author.filter(
            (item) => item !== author
          )
        : [...prev.author, author],
    }));
  };

  const handlePriceChange = (_, value) => {
    setPriceRange(value);
  };

  const handlePriceCommitted = (_, value) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1],
    }));
  };

  const clearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      genre: [],
      author: [],
      minPrice: "",
      maxPrice: "",
    }));

    setPriceRange([0, 100]);

    setGenreSearch("");
    setAuthorSearch("");
  };

  const selectedCount =
    filters.genre.length +
    filters.author.length +
    (filters.minPrice !== "" ||
    filters.maxPrice !== ""
      ? 1
      : 0);

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <TuneRoundedIcon
            sx={{
              fontSize: 18,
              color: "#171717",
            }}
          />

          <h2 className="font-['Playfair'] text-[20px] font-semibold text-[#171717]">
            Filters
          </h2>

          {selectedCount > 0 && (
            <span
              className="
                flex h-5 min-w-5
                items-center justify-center
                rounded-full
                bg-[#b5202d]
                px-1.5
                text-[10px]
                font-semibold
                text-white
              "
            >
              {selectedCount}
            </span>
          )}
        </div>

        {selectedCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="
              text-[12px]
              font-medium
              text-[#8b8580]
              transition-colors
              hover:cursor-pointer
              hover:text-[#b5202d]
            "
          >
            Clear
          </button>
        )}
      </div>

      {(filters.genre.length > 0 ||
        filters.author.length > 0) && (
        <div className="mb-6 flex flex-wrap gap-2">
          {filters.genre.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() =>
                handleGenre(genre)
              }
              className="
                group
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-[#ded8d1]
                bg-white
                px-3
                py-1.5
                text-[11px]
                font-medium
                text-[#625c57]
                transition-all
                hover:cursor-pointer
                hover:border-[#b5202d]/40
                hover:text-[#b5202d]
              "
            >
              <span className="max-w-[150px] truncate">
                {genre}
              </span>

              <CloseRoundedIcon
                sx={{
                  fontSize: 13,
                }}
              />
            </button>
          ))}

          {filters.author.map((author) => (
            <button
              key={author}
              type="button"
              onClick={() =>
                handleAuthor(author)
              }
              className="
                group
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-[#ded8d1]
                bg-white
                px-3
                py-1.5
                text-[11px]
                font-medium
                text-[#625c57]
                transition-all
                hover:cursor-pointer
                hover:border-[#b5202d]/40
                hover:text-[#b5202d]
              "
            >
              <span className="max-w-[150px] truncate">
                {author}
              </span>

              <CloseRoundedIcon
                sx={{
                  fontSize: 13,
                }}
              />
            </button>
          ))}
        </div>
      )}

      <Accordion
        defaultExpanded
        sx={{
          background: "transparent",
          boxShadow: "none",
          borderRadius: 0,
          borderBottom:
            "1px solid #e7e1da",
        }}
      >
        <AccordionSummary
          sx={{
            padding: "16px 0",
            fontFamily:
              '"Playfair Display", serif',
            fontWeight: 600,
            fontSize: "17px",
            color: "#171717",
          }}
        >
          Genre
        </AccordionSummary>

        <AccordionDetails
          sx={{
            padding: "0 0 20px 0",
          }}
        >
          <input
            type="text"
            value={genreSearch}
            onChange={(e) =>
              setGenreSearch(
                e.target.value
              )
            }
            placeholder="Search genres..."
            className="
              mb-3
              w-full
              rounded-lg
              border
              border-[#ded8d1]
              bg-white
              px-3
              py-2
              text-[13px]
              text-[#171717]
              outline-none
              transition-colors
              placeholder:text-[#9a948e]
              focus:border-[#b5202d]
            "
          />

          <div
            className="
              flex
              max-h-[260px]
              flex-col
              gap-1
              overflow-y-auto
              pr-2
            "
          >
            {visibleGenres.map(
              (genre) => {
                const selected =
                  filters.genre.includes(
                    genre
                  );

                return (
                  <label
                    key={genre}
                    className={`
                      flex
                      cursor-pointer
                      items-start
                      gap-3
                      rounded-lg
                      px-2
                      py-2
                      text-[13px]
                      leading-5
                      transition-colors

                      ${
                        selected
                          ? "bg-[#f3eee9] text-[#171717]"
                          : "text-[#6f6963] hover:bg-white hover:text-[#171717]"
                      }
                    `}
                  >
                    <Checkbox
                      checked={selected}
                      onChange={() =>
                        handleGenre(
                          genre
                        )
                      }
                      size="sm"
                      sx={{
                        marginTop:
                          "2px",

                        "--Checkbox-checkedBg":
                          "#b5202d",

                        "--Checkbox-checkedColor":
                          "#ffffff",

                        "--Checkbox-actionRadius":
                          "4px",
                      }}
                    />

                    <span>
                      {genre}
                    </span>
                  </label>
                );
              }
            )}

            {visibleGenres.length === 0 && (
              <p className="px-2 py-3 text-[12px] text-[#8b8580]">
                No genres found.
              </p>
            )}
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion
        defaultExpanded
        sx={{
          background: "transparent",
          boxShadow: "none",
          borderRadius: 0,
          borderBottom:
            "1px solid #e7e1da",
        }}
      >
        <AccordionSummary
          sx={{
            padding: "16px 0",
            fontFamily:
              '"Playfair Display", serif',
            fontWeight: 600,
            fontSize: "17px",
            color: "#171717",
          }}
        >
          Author
        </AccordionSummary>

        <AccordionDetails
          sx={{
            padding: "0 0 20px 0",
          }}
        >
          <input
            type="text"
            value={authorSearch}
            onChange={(e) =>
              setAuthorSearch(
                e.target.value
              )
            }
            placeholder="Search authors..."
            className="
              mb-3
              w-full
              rounded-lg
              border
              border-[#ded8d1]
              bg-white
              px-3
              py-2
              text-[13px]
              text-[#171717]
              outline-none
              transition-colors
              placeholder:text-[#9a948e]
              focus:border-[#b5202d]
            "
          />

          <div
            className="
              flex
              max-h-[260px]
              flex-col
              gap-1
              overflow-y-auto
              pr-2
            "
          >
            {visibleAuthors.map(
              (author) => {
                const selected =
                  filters.author.includes(
                    author
                  );

                return (
                  <label
                    key={author}
                    className={`
                      flex
                      cursor-pointer
                      items-start
                      gap-3
                      rounded-lg
                      px-2
                      py-2
                      text-[13px]
                      leading-5
                      transition-colors

                      ${
                        selected
                          ? "bg-[#f3eee9] text-[#171717]"
                          : "text-[#6f6963] hover:bg-white hover:text-[#171717]"
                      }
                    `}
                  >
                    <Checkbox
                      checked={selected}
                      onChange={() =>
                        handleAuthor(
                          author
                        )
                      }
                      size="sm"
                      sx={{
                        marginTop:
                          "2px",

                        "--Checkbox-checkedBg":
                          "#b5202d",

                        "--Checkbox-checkedColor":
                          "#ffffff",

                        "--Checkbox-actionRadius":
                          "4px",
                      }}
                    />

                    <span>
                      {author}
                    </span>
                  </label>
                );
              }
            )}

            {visibleAuthors.length ===
              0 && (
              <p className="px-2 py-3 text-[12px] text-[#8b8580]">
                No authors found.
              </p>
            )}
          </div>

          {!authorSearch &&
            authors.length > 50 && (
              <p className="mt-2 px-2 text-[11px] text-[#9a948e]">
                Search to see more
                authors.
              </p>
            )}
        </AccordionDetails>
      </Accordion>

      <div className="pt-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-['Playfair'] text-[17px] font-semibold text-[#171717]">
            Price
          </h3>

          <span className="text-[12px] font-medium text-[#77716b]">
            ${priceRange[0]} — $
            {priceRange[1]}
          </span>
        </div>

        <div className="px-1">
          <Slider
            value={priceRange}
            min={0}
            max={100}
            step={1}
            onChange={
              handlePriceChange
            }
            onChangeCommitted={
              handlePriceCommitted
            }
            sx={{
              color: "#b5202d",

              "& .MuiSlider-thumb": {
                width: 14,
                height: 14,
                backgroundColor:
                  "#fff",
                border:
                  "2px solid #b5202d",
                boxShadow:
                  "0 2px 6px rgba(0,0,0,0.08)",
              },

              "& .MuiSlider-track": {
                height: 3,
                border: "none",
              },

              "& .MuiSlider-rail": {
                height: 3,
                color: "#d9d3cc",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}