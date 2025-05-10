/* eslint-disable react/prop-types */

import { Link } from 'react-router-dom';
import styles from './Logo.module.css';
import blueLogo from "/logo.svg";
import whiteLogo from "/whiteLogo.png";

export function Logo({blueLogo}) {


    return <>

        <div className={`${styles.logoWrapper}`}>
            <Link to="/">
                <img className={styles.logo} src={blueLogo==true ? blueLogo : whiteLogo} alt="" /></Link>
        </div>
    </>
}