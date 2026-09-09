import { useEffect, useState } from "react";
import axios from "axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import Home from "./views/Home";
import Administrator from "./views/Administrator";
import Cart from "./components/Cart";
import Checkout from "./views/Checkout";
import BookDetails from "./views/BookDetails";
import Formular from "./views/Formular";
import { createGuest } from "./api/auth";

import MainLayout from "./components/Layout";
import './index.css'

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/administrator",
        element: <Administrator />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/books/:id",
        element: <BookDetails />
      },
      {
        path: "/reviews",
        element: <BookDetails />
      },
      {
        path: "/formular",
        element: <Formular />,
      },
      {
        path: "/formular/:bookId",
        element: <Formular />,
      },
    ],
  },
]);

function App() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    async function initAuth() {
      try {
        let token = localStorage.getItem("token");

        if (!token) {
          const res = await createGuest();
          token = res.token;
          localStorage.setItem("token", token);
        }
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        setAuthReady(true);
      }
    }

    initAuth();
  }, []);

  if (!authReady) {
    return <div>Loading...</div>;
  }

  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}
export default App;