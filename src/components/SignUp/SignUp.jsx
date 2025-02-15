
import { Link } from "react-router-dom";
import { Logo } from "../Logo/Logo";
import style from "./SignUp.module.css";

export default function SignUp() {
  return <>


    {/* signUpPage */}
    <section className={`${style.signUpPage}`}>

      {/* specialContainer */}
      <div className={`specialContainer`}>

        {/* signUpContainer */}
        <div className={`${style.signUpContainer} shadow  `} >
          {/* signUp-left-panel*/}
          <div className={`${style.signUpLeftPanel}  `}>

            <h5 className="d-flex  align-items-center" >
              <i className="fa-solid fa-arrow-left me-2 "></i>
              Back To Home
            </h5>

            <div className={style.logo}>
              <Logo />
            </div>

            <h2>Join BridgeX</h2>
            <p >Start your learning journey with BridgeX. Join our community of learners and unlock your potential.</p>


          </div>

          {/* signUp-right-panel*/}
          <div className={`${style.signUpRightPanel}  `}>

            <div className={`${style.formHeader}`}>
              <h4>Create your account </h4>
              <p  >Already have an account? <Link to="/signIn">Sign In</Link></p>
            </div>

            {/* form */}
            <form action="">

              {/* first name */}
              <div>
                <label className="lableStyle" htmlFor="Email">Frist Name</label>
                <input className="inputStyle" type="email" />
              </div>

              {/* last name */}
              <div>
                <label className="lableStyle" htmlFor="Email">Last Name</label>
                <input className="inputStyle" type="text" />
              </div>

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



