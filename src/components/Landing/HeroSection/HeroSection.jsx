
import style from "./HeroSection.module.css";
import heroImage from "../../../assets/heroSectionImage.png"
export default function HeroSection() {



    return (
        <section className={style.heroSection}>
            <div className={`${style.heroSectionContainer} specialContainer `}>
                <div className={style.heroSectionContent}>
                    <h1>Transform Your Learning Journey with AI-Powered Education</h1>
                    <h4>Join student-led tech teams, learn collaboratively with AI assistance, and grow through structured learning paths and real-world projects.</h4>
                </div>

                <div className={`${style.heroSectionImage} d-flex justify-content-center`}>
                    <img src={heroImage} alt="Hero illustration" />
                </div>
            </div>
        </section>
    );
}



