import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./VerifyResetCode.module.css";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Logo } from '../../../components/Logo/Logo';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function VerifyResetCode() {
    // State management
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Effect to retrieve email from navigation state when component mounts
    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        } else {
            navigate('/RequestResetCode');
        }
    }, [location, navigate]);

    // Form validation schema
    const validationSchema = Yup.object({
        Code: Yup.string()
            .required('Reset code is required')
            .matches(/^[0-9]{4}$/, 'Code must be 4 digits')
    });

    // Form submission handler
    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const { data } = await axios.post(`${baseUrl}/api/users/resetpass/verifycode`, {
                Email: email,
                Code: parseInt(values.Code)
            });

            if (data.StatusCode === 200) {
                setSuccess('Code verified successfully! Redirecting to password reset...');
                setTimeout(() => {
                    navigate('ResetPassword', {
                        state: {
                            email: email,
                            token: data.Data.Token
                        }
                    });
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.Message || 'Failed to verify code. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Formik configuration
    const formik = useFormik({
        initialValues: {
            Code: ''
        },
        validationSchema,
        onSubmit: handleSubmit
    });

    return (
        <section className={styles.verifyResetPage}>
            <div className={styles.verifyResetContainer}>
                {/* Left Panel */}
                <div className={styles.verifyResetLeftPanel}>
                    <Link to="/RequestResetCode" className={styles.backLink}>
                        <i className="fas fa-arrow-left-long"></i>
                        <span>Back To Reset Code</span>
                    </Link>

                    <Logo />

                    <h2 className={styles.title}>Verify Reset Code</h2>

                    <p className={styles.desc}>
                        Enter the 4-digit code you received in your email to reset your password.
                    </p>
                </div>

                {/* Right Panel */}
                <div className={styles.verifyResetRightPanel}>
                    <div className={styles.formHeader}>
                        <h4 className={styles.title}>Enter Verification Code</h4>
                        <p className={styles.emailDisplay}>
                            Code sent to: <strong>{email}</strong>
                        </p>
                    </div>

                    <form onSubmit={formik.handleSubmit} className={styles.verifyResetForm}>
                        <div className={styles.inputWrapper}>
                            <label className={styles.inputLabel} htmlFor="Code">
                                <span className="redStar">*</span>Verification Code
                            </label>
                            <div className={styles.inputContainer}>
                                <i className="fas fa-key"></i>
                                <input
                                    id="Code"
                                    name="Code"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength="4"
                                    placeholder="Enter 4-digit code"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.Code}
                                    className={`${styles.formInput} ${formik.touched.Code && formik.errors.Code ? styles.inputError : ''}`}
                                    autoFocus
                                />
                            </div>
                            {formik.touched.Code && formik.errors.Code && (
                                <div className={styles.errorText}>{formik.errors.Code}</div>
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
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <>
                                    <span>Verify Code</span>
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
