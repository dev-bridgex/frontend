
import { Link } from 'react-router-dom';
import styles from './Logo.module.css';
import logo from "/logo.svg";

export function Logo() {


    return <>

        <div className={`${styles.logoWrapper}`}>
            <Link to="/">
                <img className={styles.logo} src={logo} alt="" /></Link>
        </div>
    </>
}