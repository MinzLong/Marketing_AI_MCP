import '../styles/LoginRegister.css';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import { useState, useEffect, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from '../hooks/useAuth';
import useRegistration from '../hooks/useRegistration';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';
import { showErrorToast } from '../components/common/toast-utils';

export default function LoginRegister() {
    const [isActive, setIsActive] = useState(false);
    const [errors, setErrors] = useState({});
    const hasShownToast = useRef(false);

    const { login, isLoading: authLoading, error: authError, isAuthenticated } = useAuth();
    const { register } = useRegistration();
    const [registerLoading, setRegisterLoading] = useState(false);
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
        rememberMe: false
    }); const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: ''
    });

    // Check for OAuth error messages when component loads
    useEffect(() => {
        // Prevent duplicate toasts in StrictMode
        if (hasShownToast.current) {
            return;
        }

        // Check for error message from Google OAuth callback
        const showErrorToasts = () => {
            const errorMessage = sessionStorage.getItem('auth_error_message');
            console.log('LoginRegister - Error message from sessionStorage:', errorMessage);

            if (errorMessage) {
                console.log('Showing error toast:', errorMessage);
                showErrorToast(errorMessage);
                sessionStorage.removeItem('auth_error_message'); // Clean up
                hasShownToast.current = true; // Mark as shown
            }
        };

        // Small delay to ensure everything is ready
        const timer = setTimeout(showErrorToasts, 100);

        return () => clearTimeout(timer);
    }, []);

    const handleGoogleAuthSuccess = (result) => {
        if (!result) {
            setErrors({ general: 'Unexpected response from authentication.' });
            return;
        }

        setErrors({});

        const message = (result && (result.message || (result.data && result.data.message) || ''));

        if (message && message.includes('Registration')) {
            setErrors({ general: 'Registration successful! Welcome!' });
        } else {
            setErrors({ general: 'Login successful! Welcome back!' });
        }

        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1500);
    };

    const handleGoogleAuthError = (error) => {
        console.error('Google authentication failed:', error);

        let errorMessage = 'Google authentication failed';

        if (!error) {
            setErrors({ general: errorMessage });
            return;
        }

        if (typeof error === 'string') {
            errorMessage = error;
        } else if (error.message) {
            errorMessage = error.message;
        } else if (error.error) {
            errorMessage = error.error;
        }

        if (errorMessage.includes('Email already registered')) {
            errorMessage = 'This email is already registered. Please use the Login tab instead.';
        } else if (errorMessage.includes('No account found')) {
            errorMessage = 'No account found with this email. Please use the Register tab to create an account.';
        }

        setErrors({ general: errorMessage });
    };

    const mapBackendErrorToField = (errorMessage) => {
        const errors = {};
        const message = errorMessage.toLowerCase();

        if (message.includes('username') ||
            message.includes('name or username is required') ||
            message.includes('username is already taken')) {
            errors.username = errorMessage;
        }
        else if (message.includes('email already exists') ||
            message.includes('user with this email already exists') ||
            message.includes('invalid email format') ||
            message.includes('email is required')) {
            errors.email = errorMessage;
        }
        else if (message.includes('password must') ||
            message.includes('password is required')) {
            errors.password = errorMessage;
        }
        else {
            errors.general = errorMessage;
        }

        return errors;
    };

    const handleRegisterClick = () => {
        setErrors({});
        setIsActive(true);
    };

    const handleLoginClick = () => {
        setErrors({});
        setIsActive(false);
    }; const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const newErrors = {};
        if (!loginData.username.trim()) {
            newErrors.username = 'Username is required';
        }
        if (!loginData.password.trim()) {
            newErrors.password = 'Password is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        } try {

            const result = await login(loginData.username, loginData.password);

            if (result && result.success) {
                console.log('Login successful!', result);
                alert('Login successful! Welcome back.');
            } else {
                const errorMessage = result?.error || authError || 'Login failed';
                console.error('Login error:', errorMessage);
                setErrors({ general: errorMessage });
            }

        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.message || 'Login failed. Please try again.';
            setErrors({ general: errorMessage });
            alert(`Login failed: ${errorMessage}`);
        }
    }; const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const newErrors = {};
        if (!registerData.username.trim()) {
            newErrors.username = 'Username is required';
        }
        if (!registerData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
            newErrors.email = 'Email is invalid';
        } if (!registerData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (registerData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        } else if (!/(?=.*[a-z])/.test(registerData.password)) {
            newErrors.password = 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(registerData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*\d)/.test(registerData.password)) {
            newErrors.password = 'Password must contain at least one number';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setRegisterLoading(true);
        try {


            const result = await register(registerData.username, registerData.email, registerData.password); if (result && result.success) {
                console.log('Registration successful!', result);
                setRegisterData({ username: '', email: '', password: '' });
                setIsActive(false);

                setTimeout(() => {
                    setErrors({ general: 'Registration successful! You can now login.' });
                }, 100);
            } else {
                const errorMessage = result?.error || 'Registration failed';

                const backendErrors = mapBackendErrorToField(errorMessage);
                setErrors(backendErrors);
            }
        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error.message || 'Registration failed. Please try again.';
            const backendErrors = mapBackendErrorToField(errorMessage);
            setErrors(backendErrors);
        } finally {
            setRegisterLoading(false);
        }
    };

    const handleLoginChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    return (
        <div className="login-register-page">
            <div className={`container ${isActive ? 'active' : ''}`}>
                <div className="form-box login">
                    <form onSubmit={handleLoginSubmit}>
                        <h1>Login</h1>

                        {(errors.general || authError) && (
                            <div className="error-message general-error" style={{
                                color: errors.general?.includes('successful') ? '#27ae60' : '#e74c3c',
                                textAlign: 'center',
                                marginBottom: '15px',
                                padding: '10px',
                                backgroundColor: errors.general?.includes('successful') ? '#f0fff4' : '#fdf2f2',
                                borderRadius: '4px',
                                border: errors.general?.includes('successful') ? '1px solid #c3e6cb' : '1px solid #fecaca'
                            }}>
                                {errors.general || authError}
                            </div>
                        )}

                        <div className="input-box">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username or Email"
                                value={loginData.username}
                                onChange={handleLoginChange}
                                className={errors.username ? 'error' : ''}
                                required
                            />
                            <span className="icon"><PersonIcon /></span>
                            {errors.username && <span className="error-message">{errors.username}</span>}
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                className={errors.password ? 'error' : ''}
                                required
                            />
                            <span className="icon"><LockIcon /></span>
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>
                        <div className="remember-forgot">
                            <label>
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={loginData.rememberMe}
                                    onChange={handleLoginChange}
                                />
                                Remember me
                            </label>
                            <a href="#" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
                        </div>
                        <button type="submit" className="btn" disabled={authLoading}>
                            {authLoading ? 'Signing In...' : 'Sign In'}
                        </button>                    <p>Or login with social platforms</p>
                        <div className="social-icons">
                            <GoogleAuthButton
                                type="signin"
                                isRegistration={false}
                                onSuccess={handleGoogleAuthSuccess}
                                onError={handleGoogleAuthError}
                            />
                        </div>
                    </form>
                </div>
                <div className="form-box register">
                    <form onSubmit={handleRegisterSubmit}>
                        <h1>Registration</h1>

                        {errors.general && (
                            <div className="error-message general-error" style={{
                                color: '#e74c3c',
                                textAlign: 'center',
                                marginBottom: '15px',
                                padding: '10px',
                                backgroundColor: '#fdf2f2',
                                borderRadius: '4px',
                                border: '1px solid #fecaca'
                            }}>
                                {errors.general}
                            </div>
                        )}

                        <div className="input-box">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={registerData.username}
                                onChange={handleRegisterChange}
                                className={errors.username ? 'error' : ''}
                                required
                            />
                            <span className="icon"><PersonIcon /></span>
                            {errors.username && <span className="error-message">{errors.username}</span>}
                        </div>
                        <div className="input-box">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={registerData.email}
                                onChange={handleRegisterChange}
                                className={errors.email ? 'error' : ''}
                                required
                            />
                            <span className="icon"><EmailIcon /></span>
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={registerData.password}
                                onChange={handleRegisterChange}
                                className={errors.password ? 'error' : ''}
                                required
                            />
                            <span className="icon"><LockIcon /></span>
                            {errors.password && <span className="error-message">{errors.password}</span>}
                            {!errors.password && registerData.password && (
                                <div className="password-requirements" style={{
                                    fontSize: '12px',
                                    color: '#666',
                                    marginTop: '5px',
                                    paddingLeft: '10px'
                                }}>
                                    Requirements: 8+ chars, uppercase, lowercase, number
                                </div>
                            )}
                        </div>
                        <button type="submit" className="btn" disabled={registerLoading}>
                            {registerLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                        <p>Or register with social platforms</p>
                        <div className="social-icons">

                            <GoogleAuthButton
                                type="signup"
                                isRegistration={true}
                                onSuccess={handleGoogleAuthSuccess}
                                onError={handleGoogleAuthError}
                            />
                        </div>
                    </form>
                </div>
                <div className="toggle-box">
                    <div className="toggle-panel toggle-left">
                        <h1>Hello, Friend!</h1>
                        <p>Don't have an account ?</p>
                        <button className="btn register-btn" onClick={handleRegisterClick} type="button">
                            Register
                        </button>
                    </div>

                    <div className="toggle-panel toggle-right">
                        <h1>Welcome Back!</h1>
                        <p>Already have an account ?</p>
                        <button className="btn login-btn" onClick={handleLoginClick} type="button">
                            Login
                        </button>
                    </div>
                </div>

                {/* Toast Container for error notifications */}
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
                    theme="light" />
            </div>
        </div>
    );

}
