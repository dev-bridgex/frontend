

import { Link, useLocation } from "react-router-dom";
import style from "./NavModal.module.css";
import { useEffect, useState } from "react";
export default function NavModal() {


    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.replace('/');
    };

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); // Convert to boolean
    }, []);



    const location = useLocation();

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "communities", path: "/communities" }
    ];


    return <>


        <div>


            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">

                    {/* modalContent */}
                    <div className={`${style.modalContent} modal-content`}>

                        {/* modalHeader */}
                        <div className={`${style.modalHeader} modal-header`}>

                            <h6 id="exampleModalLabel">Navigation</h6>

                            <i className={`${style.modalClose} fa-solid fa-xmark`} data-bs-toggle="modal" data-bs-target="#exampleModal"></i>

                        </div>

                        {/* modalBody */}
                        <div className={`${style.modalBody} modal-body`}>

                            <ul className={`${style.modalBodyUl} `}>
                                {navLinks.map((link) => (
                                    <li key={link.path}>
                                        <Link
                                            to={link.path}
                                            className={location.pathname === link.path ? style.active : ""}>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}

                                {isLoggedIn &&
                                    <button onClick={handleLogout} className={style.logoutButton} aria-label="Logout">
                                        Logout
                                    </button>
                                }
                            </ul>

                        </div>

                    </div>
                </div>
            </div>
        </div>

    </>
}
