import { Link } from "react-router-dom";
import style from "./NavBar.module.css";
import NavModal from "../NavModal/NavModal";
import { useEffect, useState } from "react";
import { Logo } from "../../Logo/Logo";

export default function NavBar() {



  const navLinks = [
    { name: "Home", path: "/" },
    {
      name: "Communities", path: "/communities"
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.replace('/');
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Convert to boolean
  }, []);


  return (
    <nav>
      <NavModal />
      <div className={`${style.navContainer} fixed-top shadow-sm `}>
        <div className={`${style.navBarContainer} specialContainer `}>

          {/* logoWrapper */}
          <Logo />
          <ul className={`${style.navBarUl}`}>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={location.pathname === link.path ? style.active : ""}
                >
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

          <i className={`${style.menuIcon} fa-solid fa-bars `} data-bs-toggle="modal" data-bs-target="#exampleModal"></i>

        </div>
      </div>
    </nav>
  );
}
