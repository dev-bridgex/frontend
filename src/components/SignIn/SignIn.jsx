

import { Link } from "react-router-dom";
import { Logo } from "../Logo/Logo";
import style from "./signIn.module.css";


export default function SignIn() {
  return <>


    {/* signInPage */}
    <section className={`${style.signInPage}`}>

      {/* specialContainer */}
      <div className={`specialContainer`}>

        {/* signInContainer */}
        <div className={`${style.signInContainer} shadow  `} >

          {/* signIn-left-panel*/}
          <div className={`${style.signInLeftPanel}  `}>

            <h5 className="d-flex  align-items-center" >
              <i className="fa-solid fa-arrow-left me-2 "></i>
              Back To Home
            </h5>

            <div className={style.logo}>
              <Logo />
            </div>

            <h2>Welcome Back!</h2>
            <p >Continue your learning journey with BridgeX. Access your courses, connect with peers, and enhance your skills.</p>


          </div>

          {/* signIn-right-panel*/}
          <div className={`${style.signInRightPanel}  `}>

            <div className={`${style.formHeader}`}>
              <h4>Sign in to your account</h4>
              <p  >Don&apos;t have an account?

                <Link to={"/signUp"}> Sign Up</Link>
              </p>
            </div>

            {/* form */}
            <form action="">



              {/* email */}
              <div>
                <label className="lableStyle" htmlFor="Email">Email</label>
                <input className="inputStyle" type="text" />
              </div>

              {/* password */}
              <div>
                <label className="lableStyle" htmlFor="Email">Password</label>
                <input className="inputStyle mb-0 " type="text" />
              </div>

              <p className={`${style.forgetPassword}`}>Forgot password?</p>

              {/* submit button */}

              <button className="PrimaryButtonStyle d-flex justify-content-center align-items-center">
                Create account
                <i className="fa-solid fa-arrow-right-long ms-2 "></i>
              </button>

             

            </form>

          </div>
        </div>


      </div>

    </section>


  </>
}



