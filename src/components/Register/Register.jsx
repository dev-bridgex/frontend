
import style from "./Register.module.css";

export default function Register() {
  return <>


    {/* registerPage */}
    <section className={`${style.registerPage}`}>

      {/* registerContainer */}
      <div className={`${style.registerContainer} specialContainer redborder`}>

        {/* reg-left-panel*/}
        <div className={`${style.regLeftPanel} blueborder`}>

          <h6>Back To Home</h6>
          <h2>Welcome Back!</h2>
          <p>Start your learning journey with BridgeX. Join our community of learners and unlock your potential.</p>


        </div>

        {/* reg-right-panel*/}
        <div className={`${style.regRightPanel} blueborder`}>

          <h2 className="h3Style">Create your account
          </h2>
          <p className="pStyle">Already have an account? <span> Sign in</span></p>

          {/* form */}
          <form className="goldborder" action="">

            {/* first name */}
            <label className="lableStyle" htmlFor="Email">Frist Name</label>
            <input  className="inputStyle" type="text" />

            {/* last name */}
            <label className="lableStyle" htmlFor="Email">Last Name</label>
            <input  className="inputStyle" type="text" />

            {/* email */}
            <label className="lableStyle" htmlFor="Email">Email</label>
            <input  className="inputStyle" type="text" />

            {/* password */}
            <label className="lableStyle" htmlFor="Email">Password</label>
            <input  className="inputStyle" type="text" />

            {/* submit button */}

            <button>Create account</button>

          </form>

        </div>



      </div>

    </section>


  </>
}



