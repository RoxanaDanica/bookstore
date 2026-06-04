import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./views/Home";
import Administrator from "./views/Administrator";
import Cart from "./components/Cart";
import Checkout from "./views/Checkout";
import { CartProvider } from "react-use-cart";

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
    ],
  },
]);

function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}

export default App;