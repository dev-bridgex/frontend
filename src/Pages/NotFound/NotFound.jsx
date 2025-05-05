import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
    useEffect(() => {
        // Add particles animation effect
        const createParticle = (x, y) => {
            const particle = document.createElement('div');
            particle.classList.add(styles.particle);

            // Random size between 5-15px
            const size = Math.floor(Math.random() * 10) + 5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // Random position around the center
            const posX = x + (Math.random() - 0.5) * 200;
            const posY = y + (Math.random() - 0.5) * 200;
            particle.style.left = `${posX}px`;
            particle.style.top = `${posY}px`;

            // Random rotation
            const rotation = Math.random() * 360;
            particle.style.transform = `rotate(${rotation}deg)`;

            // Random color
            const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#2563eb', '#1d4ed8'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.backgroundColor = color;

            // Random animation duration
            const duration = Math.random() * 2 + 1;
            particle.style.animationDuration = `${duration}s`;

            document.querySelector(`.${styles.notFoundPage}`).appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
            }, duration * 1000);
        };

        // Create particles at intervals
        const interval = setInterval(() => {
            const container = document.querySelector(`.${styles.notFoundContainer}`);
            if (container) {
                const rect = container.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                createParticle(centerX, centerY);
            }
        }, 300);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className={styles.notFoundPage}>
            <div className={styles.notFoundContainer}>
                <div className={styles.errorCode}>404</div>

                <div className={styles.content}>
                    <h1 className={styles.title}>Page Not Found</h1>

                    <p className={styles.description}>
                        Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>

                    <div className={styles.actions}>
                        <Link to="/" className={styles.homeButton}>
                            <i className="fas fa-home"></i>
                            Back to Home
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className={styles.backButton}
                        >
                            <i className="fas fa-arrow-left"></i>
                            Go Back
                        </button>
                    </div>
                </div>

                <div className={styles.illustration}>
                    <div className={styles.astronaut}>
                        <div className={styles.astronautHelmet}></div>
                        <div className={styles.astronautBody}></div>
                        <div className={styles.astronautPack}></div>
                        <div className={styles.astronautArm1}></div>
                        <div className={styles.astronautArm2}></div>
                        <div className={styles.astronautLeg1}></div>
                        <div className={styles.astronautLeg2}></div>
                    </div>
                    <div className={styles.planet}></div>
                    <div className={styles.stars}></div>
                </div>
            </div>
        </section>
    );
}