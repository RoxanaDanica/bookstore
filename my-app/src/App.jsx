import { useEffect } from "react";
import axios from "axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CartProvider } from "react-use-cart";

import Home from "./views/Home";
import Administrator from "./views/Administrator";
import Cart from "./components/Cart";
import Checkout from "./views/Checkout";
import BookDetails from "./views/BookDetails";
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
      }
    ],
  },
]);

function App() {
  useEffect(() => {
    async function initAuth() {
      let token = localStorage.getItem("token");

      if (!token) {
        const res = await createGuest();

        token = res.token;

        localStorage.setItem("token", token);
      }
    }

    initAuth();
  }, []);

  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}

export default App;