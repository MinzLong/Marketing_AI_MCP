import React from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import useGoogleAuth from '../../hooks/useGoogleAuth';

const GoogleAuthButton = ({ onSuccess, onError, disabled = false, type = 'signin', isRegistration = false }) => {
    const { registerWithGoogle, loginWithGoogle, isLoading, error } = useGoogleAuth();

    const handleGoogleAuth = async () => {
        try {
            // These functions redirect to Google OAuth, they don't return results
            // The actual result handling happens in GoogleAuthCallback component
            if (isRegistration) {
                registerWithGoogle(); // No await needed - this redirects
            } else {
                loginWithGoogle(); // No await needed - this redirects
            }

            // Don't call onSuccess here since we're redirecting to Google
            // The success/error handling happens in the callback component

        } catch (err) {
            console.error('Error initiating Google OAuth:', err);
            if (onError) {
                onError(err);
            }
        }
    };

    return (
        <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={disabled || isLoading}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50px',
                height: '50px',
                border: '2px solid rgba(108, 114, 147, 0.2)',
                borderRadius: '15px',
                fontSize: '22px',
                color: '#6c7293',
                textDecoration: 'none',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden',
                cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
                opacity: disabled || isLoading ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
                if (!disabled && !isLoading) {
                    e.target.style.transform = 'translateY(-5px) scale(1.05)';
                    e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                    e.target.style.background = 'linear-gradient(135deg, #db4437, #e57373)';
                    e.target.style.borderColor = '#db4437';
                    e.target.style.color = '#fff';
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled && !isLoading) {
                    e.target.style.transform = 'none';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = 'rgba(255, 255, 255, 0.5)';
                    e.target.style.borderColor = 'rgba(108, 114, 147, 0.2)';
                    e.target.style.color = '#6c7293';
                }
            }}
        >
            {isLoading ? (
                <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #f3f3f3',
                    borderTop: '2px solid #db4437',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
            ) : (
                <GoogleIcon style={{ fontSize: '22px' }} />
            )}

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </button>
    );
};

export default GoogleAuthButton;
