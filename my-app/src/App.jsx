import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./views/Home";
import Administrator from "./views/Administrator.jsx";
import Formular from "./views/Formular.jsx";
import Cart from "./components/Cart.jsx";
import Checkout from "./views/Checkout.jsx";

import { CartProvider } from "react-use-cart";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/administrator",
    element: <Administrator />,
  },
  {
    path: "/formular",
    element: <Formular />,
  },
  {
    path: "/cart",        
    element: <Cart />,      
  },
  {
    path: "/checkout", 
    element: <Checkout />,
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