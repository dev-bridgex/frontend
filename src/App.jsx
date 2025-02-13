import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Register from "./components/Register/Register";

export default function App() {



  let routers = createBrowserRouter([
    {
      path: "", element: <Layout />, children: [
        { path: "register", element: <Register /> }
      ]
    }
  ])

  return <>

    <RouterProvider router={routers}></RouterProvider>

  </>
}
