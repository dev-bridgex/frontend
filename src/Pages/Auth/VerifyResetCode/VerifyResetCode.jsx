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
            navigate('/RequestResetCodey');
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
        // verifyResetPage
        <section className={`${styles.verifyResetPage}`}>

            {/* verifyResetContainer */}
            <div className={`${styles.verifyResetContainer} specialContainer`}>

                {/* verifyResetFormWrapper */}
                <div className={`${styles.verifyResetFormWrapper} shadow`}>

                    {/* verifyResetLeftPanel */}
                    <div className={`${styles.verifyResetLeftPanel}`}>
                        <Link to="/RequestResetCode" className={`${styles.backLink}`}>
                            <i className={`fas fa-arrow-left-long me-2`}></i>
                            Back To Reset Code
                        </Link>


                        {/* logo */}
                        <Logo />

                        <h2 className={`${styles.title}`}>Verify Reset Code</h2>

                        <p className={`${styles.desc}`}>
                            Enter the 4-digit code you received in your email to reset your password.
                        </p>
                    </div>

                    {/* verifyResetRightPanel */}
                    <div className={`${styles.verifyResetRightPanel} `}>

                        {/* formHeader */}
                        <div className={`${styles.formHeader}`}>
                            <h4 className={`${styles.title}`}>Enter Verification Code</h4>

                            {/* emailDisplay */}
                            <p className={`${styles.emailDisplay}`}>
                                Code sent to: <strong>{email}</strong>
                            </p>

                        </div>

                        {/* verifyResetForm */}
                        <form onSubmit={formik.handleSubmit} className={`${styles.verifyResetForm} `}>

                            {/* inputWrapper */}
                            <div className={`${styles.inputWrapper} `}>
                                <label className={`lableStyle`} htmlFor="Code">
                                    <span className={`redStar`}>*</span>Verification Code:
                                </label>
                                <input
                                    id="Code"
                                    name="Code"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength="4"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.Code}
                                    className={`inputStyle ${formik.touched.Code && formik.errors.Code ? 'is-invalid' : ''}`}
                                    placeholder="Enter 4-digit code"
                                    autoFocus
                                />
                                {formik.touched.Code && formik.errors.Code && (
                                    <div className="alert alert-danger py-2 mt-1">{formik.errors.Code}</div>
                                )}
                            </div>

                            {/* Display error/success messages */}
                            {error && <div className="alert alert-danger py-2 mt-1">{error}</div>}
                            {success && <div className="alert alert-success py-2 mt-1">{success}</div>}

                            {/* Submit button */}
                            <button
                                type="submit"
                                className={`PrimaryButtonStyle ${styles.submittingButton}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    'Verifying...'
                                ) : (
                                    <>
                                        Verify Code
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