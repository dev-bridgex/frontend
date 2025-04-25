import { useState } from 'react';
import { Link } from "react-router-dom";
import style from "./SignUp.module.css";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Logo } from '../../../components/Logo/Logo';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function SignUp() {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form validation schema
  const validationSchema = Yup.object({
    FirstName: Yup.string()
      .required('First name is required')
      .max(50, 'First name cannot exceed 50 characters')
      .matches(/^[A-Za-z]+$/, 'First name can only contain letters'),

    LastName: Yup.string()
      .required('Last name is required')
      .max(50, 'Last name cannot exceed 50 characters')
      .matches(/^[A-Za-z]+$/, 'Last name can only contain letters'),

    StudentId: Yup.string()
      .nullable()
      .max(50, 'Student ID cannot exceed 50 characters')
      .matches(/^\d*$/, 'Student ID must contain only numbers'),

    PhoneNumber: Yup.string()
      .required('Phone number is required')
      .matches(
        /^01[0-2,5][0-9]{8}$/,
        'Must be a valid Egyptian phone number (11 digits starting with 010, 011, 012, or 015)'
      )
      .test(
        'exact-length',
        'Phone number must be exactly 11 digits',
        (value) => value?.length === 11
      )
      .nullable(false),
    Usertype: Yup.string()
      .oneOf(['STUDENT', 'EXTERNAL'], 'User type must be STUDENT or EXTERNAL')
      .default('STUDENT'),

    Email: Yup.string()
      .required('Email is required')
      .email('Please enter a valid email address'),

    Password: Yup.string()
      .required('Password is required')
      .min(7, 'Password must be at least 7 characters')
      .max(20, 'Password cannot exceed 20 characters'),

    ConfirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('Password')], 'Passwords must match')
      .min(7, 'Password must be at least 7 characters')
      .max(20, 'Password cannot exceed 20 characters')
  });

  // Form submission handler
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');



    try {
      const { data } = await axios.post(`${baseUrl}/api/users/signup`, values);

      if (data.StatusCode === 201) {
        setSuccess('Check your email (inbox or spam) to verify your account.');
      }
    } catch (err) {


      setError(err.response.data.Data[0].Error || err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      FirstName: '',
      LastName: '',
      StudentId: '',
      PhoneNumber: '',
      Usertype: 'STUDENT',
      Email: '',
      Password: '',
      ConfirmPassword: ''
    },
    validationSchema,
    onSubmit: handleSubmit
  });

  // Form fields configuration
  const formFields = [
    { name: "FirstName", label: "First Name", type: "text", required: true },
    { name: "LastName", label: "Last Name", type: "text", required: true },
    { name: "StudentId", label: "Student ID", type: "text", required: true },
    { name: "PhoneNumber", label: "Phone Number", type: "tel", required: true },
    {
      name: "Usertype",
      label: "User Type",
      type: "select",
      options: ["STUDENT"],
      required: true
    },
    { name: "Email", label: "Email", type: "email", required: true },
    { name: "Password", label: "Password", type: "password", required: true },
    { name: "ConfirmPassword", label: "Confirm Password", type: "password", required: true },
  ];

  // Group fields into pairs for layout
  const groupFields = formFields.reduce((acc, curr, index) => {
    const chunkIndex = Math.floor(index / 2);
    if (!acc[chunkIndex]) acc[chunkIndex] = [];
    acc[chunkIndex].push(curr);
    return acc;
  }, []);

  return (
    <section className={`${style.signUpPage} `}>

      <div className={`${style.signUpContainer} specialContainer shadow `}>
        
        <div className={`${style.signUpLeftPanel} `}>
          <Link to="/" className={`${style.backLink}`}>
            <i className={`fas fa-arrow-left-long me-2`}></i>
            Back To Home
          </Link>


          {/* logo */}
          <Logo />

          <h2 className={`${style.title}`}>Join BridgeX</h2>

          <p className={`${style.desc}`}>
            Start your learning journey with BridgeX. Join our community of
            learners and unlock your potential.
          </p>
        </div>

        <div className={`${style.signUpRightPanel} `}>
          <div className={`${style.formHeader}`}>
            <h4 className={`${style.title}`}>Create your account</h4>
            <p className={`${style.desc}`}>
              Already have an account?{' '}
              <Link to="/signIn" className={`${style.signInLink}`}>
                Sign In
              </Link>
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className={`${style.signUpForm}`}>

            {/* inputsContainer */}
            <div className={`${style.inputsContainer}`}>
              {groupFields.map((fieldGroup, index) => (


                <div key={index} className={`${style.inputGroup}`}>
                  {fieldGroup.map((field) => (
                    <div key={field.name} className={` ${style.inputWrapper}`}>
                      <label className={`lableStyle`} htmlFor={field.name}>
                        {field.required && <span className={`redStar `}>*</span>}
                        {field.label}:
                      </label>

                      {field.type === "select" ? (
                        <select
                          id={field.name}
                          name={field.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values[field.name]}
                          className={`form-control ${formik.touched[field.name] && formik.errors[field.name] ? 'is-invalid' : ''}`}
                        >
                          {field.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id={field.name}
                          name={field.name}
                          type={field.type}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values[field.name]}
                          className={`inputStyle ${formik.touched[field.name] && formik.errors[field.name] ? 'is-invalid' : ''}`}
                        />
                      )}

                      {formik.touched[field.name] && formik.errors[field.name] && (
                        <div className="alert alert-danger py-2 mt-1">{formik.errors[field.name]}</div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>


            {error && <div className="alert alert-danger py-2 mt-1">{error}</div>}
            {success && <div className="alert alert-success py-2 mt-1">{success}</div>}

            {/* submittingButon */}
            <button type="submit"

              className={`PrimaryButtonStyle ${style.submittingButon}`}
            >
              {isSubmitting ? (
                'Creating account...'
              ) : (
                <>
                  Create account
                  <i className={`fas fa-arrow-right-long ms-2`}></i>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}