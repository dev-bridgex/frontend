import { useState } from 'react';
import { Link } from "react-router-dom";
import style from "./SignIn.module.css";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Logo } from '../../../components/Logo/Logo';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function SignIn() {
  // state management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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
    setMessage({ type: '', text: '' });

    try {
      const { data } = await axios.post(`${baseUrl}/api/users/login`, values);

      // Show success message
      if (data.StatusCode === 200) {
        setMessage({ 
          type: 'success', 
          text: 'Login successful! Redirecting...' 
        });

        localStorage.setItem("token", data?.Data?.JWT);

        setTimeout(() => {
          window.location.replace('/');
        }, 1000);
      }
    } catch (err) {
      // Show error message
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.Message || 'Login failed. Please try again.' 
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
    <section className={style.signInPage}>
      <div className={style.signInContainer}>
        {/* Left Panel */}
        <div className={style.signInLeftPanel}>
          <Link to="/" className={style.backLink}>
            <i className="fas fa-arrow-left-long"></i>
            <span>Back To Home</span>
          </Link>

          <Logo />

          <h2 className={style.title}>Welcome Back!</h2>

          <p className={style.desc}>
            Continue your learning journey with BridgeX. Access your courses,
            connect with peers, and enhance your skills.
          </p>
        </div>

        {/* Right Panel */}
        <div className={style.signInRightPanel}>
          <div className={style.formHeader}>
            <h4 className={style.title}>Sign in to your account</h4>
            <p className={style.desc}>
              Don&apos;t have an account?{' '}
              <Link to="/signUp" className={style.signUpLink}>
                Sign Up
              </Link>
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className={style.signInForm}>
            <div className={style.inputWrapper}>
              <label className={style.inputLabel} htmlFor="Email">
                Email
              </label>
              <div className={style.inputContainer}>
                <i className="far fa-envelope"></i>
                <input
                  id="Email"
                  name="Email"
                  type="email"
                  placeholder="Enter your email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.Email}
                  className={`${style.formInput} ${formik.touched.Email && formik.errors.Email ? style.inputError : ''}`}
                />
              </div>
              {formik.touched.Email && formik.errors.Email && (
                <div className={style.errorText}>{formik.errors.Email}</div>
              )}
            </div>

            <div className={style.inputWrapper}>
              <label className={style.inputLabel} htmlFor="Password">
                Password
              </label>
              <div className={style.inputContainer}>
                <i className="fas fa-lock"></i>
                <input
                  id="Password"
                  name="Password"
                  type="password"
                  placeholder="Enter your password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.Password}
                  className={`${style.formInput} ${formik.touched.Password && formik.errors.Password ? style.inputError : ''}`}
                />
              </div>
              {formik.touched.Password && formik.errors.Password && (
                <div className={style.errorText}>{formik.errors.Password}</div>
              )}
            </div>

            <Link to="/RequestResetCode" className={style.forgetPassword}>
              Forgot password?
            </Link>

            {message.text && (
              <div className={`${style.messageAlert} ${style[message.type]}`}>
                <i className={message.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}></i>
                <span>{message.text}</span>
              </div>
            )}

            <button
              type="submit"
              className={style.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={style.spinner}></span>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <i className="fas fa-arrow-right-long"></i>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
