
import { Link, useNavigate, useLocation } from "react-router-dom";
import style from "./NavBar.module.css";
import NavModal from "../NavModal/NavModal";
import { useEffect, useState } from "react";
import { Logo } from "../../Logo/Logo";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Communities", path: "/communities" }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.replace('/');
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants
  const navVariants = {
    hidden: { y: -100 },
    visible: {
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.08,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };

  return <>
    <NavModal />

    <motion.nav
      className={`${style.nav} ${isScrolled ? style.scrolled : ''}`}
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className={`specialContainer`}>

        <div className={style.navBarContainer}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo />
          </motion.div>

          <ul className={style.navBarUl}>
            {navLinks.map((link) => (
              <li
                key={link.path}
                className={style.navItem}
              >
                <Link
                  to={link.path}
                  className={`${style.navLink} ${location.pathname === link.path ? style.active : ""}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <motion.div
            className={style.authSection}
          >
            <AnimatePresence mode="wait">
              {isLoggedIn ? (
                <motion.div
                  key="logged-in"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={style.authButtons}
                >
                  <motion.button
                    onClick={() => navigate('/manageProfile')}
                    className={style.profileButton}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    title="Manage Profile"
                  >
                    <i className="fas fa-user-circle"></i>
                  </motion.button>
                  <motion.button
                    onClick={handleLogout}
                    className={style.logoutButton}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    aria-label="Logout"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="logged-out"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={style.authButtons}
                >
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link to="/signIn" className={style.loginButton}>
                      <i className="fas fa-sign-in-alt"></i>
                      <span>Sign In</span>
                    </Link>
                  </motion.div>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link to="/signUp" className={style.signUpButton}>
                      <i className="fas fa-user-plus"></i>
                      <span>Sign Up</span>
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.button
            className={style.menuButton}
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            aria-label="Menu"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <i className="fa-solid fa-bars"></i>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  </>
}





