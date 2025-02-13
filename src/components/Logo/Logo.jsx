
import { GraduationCap, Sparkles } from 'lucide-react';
import styles from './Logo.module.css';

export function Logo() {
    return (
        <div className={styles.container}>
            <div className={styles.iconContainer}>
                <GraduationCap className={styles.graduationCap} />
                <Sparkles className={styles.sparkles} />
            </div>
            <div className={styles.textContainer}>
                <span className={styles.bridgeText}>Bridge</span>
                <span className={styles.xText}>X</span>
            </div>
        </div>
    );
}