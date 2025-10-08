import { BrowserRouter, createBrowserRouter, RouterProvider } from "react-router";
import './App.css'
import Home from './views/Home'
import Administrator from "./views/Administrator.jsx";
import Formular from "./views/Formular.jsx";

function App() {
  let router = createBrowserRouter([
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
]); 
  return (
    <>
      <RouterProvider router={router}>
        <Home />
      </RouterProvider>
    </>
  )
}

export default App
