
import style from "./HeroSection.module.css";
import heroImage from "../../../assets/heroSectionImage.png"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
export default function HeroSection() {


    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); // Convert to boolean
    }, []);

    return <>

        {/* heroSection */}
        <section className={`${style.heroSection}`}>

            {/* heroSectionContainer */}
            <div className={`${style.heroSectionContainer} specialContainer`}>

                {/* heroSectionContent */}
                <div className={`${style.heroSectionContent}`}>
                    <h1>Transform Your Learning Journey with AI-Powered Education</h1>
                    <h4>BridgeX connects university students with cutting-edge learning tools, vibrant communities, and personalized AI assistance.</h4>

                    {/* heroContentBtn */}
                    <div className={`${style.heroContentBtn}`}>
                        {!isLoggedIn && (
                            <Link to="/SignIn">
                                <button className={`${style.heroSignInBtn} ButtonStyle`}>Sign In</button>
                            </Link>
                        )}

                        <Link to="/SignUp">
                            <button className={`${style.heroSignUpBtn} ButtonStyle`}>Sign Up</button>
                        </Link>

                    </div>
                </div>





                {/* heroSectionImage */}
                <div className={`${style.heroSectionImage}  d-flex justify-content-center `}>
                    <img src={heroImage} className="" alt="" />
                </div>




            </div>



        </section>


    </>
}
