import { useEffect, useRef } from "react";

export default function useInfiniteScroll(loadBooks, hasMore) {
  const pageRef = useRef(0);
  const loadingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= fullHeight - 100) {
        if (hasMore && !loadingRef.current) {
          pageRef.current += 20;
          loadBooks(pageRef.current);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);
}
