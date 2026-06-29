import { useEffect } from "react";
import axios from "axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./views/Home";
import Administrator from "./views/Administrator";
import Cart from "./components/Cart";
import Checkout from "./views/Checkout";
import { CartProvider } from "react-use-cart";
import BookDetails from "./views/BookDetails";

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
    async function initGuest() {
      let userId = localStorage.getItem("user_id");
      if (!userId) {
        const res = await axios.post(
          "http://localhost:3000/users/guest"
        );
        userId = res.data.user_id;
        localStorage.setItem("user_id", userId);
      }
    }
    initGuest();

  }, []);

  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}

export default App;