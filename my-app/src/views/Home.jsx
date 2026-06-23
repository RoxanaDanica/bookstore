import { useState } from "react";
import SidebarFilters from "../components/SidebarFilters";
import BookGrid from "../components/BookGrid";
import useBooks from "../components/useBooks";
import useInfiniteScroll from "../components/useInfiniteScroll";
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Chat from "./Chat";

function Home() {
  const {
    books,
    setBooks,
    loadBooks,
    hasMore,
    filters,
    setFilters,
    searchTerm,
  } = useBooks();

  const [chatOpen, setChatOpen] = useState(false);

  useInfiniteScroll(loadBooks, hasMore);

  return (
    <div className="flex flex-col items-center relative">

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", width: "1400px" }}>
        <SidebarFilters
          books={books}
          filters={filters}
          setFilters={setFilters}
        />

        <BookGrid books={books} />
      </div>

      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#e52334] text-white text-2xl shadow-lg flex items-center justify-center hover:cursor-pointer"
      >
        <SmsOutlinedIcon />
      </button>

      {chatOpen && (
        <div className="fixed bottom-20 right-6 w-96 bg-white shadow-2xl rounded-xl border border-[#e5e5e5] z-50">
          <div className="flex justify-between items-center p-2 border-b border-[#e5e5e5]">
            <span className="font-bold">Chat</span>
            <button className="hover:cursor-pointer" onClick={() => setChatOpen(false)}><ClearOutlinedIcon /></button>
          </div>
          <Chat />
        </div>
      )}
    </div>
  );
}

export default Home;