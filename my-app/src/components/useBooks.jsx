import { useEffect, useRef, useState } from "react";
import { getBooks } from "../api/books";
import { useSearchParams } from "react-router-dom";

export default function useBooks() {
    const [books, setBooks] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const [filters, setFilters] = useState({
        genre: [],
        author: [],
        price: [0, 100],
    });

    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get("search") || "";

    const pageRef = useRef(0);
    const loadingRef = useRef(false);

    const loadBooks = async (pageNumber) => {
    if (loadingRef.current) return;

    loadingRef.current = true;

    const limit = 20;

    const response = await getBooks(limit, pageNumber, filters);

    if (response.data.length === 0) {
        setHasMore(false);
    } else {
        setBooks(prev => [...prev, ...response.data]);
    }

    loadingRef.current = false;
    };

    useEffect(() => {
        setBooks([]);
        setHasMore(true);
        pageRef.current = 0;
        loadBooks(0);
    }, [searchTerm, filters]);

    return {
        books,
        setBooks,
        loadBooks,
        hasMore,
        filters,
        setFilters,
        searchTerm,
        pageRef,
    };
}