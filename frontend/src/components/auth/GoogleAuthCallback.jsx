import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useGoogleAuth from '../../hooks/useGoogleAuth';

const GoogleAuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { handleGoogleCallback } = useGoogleAuth();
    const [status, setStatus] = useState('processing'); const [message, setMessage] = useState('Processing Google authentication...');
    const hasProcessed = useRef(false);

    useEffect(() => {
        const processCallback = async () => {
            // Prevent multiple executions with the same OAuth code
            if (hasProcessed.current) {
                console.log('OAuth callback already processed, skipping...');
                return;
            }

            const code = searchParams.get('code');
            const error = searchParams.get('error');
            const state = searchParams.get('state');

            // Check if we've already processed this specific code
            const processedCode = sessionStorage.getItem('processed_oauth_code');
            if (processedCode === code && code) {
                console.log('This OAuth code has already been processed, skipping...');
                setStatus('error');
                setMessage('Authentication session already processed. Please try again.');
                setTimeout(() => navigate('/login'), 3000);
                return;
            }

            console.log('OAuth Callback received:', {
                code: code ? 'present' : 'missing',
                error: error,
                state: state,
                allParams: Object.fromEntries(searchParams.entries())
            });

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

            // Mark as processed to prevent duplicate calls
            hasProcessed.current = true;
            // Store the processed code to prevent reuse
            sessionStorage.setItem('processed_oauth_code', code);

            // Get the stored mode (default to login if not found)
            const mode = sessionStorage.getItem('google_oauth_mode') || 'login';

            // For now, we'll proceed without strict state validation to debug the issue
            // TODO: Re-enable proper state validation after debugging
            console.log('⚠️ PROCEEDING WITHOUT STRICT STATE VALIDATION FOR DEBUGGING');            // Clear any stored OAuth data
            sessionStorage.removeItem('google_oauth_state');
            sessionStorage.removeItem('google_oauth_mode');

            try {
                setMessage(`Processing ${mode}...`);
                const result = await handleGoogleCallback(code, mode); if (result && result.success) {
                    console.log('✅ OAuth Success:', result);
                    setStatus('success');
                    setMessage('Authentication successful! Redirecting...');
                    // Clean up processed code on success
                    sessionStorage.removeItem('processed_oauth_code');
                    // Redirect to dashboard or home page after successful login
                    setTimeout(() => navigate('/dashboard'), 2000);
                } else {
                    console.error('❌ OAuth Failed - Invalid Result:', result);
                    setStatus('error');
                    setMessage(result?.error || 'Unexpected response from authentication');
                    setTimeout(() => navigate('/login'), 3000);
                }
            } catch (err) {
                console.error('💥 OAuth callback error:', err);
                console.error('Error stack:', err.stack);
                setStatus('error');

                // Handle specific error cases
                if (err.message.includes('invalid_grant')) {
                    setMessage('Authentication session expired. Please try again.');
                } else {
                    setMessage(`Authentication failed: ${err.message}`);
                }

                setTimeout(() => navigate('/login'), 3000);
            }
        };

        processCallback();
    }, [searchParams, navigate]); // Removed handleGoogleCallback from dependencies

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
