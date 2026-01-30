import '../styles/LoginRegister.css';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import XIcon from '@mui/icons-material/X';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';

export default function LoginRegister() {
    const [isActive, setIsActive] = useState(false);
    const [errors, setErrors] = useState({});
    const { login, isLoading: authLoading, error: authError, isAuthenticated } = useAuth();
    const [registerLoading, setRegisterLoading] = useState(false);
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });
    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: ''
    }); const handleRegisterClick = () => {
        console.log('Register button clicked - switching to register form');
        setIsActive(true);
    };

    const handleLoginClick = () => {
        console.log('Login button clicked - switching to login form');
        setIsActive(false);
    }; const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Basic validation
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
            console.log('Attempting login with:', { username: loginData.username, password: '[hidden]' });

            // Use the useAuth hook's login function
            const result = await login(loginData.username, loginData.password);

            if (result && result.success) {
                console.log('Login successful!', result);
                alert('Login successful! Welcome back.');
                // You can redirect here or update global state
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
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Basic validation
        const newErrors = {};
        if (!registerData.username.trim()) {
            newErrors.username = 'Username is required';
        }
        if (!registerData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!registerData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (registerData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        } setRegisterLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Register submitted:', registerData);
            // Add your registration API call here
        } catch (error) {
            console.error('Registration error:', error);
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
        <div className={`container ${isActive ? 'active' : ''}`}>            <div className="form-box login">
            <form onSubmit={handleLoginSubmit}>
                <h1>Login</h1>

                {/* General error display */}
                {(errors.general || authError) && (
                    <div className="error-message general-error" style={{
                        color: '#e74c3c',
                        textAlign: 'center',
                        marginBottom: '15px',
                        padding: '10px',
                        backgroundColor: '#fdf2f2',
                        borderRadius: '4px',
                        border: '1px solid #fecaca'
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
                </div>                    <button type="submit" className="btn" disabled={authLoading}>
                    {authLoading ? 'Signing In...' : 'Sign In'}
                </button>
                <p>Or login with social platforms</p>
                <div className="social-icons">
                    <a href="#" onClick={(e) => e.preventDefault()}><FacebookIcon /></a>
                    <a href="#" onClick={(e) => e.preventDefault()}><GoogleIcon /></a>
                    <a href="#" onClick={(e) => e.preventDefault()}><LinkedInIcon /></a>
                    <a href="#" onClick={(e) => e.preventDefault()}><XIcon /></a>
                </div>
            </form>
        </div>
            <div className="form-box register">
                <form onSubmit={handleRegisterSubmit}>
                    <h1>Registration</h1>
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
                    </div>                    <button type="submit" className="btn" disabled={registerLoading}>
                        {registerLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                    <p>Or register with social platforms</p>
                    <div className="social-icons">
                        <a href="#" onClick={(e) => e.preventDefault()}><FacebookIcon /></a>
                        <a href="#" onClick={(e) => e.preventDefault()}><GoogleIcon /></a>
                        <a href="#" onClick={(e) => e.preventDefault()}><LinkedInIcon /></a>
                        <a href="#" onClick={(e) => e.preventDefault()}><XIcon /></a>
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
        </div>
    );
}
