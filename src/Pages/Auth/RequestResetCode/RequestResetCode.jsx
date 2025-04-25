import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import styles from "./RequestResetCode.module.css";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Logo } from '../../../components/Logo/Logo';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function RequestResetCode() {

    // state management
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Form validation schema
    const validationSchema = Yup.object({
        Email: Yup.string()
            .required('Email is required')
            .email('Please enter a valid email address')
    });

    // Form submission handler
    const handleSubmit = async (values) => {

        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const { data } = await axios.post(`${baseUrl}/api/users/resetpass/sendcode`, values);



            if (data.StatusCode === 200) {

                setSuccess('Reset code has been sent to your email. Please check your inbox.');
                setTimeout(() => navigate("VerifyResetCode", { state: { email: values.Email } }), 2000);

            }
        } catch (err) {
            setError(err.response?.data?.Message || 'Failed to send reset code. Please try again.');

        } finally {
            setIsSubmitting(false);
        }
    };

    // Formik configuration
    const formik = useFormik({
        initialValues: {
            Email: ''
        },
        validationSchema,
        onSubmit: handleSubmit
    });

    return (
        // requestResetPage
        <section className={`${styles.requestResetPage}`}>

            {/* requestResetContainer */}
            <div className={`${styles.requestResetContainer} specialContainer`}>

                {/* requestRestFormWrapper */}
                <div className={`${styles.requestRestFormWrapper} shadow`}>

                    {/* requestResetLeftPanel */}
                    <div className={`${styles.requestResetLeftPanel}`}>

                        {/* backLink */}
                        <Link to="/signIn" className={`${styles.backLink}`}>
                            <i className={`fas fa-arrow-left-long me-2`}></i>
                            Back To Sign In
                        </Link>
                        
                        {/* logo */}
                        <Logo />


                        <h2 className={`${styles.title}`}>Reset Your Password</h2>

                        <p className={`${styles.desc}`}>
                            Enter your email address to receive a password reset code.
                        </p>

                    </div>

                    {/* requestResetRightPanel */}
                    <div className={`${styles.requestResetRightPanel}`}>

                        {/* formHeader */}
                        <div className={`${styles.formHeader}`}>
                            <h4 className={`${styles.title}`}>Request Reset Code</h4>

                            {/* desc */}
                            <p className={`${styles.desc}`}>
                                Remember your password?{' '}
                                <Link to="/signIn" className={`${styles.signInLink}`}>
                                    Sign In
                                </Link>
                            </p>

                        </div>

                        {/* requestResetForm */}
                        <form onSubmit={formik.handleSubmit} className={`${styles.requestResetForm}`}>


                            {/* inputWrapper */}
                            <div className={`${styles.inputWrapper}`}>
                                <label className={`lableStyle`} htmlFor="Email">
                                    <span className={`redStar`}>*</span>Email:
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
                                    <div className="alert alert-danger py-2 mt-1">{formik.errors.Email}</div>
                                )}
                            </div>

                            {error && <div className="alert alert-danger py-2 mt-1 ">{error}</div>}
                            {success && <div className="alert alert-success py-2 mt-1 ">{success}</div>}

                            {/* submittingButton */}
                            <button
                                type="submit"
                                className={`PrimaryButtonStyle ${styles.submittingButton}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    'Sending code...'
                                ) : (
                                    <>
                                        Send Reset Code
                                        <i className={`fas fa-arrow-right-long ms-2`}></i>
                                    </>
                                )}
                            </button>

                        </form>
                    </div>

                </div>

            </div>
        </section>
    );
}