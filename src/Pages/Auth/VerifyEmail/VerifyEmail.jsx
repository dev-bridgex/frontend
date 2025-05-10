import { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from './VerifyEmail.module.css';
import { Logo } from '../../../components/Logo/Logo';

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function VerifyEmail() {

    // handle state managment
    const hasVerifiedRef = useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const Email = searchParams.get('Email');
    const Token = searchParams.get('Token');
    const navigate = useNavigate();


    useEffect(() => {
        if (Token && Email && !hasVerifiedRef.current) {
            hasVerifiedRef.current = true;
            handleVerification();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // handleVerification
    const handleVerification = async () => {
        setIsSubmitting(true);
        setError('');
        setSuccess('');
        try {
            const { data } = await axios.post(`${baseUrl}/api/users/verify`, { Email, Token });


            if (data.StatusCode === 200) {
                setSuccess('Email verified successfully! Redirecting...');
                setTimeout(() => navigate('/signIn'), 2000);
            }
        } catch (err) {


            const errorMsg = (err.response?.status === 410 ?
                'Link expired' :
                'Verification failed. Please try again.');
            setError(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className={style.verifyEmailPage}>
            <div className={style.verifyEmailContainer}>
                <div className={style.verifyEmailLeftPanel}>
                    <Link to="/signUp" className={style.backLink}>
                        <i className="fas fa-arrow-left-long"></i>
                        <span>Back to Sign Up</span>
                    </Link>

                    <Logo />

                    <h2 className={style.title}>Verify Your Email</h2>

                    <p className={style.desc}>
                        {isSubmitting
                            ? 'Verifying your email...'
                            : success
                                ? 'Verification successful!'
                                : error
                                    ? 'Verification failed. Please check the link or try again.'
                                    : 'We are verifying your email address. Please wait...'}
                    </p>
                </div>

                <div className={style.verifyEmailRightPanel}>
                    <div className={style.formHeader}>
                        <h4 className={style.title}>Email Verification Status</h4>
                        {Email && (
                            <p className={style.emailDisplay}>
                                Verifying: <strong>{Email}</strong>
                            </p>
                        )}
                    </div>

                    <div className={style.statusContainer}>
                        {isSubmitting && (
                            <div className={style.loadingContainer}>
                                <div className={style.animatedSpinner}></div>
                                <p className={style.loadingMessage}>Verifying your email...</p>
                            </div>
                        )}

                        {error && (
                            <div className={`${style.messageAlert} ${style.error}`}>
                                <i className="fas fa-exclamation-circle"></i>
                                <span>{error}</span>
                                <div className={style.actionButtons}>
                                    <Link to="/signIn" className={style.actionButton}>
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className={`${style.messageAlert} ${style.success}`}>
                                <i className="fas fa-check-circle"></i>
                                <span>{success}</span>
                            </div>
                        )}

                        {!Token && (
                            <div className={`${style.messageAlert} ${style.warning}`}>
                                <i className="fas fa-exclamation-triangle"></i>
                                <span>No verification token found. Please check your email for the correct link.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
