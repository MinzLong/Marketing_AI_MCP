import React, { useEffect, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showSuccessToast, showErrorToast } from '../components/common/toast-utils';

const Dashboard = () => {
    const hasShownToast = useRef(false);

    useEffect(() => {
        // Prevent duplicate toasts in StrictMode
        if (hasShownToast.current) {
            console.log('Toast already shown, skipping...');
            return;
        }

        // Add a small delay to ensure component is fully mounted
        const showToasts = () => {
            // Check for success message from Google OAuth
            const successMessage = sessionStorage.getItem('auth_success_message');
            console.log('Dashboard - Success message from sessionStorage:', successMessage);

            if (successMessage) {
                console.log('Showing success toast:', successMessage);
                showSuccessToast(successMessage);
                sessionStorage.removeItem('auth_success_message'); // Clean up
                hasShownToast.current = true; // Mark as shown
            }

            // Check for error message (in case user is redirected here on error)
            const errorMessage = sessionStorage.getItem('auth_error_message');
            console.log('Dashboard - Error message from sessionStorage:', errorMessage);

            if (errorMessage) {
                console.log('Showing error toast:', errorMessage);
                showErrorToast(errorMessage);
                sessionStorage.removeItem('auth_error_message'); // Clean up
                hasShownToast.current = true; // Mark as shown
            }
        };

        // Small delay to ensure everything is ready
        const timer = setTimeout(showToasts, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '40px 20px'
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                    color: '#333'
                }}>
                    🎯 Marketing AI Dashboard
                </h1>

                <div style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    marginBottom: '30px'
                }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        marginBottom: '15px',
                        color: '#555'
                    }}>
                        Welcome to Your Dashboard! 🚀
                    </h2>

                    <p style={{
                        fontSize: '1.1rem',
                        color: '#666',
                        lineHeight: '1.6'
                    }}>
                        You have successfully authenticated with Google! Your dashboard is ready to use.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '25px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ color: '#4CAF50', marginBottom: '10px' }}>✅ Authentication</h3>
                        <p style={{ color: '#666' }}>Successfully logged in with Google OAuth</p>
                    </div>

                    <div style={{
                        backgroundColor: 'white',
                        padding: '25px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ color: '#2196F3', marginBottom: '10px' }}>🎯 Marketing AI</h3>
                        <p style={{ color: '#666' }}>Ready to boost your marketing campaigns</p>
                    </div>                    <div style={{
                        backgroundColor: 'white',
                        padding: '25px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ color: '#FF9800', marginBottom: '10px' }}>🎉 Toast Notifications</h3>
                        <p style={{ color: '#666' }}>Beautiful notifications system active</p>

                        {/* Test button to verify toast functionality */}
                        <button
                            onClick={() => showSuccessToast('Test notification - Toasts are working!')}
                            style={{
                                marginTop: '10px',
                                padding: '8px 16px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Test Toast
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={2999}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default Dashboard;
