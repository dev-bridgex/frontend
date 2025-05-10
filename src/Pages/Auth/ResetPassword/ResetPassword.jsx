import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./ResetPassword.module.css";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Logo } from '../../../components/Logo/Logo';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function ResetPassword() {

    // state managment
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Get email and token from navigation state
    useEffect(() => {
        if (location.state?.email && location.state?.token) {
            setEmail(location.state.email);
            setToken(location.state.token);
        } else {
            navigate('/signIn');
        }
    }, [location, navigate]);

    //validation schema
    const validationSchema = Yup.object({
        NewPassword: Yup.string()
            .required('Password is required')
            .min(7, 'Password must be at least 7 characters')
            .max(20, 'Password cannot exceed 20 characters')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,20}$/,
                'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            ),
        ConfirmPassword: Yup.string()
            .required('Please confirm your password')
            .oneOf([Yup.ref('NewPassword')], 'Passwords must match')
    });

    // Form submission handler
    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const { data } = await axios.post(`${baseUrl}/api/users/resetpass`, {
                NewPassword: values.NewPassword,
                ConfirmPassword: values.ConfirmPassword,
                Email: email,
                Token: token
            });



            if (data.StatusCode === 200) {
                setSuccess('Password reset successfully! Redirecting to Sign in...');
                setTimeout(() => {
                    navigate('/signIn');
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.Message || 'Failed to reset password. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Formik configuration
    const formik = useFormik({
        initialValues: {
            NewPassword: '',
            ConfirmPassword: ''
        },
        validationSchema,
        onSubmit: handleSubmit
    });

    return (

        // resetPasswordPage
        <section className={styles.resetPasswordPage}>

            {/* resetPasswordContainer */}
            <div className={styles.resetPasswordContainer}>

                {/* Left Panel */}
                <div className={styles.resetPasswordLeftPanel}>
                    <Link to="/signIn" className={styles.backLink}>
                        <i className="fas fa-arrow-left-long"></i>
                        <span>Back To Sign In</span>
                    </Link>

                    <Logo />

                    <h2 className={styles.title}>Reset Your Password</h2>

                    <p className={styles.desc}>
                        Create a new password for your account. Make sure it&apos;s secure and memorable.
                    </p>
                </div>

                {/* Right Panel */}
                <div className={styles.resetPasswordRightPanel}>
                    <div className={styles.formHeader}>
                        <h4 className={styles.title}>Set New Password</h4>
                        <p className={styles.desc}>
                            Remember your password?{' '}
                            <Link to="/signIn" className={styles.signInLink}>
                                Sign In
                            </Link>
                        </p>
                        <div className={styles.emailDisplay}>
                            <p>Resetting password for: <strong>{email}</strong></p>
                        </div>
                    </div>

                    <form onSubmit={formik.handleSubmit} className={styles.resetPasswordForm}>
                        <div className={styles.inputWrapper}>
                            <label className={styles.inputLabel} htmlFor="NewPassword">
                                <span className="redStar">*</span>New Password
                            </label>
                            <div className={styles.inputContainer}>
                                <i className="fas fa-lock"></i>
                                <input
                                    id="NewPassword"
                                    name="NewPassword"
                                    type="password"
                                    placeholder="Enter new password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.NewPassword}
                                    className={`${styles.formInput} ${formik.touched.NewPassword && formik.errors.NewPassword ? styles.inputError : ''}`}
                                    autoFocus
                                />
                            </div>
                            {formik.touched.NewPassword && formik.errors.NewPassword && (
                                <div className={styles.errorText}>{formik.errors.NewPassword}</div>
                            )}
                        </div>

                        <div className={styles.inputWrapper}>
                            <label className={styles.inputLabel} htmlFor="ConfirmPassword">
                                <span className="redStar">*</span>Confirm Password
                            </label>
                            <div className={styles.inputContainer}>
                                <i className="fas fa-lock-open"></i>
                                <input
                                    id="ConfirmPassword"
                                    name="ConfirmPassword"
                                    type="password"
                                    placeholder="Confirm new password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.ConfirmPassword}
                                    className={`${styles.formInput} ${formik.touched.ConfirmPassword && formik.errors.ConfirmPassword ? styles.inputError : ''}`}
                                />
                            </div>
                            {formik.touched.ConfirmPassword && formik.errors.ConfirmPassword && (
                                <div className={styles.errorText}>{formik.errors.ConfirmPassword}</div>
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
                                    <span>Resetting Password...</span>
                                </>
                            ) : (
                                <>
                                    <span>Reset Password</span>
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

