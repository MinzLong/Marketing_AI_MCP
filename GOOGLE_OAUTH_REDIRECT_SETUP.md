# Google OAuth Configuration Guide

## 4️⃣ Add Authorized Origins & Redirect URIs

### In Google Cloud Console:

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Navigate to**: APIs & Services → Credentials
3. **Click on your OAuth 2.0 Client ID**
4. **Add these URIs**:

### **Authorized JavaScript Origins:**
```
http://localhost:5173
http://localhost:3000
http://127.0.0.1:5173
http://127.0.0.1:3000
```

### **Authorized Redirect URIs:**
```
http://localhost:5173/auth/google/callback
http://localhost:3000/auth/google/callback
http://127.0.0.1:5173/auth/google/callback
http://127.0.0.1:3000/auth/google/callback
```

### **Important Notes:**
- Make sure to use **exact URLs** including the port numbers
- **No trailing slashes** in the redirect URIs
- Include both `localhost` and `127.0.0.1` for compatibility
- Include port `3000` as backup (common React dev port)
- The callback path must be: `/auth/google/callback`

### **After Adding:**
1. Click **SAVE** in Google Cloud Console
2. Wait 5-10 minutes for changes to propagate
3. Test the OAuth flow again

## Current Configuration Check:
- Frontend URL: `http://localhost:5173`
- Callback URL: `http://localhost:5173/auth/google/callback`
- Backend API: `http://localhost:8000`

Make sure these match exactly with what you configure in Google Cloud Console!
