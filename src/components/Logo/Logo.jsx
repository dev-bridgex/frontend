/* eslint-disable react/prop-types */

import { Link } from 'react-router-dom';
import styles from './Logo.module.css';
import blueLogoImage from "/logo.svg";
import whiteLogo from "/whiteLogo.png";

export function Logo({ isBlue }) {
    return (
        <div className={`${styles.logoWrapper}`}>
            <Link to="/">
                <img 
                    className={styles.logo} 
                    src={isBlue ? blueLogoImage : whiteLogo} 
                    alt="BridgeX Logo" 
                />
            </Link>
        </div>
    );
}
