import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { DataGrid } from "@mui/x-data-grid";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import { deleteBook, getBooks } from "../api/books";
import { addDocument } from "../api/uploadFile";

function Administrator() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getBooks().then((response) => {
      setBooks(response.data);
      console.log("BOOKS:", response.data);
    });
  }, []);

  const removeBook = async (id) => {
    await deleteBook(id);

    setBooks((prev) =>
      prev.filter((book) => book.id !== id)
    );
  };

  const handleEdit = (id) => {
    navigate(`/formular/${id}`, {
      state: { disabled: false },
    });
  };

  const handleState = (id) => {
    navigate(`/formular/${id}`, {
      state: { disabled: true },
    });
  };

  const handleAddBook = () => {
    navigate("/formular", {
      state: { disabled: false },
    });
  };

  const uploadFileRouter = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    await addDocument(file);
  };

  const columns = [
    {
      field: "isbn13",
      headerName: "ISBN",
      flex: 0.8,
      minWidth: 130,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: "authors",
      headerName: "Authors",
      flex: 1,
      minWidth: 160,
    },
    {
      field: "coverImage",
      headerName: "Cover",
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <div className="flex h-full w-full items-center justify-center py-2">
          <div className="flex h-[58px] w-[44px] items-center justify-center overflow-hidden rounded-md bg-[#f3f0ea]">
            <img
              src={
                params.value ||
                "https://www.blurb.com/blog/wp-content/uploads/2020/07/20200717_BookCoversExplained_Inline_Images_v1_01-1-1024x600.jpg"
              }
              alt={params.row.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      sortable: false,
      renderCell: (params) => (
        <div className="flex h-full items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row.id);
            }}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-lg border border-[#d8d2cb]
              bg-white text-[#171717]
              transition
              hover:border-[#171717]
              hover:bg-[#171717]
              hover:text-white
            "
          >
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeBook(params.row.id);
            }}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-lg border border-[#ead6d8]
              bg-[#fff8f8] text-[#b5202d]
              transition
              hover:border-[#b5202d]
              hover:bg-[#b5202d]
              hover:text-white
            "
          >
            <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
      ),
    },
  ];

  const rows = books.map((book) => ({
    id: book.id,
    isbn13: book.isbn13,
    title: book.title,
    authors: book.authors,
    coverImage: book.thumbnail,
  }));

  const paginationModel = {
    page: 0,
    pageSize: 15,
  };

  return (
    <main className="min-h-screen bg-[#f8f6f2] px-6 py-14">
      <div className="mx-auto max-w-[1400px]">

        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b5202d]">
              Ivory & Ink
            </p>

            <h1 className="mt-3 font-['Playfair'] text-[42px] font-semibold text-[#171717]">
              Library Management
            </h1>

            <p className="mt-3 max-w-[620px] text-[15px] leading-7 text-[#77716b]">
              Manage your catalogue, add new titles and import books
              from Excel.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#e5dfd7] bg-white px-5 py-4 shadow-[0_6px_20px_rgba(0,0,0,0.03)]">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f0ea] text-[#b5202d]">
              <Inventory2OutlinedIcon sx={{ fontSize: 21 }} />
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#96908a]">
                Total books
              </p>

              <p className="mt-1 text-xl font-semibold text-[#171717]">
                {books.length}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2">

          <div className="rounded-2xl border border-[#e5dfd7] bg-white p-6 shadow-[0_8px_25px_rgba(0,0,0,0.03)]">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f3f0ea] text-[#b5202d]">
                <MenuBookRoundedIcon sx={{ fontSize: 22 }} />
              </div>

              <div>
                <h2 className="font-['Playfair'] text-[22px] font-semibold text-[#171717]">
                  Add a new book
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#817b75]">
                  Add a new title manually to your bookstore catalogue.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddBook}
              className="
                mt-6 inline-flex items-center gap-2
                rounded-xl bg-[#171717]
                px-5 py-3 text-sm font-semibold text-white
                transition
                hover:bg-[#b5202d]
              "
            >
              <AddRoundedIcon sx={{ fontSize: 20 }} />
              Add book
            </button>
          </div>

          <div className="rounded-2xl border border-[#e5dfd7] bg-white p-6 shadow-[0_8px_25px_rgba(0,0,0,0.03)]">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f3f0ea] text-[#b5202d]">
                <UploadFileRoundedIcon sx={{ fontSize: 22 }} />
              </div>

              <div>
                <h2 className="font-['Playfair'] text-[22px] font-semibold text-[#171717]">
                  Import books
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#817b75]">
                  Upload an Excel document to add multiple books at once.
                </p>
              </div>
            </div>

            <label
              className="
                mt-6 inline-flex cursor-pointer items-center gap-2
                rounded-xl border border-[#d8d2cb]
                bg-white px-5 py-3
                text-sm font-semibold text-[#171717]
                transition
                hover:border-[#171717]
                hover:bg-[#faf9f7]
              "
            >
              <UploadFileRoundedIcon sx={{ fontSize: 20 }} />

              Upload Excel

              <input
                type="file"
                accept=".xlsx"
                onChange={uploadFileRouter}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e5dfd7] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between border-b border-[#eee9e3] px-6 py-5">
            <div>
              <h2 className="font-['Playfair'] text-[25px] font-semibold text-[#171717]">
                Book catalogue
              </h2>

              <p className="mt-1 text-sm text-[#8b8580]">
                Click on a book to view its details.
              </p>
            </div>
          </div>

          <div className="h-[760px] w-full">
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel,
                },
              }}
              pageSizeOptions={[15, 30]}
              checkboxSelection
              rowHeight={76}
              disableRowSelectionOnClick
              onCellClick={(params) => {
                if (params.field !== "actions") {
                  handleState(params.row.id);
                }
              }}
              sx={{
                border: 0,

                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#faf8f5",
                  borderBottom: "1px solid #eee9e3",
                },

                "& .MuiDataGrid-columnHeaderTitle": {
                  fontFamily: '"Jost", sans-serif',
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#171717",
                },

                "& .MuiDataGrid-cell": {
                  borderColor: "#eee9e3",
                  fontFamily: '"Jost", sans-serif',
                  fontSize: "13px",
                  color: "#625c57",
                  display: "flex",
                  alignItems: "center",
                },

                "& .MuiDataGrid-row": {
                  cursor: "pointer",
                },

                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#faf8f5",
                },

                "& .MuiDataGrid-footerContainer": {
                  borderTop: "1px solid #eee9e3",
                  backgroundColor: "#faf8f5",
                },

                "& .MuiCheckbox-root": {
                  color: "#b8b1aa",
                },

                "& .MuiCheckbox-root.Mui-checked": {
                  color: "#b5202d",
                },
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Administrator;