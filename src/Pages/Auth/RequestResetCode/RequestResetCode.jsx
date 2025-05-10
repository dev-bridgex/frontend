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
        <section className={styles.requestResetPage}>
            <div className="specialContainer">
                <div className={styles.requestResetContainer}>
                    {/* Left Panel */}
                    <div className={styles.requestResetLeftPanel}>
                        <Link to="/signIn" className={styles.backLink}>
                            <i className="fas fa-arrow-left-long"></i>
                            <span>Back To Sign In</span>
                        </Link>

                        <Logo />

                        <h2 className={styles.title}>Reset Your Password</h2>

                        <p className={styles.desc}>
                            Enter your email address to receive a password reset code.
                        </p>
                    </div>

                    {/* Right Panel */}
                    <div className={styles.requestResetRightPanel}>
                        <div className={styles.formHeader}>
                            <h4 className={styles.title}>Request Reset Code</h4>
                            <p className={styles.desc}>
                                Remember your password?{' '}
                                <Link to="/signIn" className={styles.signInLink}>
                                    Sign In
                                </Link>
                            </p>
                        </div>

                        <form onSubmit={formik.handleSubmit} className={styles.requestResetForm}>
                            <div className={styles.inputWrapper}>
                                <label className={styles.inputLabel} htmlFor="Email">
                                    <span className="redStar">*</span>Email
                                </label>
                                <div className={styles.inputContainer}>
                                    <i className="far fa-envelope"></i>
                                    <input
                                        id="Email"
                                        name="Email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.Email}
                                        className={`${styles.formInput} ${formik.touched.Email && formik.errors.Email ? styles.inputError : ''}`}
                                    />
                                </div>
                                {formik.touched.Email && formik.errors.Email && (
                                    <div className={styles.errorText}>{formik.errors.Email}</div>
                                )}
                            </div>

                            {error && (
                                <div className={`${styles.messageAlert} ${styles.error}`}>
                                    <i className="fas fa-exclamation-circle"></i>
                                    <span>{error}</span>
                                </div>
                            )}

                            {success && (
                                <div className={`${styles.messageAlert} ${styles.success}`}>
                                    <i className="fas fa-check-circle"></i>
                                    <span>{success}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className={styles.spinner}></span>
                                        <span>Sending code...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Reset Code</span>
                                        <i className="fas fa-arrow-right-long"></i>
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
