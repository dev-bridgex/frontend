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
            .max(20, 'Password cannot exceed 20 characters'),
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
        <section className={`${styles.resetPasswordPage}`}>

            {/* resetPasswordContainer */}
            <div className={`${styles.resetPasswordContainer} specialContainer`}>

                {/* restPasswordFormWrapper */}
                <div className={`${styles.restPasswordFormWrapper} shadow`}>

                    {/* resetPasswordLeftPanel */}
                    <div className={`${styles.resetPasswordLeftPanel}`}>
                        <Link to="/signIn" className={`${styles.backLink}`}>
                            <i className={`fas fa-arrow-left-long me-2`}></i>
                            Back To Sign In
                        </Link>

                        {/* logo */}
                        <Logo />


                        <h2 className={`${styles.title}`}>Reset Your Password</h2>

                        <p className={`${styles.desc}`}>
                            Create a new password for your account. Make sure it&apos;s secure and memorable.
                        </p>
                    </div>

                    {/* resetPasswordRightPanel */}
                    <div className={`${styles.resetPasswordRightPanel}`}>

                        {/* formHeader */}
                        <div className={`${styles.formHeader}`}>
                            <h4 className={`${styles.title}`}>Set New Password</h4>

                            {/* desc */}
                            <p className={`${styles.desc}`}>
                                Remember your password?{' '}
                                <Link to="/signIn" className={`${styles.signInLink}`}>
                                    Sign In
                                </Link>
                            </p>

                            {/* verificationStatus */}
                            <div className={`${styles.verificationStatus}`}>
                                <p>Resetting password for: <strong>{email}</strong></p>
                            </div>
                        </div>

                        {/* resetPasswordForm */}
                        <form onSubmit={formik.handleSubmit} className={`${styles.resetPasswordForm}`}>

                            {/* inputWrapper */}
                            <div className={`${styles.inputWrapper}`}>
                                <label className={`lableStyle`} htmlFor="NewPassword">
                                    <span className={`redStar`}>*</span>New Password:
                                </label>
                                <input
                                    id="NewPassword"
                                    name="NewPassword"
                                    type="password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.NewPassword}
                                    className={`inputStyle ${formik.touched.NewPassword && formik.errors.NewPassword ? 'is-invalid' : ''}`}
                                    placeholder="Enter new password"
                                    autoFocus
                                />
                                {formik.touched.NewPassword && formik.errors.NewPassword && (
                                    <div className="alert alert-danger py-2 mt-1">{formik.errors.NewPassword}</div>
                                )}
                            </div>

                            {/* inputWrapper */}
                            <div className={`${styles.inputWrapper}`}>
                                <label className={`lableStyle`} htmlFor="ConfirmPassword">
                                    <span className={`redStar`}>*</span>Confirm Password:
                                </label>
                                <input
                                    id="ConfirmPassword"
                                    name="ConfirmPassword"
                                    type="password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.ConfirmPassword}
                                    className={`inputStyle ${formik.touched.ConfirmPassword && formik.errors.ConfirmPassword ? 'is-invalid' : ''}`}
                                    placeholder="Confirm new password"
                                />
                                {formik.touched.ConfirmPassword && formik.errors.ConfirmPassword && (
                                    <div className="alert alert-danger py-2 mt-2">{formik.errors.ConfirmPassword}</div>
                                )}
                            </div>

                            {error && <div className="alert alert-danger py-2 mt-1">{error}</div>}
                            {success && <div className="alert alert-success py-2 mt-1">{success}</div>}

                            {/* submittingButton */}
                            <button
                                type="submit"
                                className={`PrimaryButtonStyle ${styles.submittingButton}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    'Resetting...'
                                ) : (
                                    <>
                                        Reset Password
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