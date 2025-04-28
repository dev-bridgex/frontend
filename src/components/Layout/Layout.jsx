import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";
import NavBar from "../Navigation/NavBar/NavBar";
import { ToastContainer } from "react-toastify";

export default function Layout() {






    return <>
        <ToastContainer autoClose={300} />
        <NavBar />
        <Outlet />
        <Footer />

    </>
}
