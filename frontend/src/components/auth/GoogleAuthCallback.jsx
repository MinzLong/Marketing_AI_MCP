import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useGoogleAuth from '../../hooks/useGoogleAuth';

const GoogleAuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { handleGoogleCallback } = useGoogleAuth();
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('Processing Google authentication...');

    useEffect(() => {
        const processCallback = async () => {
            const code = searchParams.get('code');
            const error = searchParams.get('error');

            if (error) {
                setStatus('error');
                setMessage(`Authentication failed: ${error}`);
                setTimeout(() => navigate('/login'), 3000);
                return;
            }

            if (!code) {
                setStatus('error');
                setMessage('No authorization code received');
                setTimeout(() => navigate('/login'), 3000);
                return;
            }

            try {
                const result = await handleGoogleCallback(code);
                setStatus('success');
                setMessage('Authentication successful! Redirecting...');

                // Redirect to dashboard or home page after successful login
                setTimeout(() => navigate('/dashboard'), 2000);
            } catch (err) {
                setStatus('error');
                setMessage(`Authentication failed: ${err.message}`);
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        processCallback();
    }, [searchParams, handleGoogleCallback, navigate]);

    const getStatusColor = () => {
        switch (status) {
            case 'success': return '#4caf50';
            case 'error': return '#f44336';
            default: return '#2196f3';
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
            textAlign: 'center'
        }}>
            <div style={{
                padding: '40px',
                borderRadius: '8px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                maxWidth: '400px',
                width: '100%'
            }}>
                {status === 'processing' && (
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #2196f3',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }} />
                )}

                {status === 'success' && (
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#4caf50',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        color: '#fff',
                        fontSize: '20px'
                    }}>
                        ✓
                    </div>
                )}

                {status === 'error' && (
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#f44336',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        color: '#fff',
                        fontSize: '20px'
                    }}>
                        ✕
                    </div>
                )}

                <h2 style={{
                    color: getStatusColor(),
                    marginBottom: '10px',
                    fontSize: '18px'
                }}>
                    Google Authentication
                </h2>

                <p style={{
                    color: '#666',
                    margin: '0',
                    fontSize: '14px'
                }}>
                    {message}
                </p>
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default GoogleAuthCallback;
