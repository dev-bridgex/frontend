import { useState } from 'react';
import { Link } from "react-router-dom";
import style from "./SignIn.module.css";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Logo } from '../../../components/Logo/Logo';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function SignIn() {

  // state managment
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation schema
  const validationSchema = Yup.object({
    Email: Yup.string()
      .required('Email is required')
      .email('Please enter a valid email address'),
    Password: Yup.string()
      .required('Password is required')
  });

  // Form submission handler
  const handleSubmit = async (values) => {

    setIsSubmitting(true);

    try {
      const { data } = await axios.post(`${baseUrl}/api/users/login`, values);

      // Show success message
      if (data.StatusCode === 200) {


        toast.success('Login successful! Redirecting...', {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });


        localStorage.setItem("token", data?.Data?.JWT)

        setTimeout(() => {
          window.location.replace('/');
        }, 300);

      }


    } catch (err) {


      // show error message
      toast.error(err.response.data.Message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });


    } finally {
      setIsSubmitting(false);
    }
  };


  // Formik configuration
  const formik = useFormik({
    initialValues: {
      Email: '',
      Password: ''
    },
    validationSchema,
    onSubmit: handleSubmit
  });

  return (
    <>

      {/* signInPage */}
      <section className={`${style.signInPage} `}>

        {/* signInContainer */}
        <div className={`specialContainer`}>

          <div className={`${style.signInContainer} shadow`}>
            {/* signInLeftPanel */}
            <div className={`${style.signInLeftPanel}`}>

              {/* backLink */}
              <Link to="/" className={`${style.backLink}`}>
                <i className={`fas fa-arrow-left-long me-2`}></i>
                Back To Home
              </Link>

              {/* logo */}
              <Logo />

              <h2 className={`${style.title}`}>Welcome Back!</h2>

              <p className={`${style.desc}`}>
                Continue your learning journey with BridgeX. Access your courses,
                connect with peers, and enhance your skills.
              </p>
            </div>

            {/* signInRightPanel */}
            <div className={`${style.signInRightPanel}`}>

              {/* formHeader */}
              <div className={`${style.formHeader}`}>

                <h4 className={`${style.title}`}>Sign in to your account</h4>
                <p className={`${style.desc}`}>
                  Don&apos;t have an account?{' '}
                  <Link to="/signUp" className={`${style.signUpLink}`}>
                    Sign Up
                  </Link>
                </p>
              </div>

              {/* signInForm */}
              <form onSubmit={formik.handleSubmit} className={`${style.signInForm} `}>

                {/* inputWrapper */}
                <div className={`${style.inputWrapper}`}>
                  <label className="lableStyle" htmlFor="Email">
                    Email:
                  </label>
                  <input
                    id="Email"
                    name="Email"
                    type="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.Email}
                    className={`inputStyle ${formik.touched.Email && formik.errors.Email ? 'is-invalid' : ''}`}
                  />
                  {formik.touched.Email && formik.errors.Email && (
                    <div className="alert alert-danger py-2 mt-2">{formik.errors.Email}</div>
                  )}
                </div>

                {/* inputWrapper */}
                <div className={`${style.inputWrapper} `}>
                  <label className="lableStyle" htmlFor="Password">
                    Password:
                  </label>
                  <input
                    id="Password"
                    name="Password"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.Password}
                    className={`inputStyle ${formik.touched.Password && formik.errors.Password ? 'is-invalid' : ''}`}
                  />
                  {formik.touched.Password && formik.errors.Password && (
                    <div className="alert alert-danger py-2 mt-2">{formik.errors.Password}</div>
                  )}
                </div>

                {/* forgetPassword */}
                <Link to="/RequestResetCode" className={`${style.forgetPassword} `}>
                  Forgot password?
                </Link>


                {/* Submit Button */}
                <button
                  type="submit"
                  className={`PrimaryButtonStyle ${style.submittingButon}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Signing in...'
                  ) : (
                    <>
                      Sign In
                      <i className={`fas fa-arrow-right-long ms-2`}></i>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}