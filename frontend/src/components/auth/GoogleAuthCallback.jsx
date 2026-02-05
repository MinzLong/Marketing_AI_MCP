import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useGoogleAuth from '../../hooks/useGoogleAuth';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

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
            }); if (error) {
                setStatus('error');
                setMessage(`Authentication failed: ${error}`);
                // Store error message for login page to show toast
                sessionStorage.setItem('auth_error_message', `Authentication failed: ${error}`);
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            if (!code) {
                setStatus('error');
                setMessage('No authorization code received');
                // Store error message for login page to show toast
                sessionStorage.setItem('auth_error_message', 'No authorization code received');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            hasProcessed.current = true;

            sessionStorage.setItem('processed_oauth_code', code);

            const mode = sessionStorage.getItem('google_oauth_mode') || 'login';

            // TODO: Re-enable proper state validation after debugging
            console.log('⚠️ PROCEEDING WITHOUT STRICT STATE VALIDATION FOR DEBUGGING');
            // Clear any stored OAuth data
            sessionStorage.removeItem('google_oauth_state');
            sessionStorage.removeItem('google_oauth_mode'); try {
                setMessage(`Processing ${mode}...`);
                const result = await handleGoogleCallback(code, mode); if (result && result.success) {
                    console.log('✅ OAuth Success:', result);
                    setStatus('success');
                    setMessage('Authentication successful! Redirecting...');

                    // Clean up processed code on success
                    sessionStorage.removeItem('processed_oauth_code');

                    // Store success message for dashboard to show toast
                    const successMsg = mode === 'register' ? 'Registration successful! Welcome' : 'Login successful! Welcome back';
                    console.log('Storing success message in sessionStorage:', successMsg);
                    sessionStorage.setItem('auth_success_message', successMsg);

                    // Navigate to dashboard (toast will show there)
                    setTimeout(() => navigate('/dashboard'), 1500);
                } else {
                    console.error('❌ OAuth Failed - Invalid Result:', result);
                    setStatus('error');
                    setMessage(result?.error || 'Unexpected response from authentication');

                    // Store error message for login page to show toast
                    sessionStorage.setItem('auth_error_message', result?.error || 'Authentication failed. Please try again');
                    setTimeout(() => navigate('/login'), 2000);
                }
            } catch (err) {
                console.error('💥 OAuth callback error:', err);
                console.error('Error stack:', err.stack);
                setStatus('error');

                // Handle specific error cases
                let errorMessage = 'Authentication failed. Please try again';
                if (err.message.includes('invalid_grant')) {
                    errorMessage = 'Authentication session expired. Please try again';
                } else if (err.message) {
                    errorMessage = err.message;
                } setMessage(errorMessage);

                // Store error message for login page to show toast
                sessionStorage.setItem('auth_error_message', errorMessage);
                setTimeout(() => navigate('/login'), 2000);
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
        <div className="login-register-page">
            <div className="container">
                <div className="form-box login" style={{
                    width: '100%',
                    right: '0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '50px'
                }}>
                    <h1 style={{ marginBottom: '30px' }}>
                        {status === 'processing' && 'Authenticating...'}
                        {status === 'success' && 'Success!'}
                        {status === 'error' && 'Authentication Failed'}
                    </h1>

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: 3
                    }}>
                        {status === 'processing' && (
                            <CircularProgress
                                size={50}
                                sx={{ color: getStatusColor() }}
                            />
                        )}

                        {status === 'success' && (
                            <div style={{
                                fontSize: '48px',
                                color: getStatusColor(),
                                marginBottom: '10px'
                            }}>
                                ✓
                            </div>
                        )}

                        {status === 'error' && (
                            <div style={{
                                fontSize: '48px',
                                color: getStatusColor(),
                                marginBottom: '10px'
                            }}>
                                ✗
                            </div>
                        )}

                        <p style={{
                            fontSize: '16px',
                            color: '#6c7293',
                            textAlign: 'center',
                            maxWidth: '400px',
                            lineHeight: '1.5'
                        }}>
                            {message}
                        </p>
                    </Box>
                </div>
            </div>
        </div>
    );
};

export default GoogleAuthCallback;
