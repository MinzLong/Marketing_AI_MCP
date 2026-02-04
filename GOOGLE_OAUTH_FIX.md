# Test Google OAuth Endpoints

This document describes how to test the new Google OAuth registration and login endpoints.

## New Endpoints:

1. **POST /api/auth/google/register** - For new user registration
2. **POST /api/auth/google/login** - For existing user login

## Expected Behaviors:

### Registration Flow:
- User clicks "Register with Google" → `isRegistration={true}`
- If email doesn't exist → Create new user ✅
- If email already exists → Return error: "Email already registered. Please login instead." ❌

### Login Flow:
- User clicks "Login with Google" → `isRegistration={false}` 
- If email exists → Login successfully ✅
- If email doesn't exist → Return error: "No account found with this email. Please register first." ❌

## Frontend Changes:

1. **GoogleAuthButton** now accepts `isRegistration` prop
2. **useGoogleAuth** has separate methods: `registerWithGoogle()` and `loginWithGoogle()`
3. **LoginRegister** page uses different buttons for each form
4. **Error handling** shows specific messages to guide users

## Backend Changes:

1. **Separate endpoints** for register vs login
2. **New service methods**: `check_user_exists()`, `create_google_user()`, `authenticate_google_user()`
3. **Proper error codes**: `USER_EXISTS`, `USER_NOT_FOUND`
4. **Maintained backward compatibility** with existing `/auth/google/callback`

## Testing:

1. Try to register with Google → Should work for new emails
2. Try to register again with same email → Should show error
3. Try to login with registered email → Should work
4. Try to login with unregistered email → Should show error

This fixes the original issue where the same email could "register" multiple times through Google OAuth.
