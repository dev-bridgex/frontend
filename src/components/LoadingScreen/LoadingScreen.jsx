import style from "./LoadingScreen.module.css";
export default function LoadingScreen() {
    return (
        <section className={style.loadingScreen}>
            <div className={style.loaderContainer}>
                <div className={style.pulseLoader}>
                    <div className={style.pulseDot}></div>
                    <div className={style.pulseDot}></div>
                    <div className={style.pulseDot}></div>
                </div>
                <p className={style.loadingText}>Loading...</p>
            </div>
        </section>
    );
}