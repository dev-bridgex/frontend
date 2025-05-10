

import { Link, useLocation, useNavigate } from "react-router-dom";
import style from "./NavModal.module.css";
import { useEffect, useState } from "react";
import { Logo } from "../../Logo/Logo";
export default function NavModal() {
    const navigate = useNavigate();
    const location = useLocation();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const closeModal = () => {
        const modalElement = document.getElementById('exampleModal');
        const modalBackdrop = document.querySelector('.modal-backdrop');
        
        // Remove modal backdrop
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
        
        // Remove modal classes from body
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        // Hide modal
        if (modalElement) {
            modalElement.classList.remove('show');
            modalElement.style.display = 'none';
        }
    };

    const handleNavigation = (path) => {
        closeModal();
        navigate(path);
    };

    const handleLogout = () => {
        closeModal();
        localStorage.removeItem("token");
        window.location.replace('/');
    };

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "communities", path: "/communities" }
    ];

    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className={`${style.modalContent} modal-content`}>
                    <div className={`${style.modalHeader} modal-header`}>
                        <Logo isBlue={true} />
                        <i 
                            className={`${style.modalClose} fa-solid fa-xmark`} 
                            onClick={closeModal}
                        ></i>
                    </div>
                    <div className={`${style.modalBody} modal-body`}>
                        <ul className={`${style.modalBodyUl}`}>
                            {navLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        onClick={() => handleNavigation(link.path)}
                                        className={location.pathname === link.path ? style.active : ""}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}

                            {isLoggedIn ? (
                                <>
                                    <button
                                        onClick={handleLogout}
                                        className={style.logoutButton}
                                        aria-label="Logout"
                                    >
                                        <i className="fas fa-sign-out-alt"></i>
                                        <span>Logout</span>
                                    </button>
                                    <button
                                        onClick={() => handleNavigation('/manageProfile')}
                                        className={style.profileButton}
                                        title="Manage Profile"
                                    >
                                        <i className="fas fa-user-circle"></i>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <Link 
                                            to="/signIn" 
                                            onClick={() => handleNavigation('/signIn')}
                                            className={style.loginButton}
                                        >
                                            <i className="fas fa-sign-in-alt"></i>
                                            <span>Sign In</span>
                                        </Link>
                                    </div>
                                    <div>
                                        <Link 
                                            to="/signUp" 
                                            onClick={() => handleNavigation('/signUp')}
                                            className={style.signUpButton}
                                        >
                                            <i className="fas fa-user-plus"></i>
                                            <span>Sign Up</span>
                                        </Link>
                                    </div>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}



