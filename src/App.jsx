import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";

export default function App() {



  let routers = createBrowserRouter([
    {
      path: "", element: <Layout />, children: [
        { path: "signUp", element: <SignUp /> },
        { path: "signIn", element: <SignIn /> }
      ]
    }
  ])

  return <>

    <RouterProvider router={routers}></RouterProvider>

  </>
}
