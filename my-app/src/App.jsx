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
  {
    path: "/formular",
    children: [
      { index: true, Component: Formular },
      {
        Component: Formular,
        children: [
          { path: ":bookId", Component: Formular },
          { path: ":bookId/edit", Component: Formular },
        ],
      },
    ],
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
