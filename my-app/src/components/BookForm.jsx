import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { getBook, updateBook, addBook } from "../api/books";

function BookForm() {
  const { bookId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const disabled = location.state?.disabled ?? false;

  const [isDisabled, setIsDisabled] = useState(disabled);
  const [saving, setSaving] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isbn13: "",
      isbn10: "",
      title: "",
      subtitle: "",
      authors: "",
      categories: "",
      thumbnail: "",
      description: "",
      published_year: "",
      average_rating: "",
      num_pages: "",
      ratings_count: "",
      price: "",
      stock: "",
    },
  });

  const coverImage = watch("thumbnail");

  useEffect(() => {
    setIsDisabled(disabled);

    if (!bookId) return;

    getBook(bookId).then((initialBook) => {
      for (const key in initialBook) {
        setValue(key, initialBook[key] ?? "");
      }
    });
  }, [bookId, disabled, setValue]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);

      if (bookId) {
        await updateBook(bookId, data);
      } else {
        await addBook(data);
      }

      navigate("/administrator");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (error) => `
    w-full rounded-xl border
    ${error ? "border-[#b5202d]" : "border-[#ddd7d0]"}
    bg-[#faf9f7]
    px-4 py-3.5
    text-sm text-[#171717]
    outline-none
    transition
    placeholder:text-[#aaa49d]
    focus:border-[#b5202d]
    focus:bg-white
    disabled:cursor-not-allowed
    disabled:bg-[#f0ede8]
    disabled:text-[#89837d]
  `;

  const labelClass =
    "mb-2 block text-sm font-semibold text-[#302d2a]";

  const ErrorMessage = ({ error }) =>
    error ? (
      <p className="mt-1.5 text-xs text-[#b5202d]">
        {error.message}
      </p>
    ) : null;

  const pageTitle = !bookId
    ? "Add a new book"
    : isDisabled
      ? "Book details"
      : "Edit book";

  const pageDescription = !bookId
    ? "Add a new title to the Ivory & Ink catalogue."
    : isDisabled
      ? "Review the information stored for this title."
      : "Update the information for this book.";

  return (
    <div>
      <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              mb-5 inline-flex items-center gap-2
              text-sm font-medium text-[#77716b]
              transition hover:text-[#b5202d]
            "
          >
            <ArrowBackRoundedIcon sx={{ fontSize: 18 }} />
            Back to catalogue
          </button>

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b5202d]">
            Ivory & Ink
          </p>

          <h1 className="mt-3 font-['Playfair'] text-[40px] font-semibold leading-tight text-[#171717]">
            {pageTitle}
          </h1>

          <p className="mt-3 text-[15px] leading-7 text-[#77716b]">
            {pageDescription}
          </p>
        </div>

        {bookId && isDisabled && (
          <button
            type="button"
            onClick={() => setIsDisabled(false)}
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl bg-[#171717]
              px-5 py-3
              text-sm font-semibold text-white
              transition
              hover:bg-[#b5202d]
            "
          >
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
            Edit book
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]"
      >
        <div className="space-y-6">
          <section className="rounded-2xl border border-[#e5dfd7] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] sm:p-8">
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f0ea] text-[#b5202d]">
                <MenuBookRoundedIcon sx={{ fontSize: 21 }} />
              </div>

              <div>
                <h2 className="font-['Playfair'] text-[22px] font-semibold text-[#171717]">
                  Basic information
                </h2>

                <p className="mt-1 text-sm text-[#8b8580]">
                  Title, author and publishing details.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Title</label>

                <input
                  type="text"
                  disabled={isDisabled}
                  placeholder="Book title"
                  {...register("title", {
                    required: "Title is required",
                  })}
                  className={inputClass(errors.title)}
                />

                <ErrorMessage error={errors.title} />
              </div>

              <div>
                <label className={labelClass}>Subtitle</label>

                <input
                  type="text"
                  disabled={isDisabled}
                  placeholder="Book subtitle"
                  {...register("subtitle")}
                  className={inputClass(errors.subtitle)}
                />
              </div>

              <div>
                <label className={labelClass}>Authors</label>

                <input
                  type="text"
                  disabled={isDisabled}
                  placeholder="Author name"
                  {...register("authors", {
                    required: "Author is required",
                  })}
                  className={inputClass(errors.authors)}
                />

                <ErrorMessage error={errors.authors} />
              </div>

              <div>
                <label className={labelClass}>Categories</label>

                <input
                  type="text"
                  disabled={isDisabled}
                  placeholder="e.g. Fiction"
                  {...register("categories", {
                    required: "Category is required",
                  })}
                  className={inputClass(errors.categories)}
                />

                <ErrorMessage error={errors.categories} />
              </div>

              <div>
                <label className={labelClass}>Publication year</label>

                <input
                  type="number"
                  disabled={isDisabled}
                  placeholder="2026"
                  {...register("published_year", {
                    required: "Publication year is required",
                    max: {
                      value: 2026,
                      message: "Year must not be greater than 2026",
                    },
                  })}
                  className={inputClass(errors.published_year)}
                />

                <ErrorMessage error={errors.published_year} />
              </div>

              <div>
                <label className={labelClass}>ISBN-13</label>

                <input
                  type="text"
                  disabled={isDisabled}
                  placeholder="978..."
                  {...register("isbn13", {
                    required: "ISBN-13 is required",
                  })}
                  className={inputClass(errors.isbn13)}
                />

                <ErrorMessage error={errors.isbn13} />
              </div>

              <div>
                <label className={labelClass}>ISBN-10</label>

                <input
                  type="text"
                  disabled={isDisabled}
                  placeholder="ISBN-10"
                  {...register("isbn10")}
                  className={inputClass(errors.isbn10)}
                />
              </div>

              <div>
                <label className={labelClass}>Pages</label>

                <input
                  type="number"
                  min="0"
                  disabled={isDisabled}
                  placeholder="320"
                  {...register("num_pages")}
                  className={inputClass(errors.num_pages)}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#e5dfd7] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] sm:p-8">
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f0ea] text-[#b5202d]">
                <InfoOutlinedIcon sx={{ fontSize: 21 }} />
              </div>

              <div>
                <h2 className="font-['Playfair'] text-[22px] font-semibold text-[#171717]">
                  Book details
                </h2>

                <p className="mt-1 text-sm text-[#8b8580]">
                  Description, stock, rating and price.
                </p>
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Description
              </label>

              <textarea
                disabled={isDisabled}
                rows={6}
                placeholder="Write a short description of the book..."
                {...register("description", {
                  required: "Description is required",
                })}
                className={`${inputClass(
                  errors.description
                )} resize-none leading-6`}
              />

              <ErrorMessage error={errors.description} />
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Average rating</label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="5"
                  disabled={isDisabled}
                  placeholder="4.25"
                  {...register("average_rating")}
                  className={inputClass(errors.average_rating)}
                />
              </div>

              <div>
                <label className={labelClass}>Stock</label>

                <input
                  type="number"
                  min="0"
                  disabled={isDisabled}
                  placeholder="20"
                  {...register("stock", {
                    required: "Stock is required",
                  })}
                  className={inputClass(errors.stock)}
                />

                <ErrorMessage error={errors.stock} />
              </div>

              <div>
                <label className={labelClass}>Price</label>

                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    disabled={isDisabled}
                    placeholder="0.00"
                    {...register("price", {
                      required: "Price is required",
                    })}
                    className={`${inputClass(errors.price)} pr-12`}
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#8b8580]">
                    €
                  </span>
                </div>

                <ErrorMessage error={errors.price} />
              </div>
            </div>
          </section>

          {!isDisabled && (
            <div className="xl:hidden">
              <button
                type="submit"
                disabled={saving}
                className="
                  flex w-full items-center justify-center gap-2
                  rounded-xl bg-[#171717]
                  px-5 py-3.5
                  text-sm font-semibold text-white
                  transition
                  hover:bg-[#b5202d]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <SaveOutlinedIcon sx={{ fontSize: 19 }} />

                {saving
                  ? "Saving..."
                  : bookId
                    ? "Save changes"
                    : "Add book"}
              </button>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-[#e5dfd7] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] xl:sticky xl:top-[110px]">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f0ea] text-[#b5202d]">
                <ImageOutlinedIcon sx={{ fontSize: 20 }} />
              </div>

              <h2 className="font-['Playfair'] text-xl font-semibold text-[#171717]">
                Book cover
              </h2>
            </div>

            <div className="flex min-h-[330px] items-center justify-center overflow-hidden rounded-2xl bg-[#f3f0ea] p-6">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Book cover preview"
                  className="max-h-[290px] max-w-full rounded-md object-contain shadow-[0_12px_25px_rgba(0,0,0,0.15)]"
                />
              ) : (
                <div className="text-center">
                  <ImageOutlinedIcon
                    sx={{
                      fontSize: 36,
                      color: "#bdb6ae",
                    }}
                  />

                  <p className="mt-3 text-sm text-[#96908a]">
                    Cover preview
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5">
              <label className={labelClass}>
                Cover image URL
              </label>

              <input
                type="text"
                disabled={isDisabled}
                placeholder="https://..."
                {...register("coverImage")}
                className={inputClass()}
              />
            </div>

            {!isDisabled && (
              <button
                type="submit"
                disabled={saving}
                className="
                  mt-6 hidden w-full items-center justify-center gap-2
                  rounded-xl bg-[#171717]
                  px-5 py-3.5
                  text-sm font-semibold text-white
                  transition
                  hover:bg-[#b5202d]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  xl:flex
                "
              >
                <SaveOutlinedIcon sx={{ fontSize: 19 }} />

                {saving
                  ? "Saving..."
                  : bookId
                    ? "Save changes"
                    : "Add book"}
              </button>
            )}

            {isDisabled && (
              <div className="mt-6 rounded-xl bg-[#f3f0ea] px-4 py-3">
                <p className="text-xs leading-5 text-[#77716b]">
                  You are currently viewing this book in read-only
                  mode.
                </p>
              </div>
            )}
          </div>
        </aside>
      </form>
    </div>
  );
}

export default BookForm;