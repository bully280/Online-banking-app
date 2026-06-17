# Troubleshooting Guide

## Common Issues and Solutions

### Installation Issues

#### Node modules not installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### Different Node versions
```bash
# Check Node version (should be v16+)
node --version

# Update Node if needed
# Visit https://nodejs.org/
```

### Server Issues

#### Port 5000 already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9

# OR change port in server/.env
PORT=5001
```

#### Backend server won't start
```bash
# Check for syntax errors
node server/index.js

# Check for missing dependencies
npm list

# Ensure .env file exists
ls -la server/.env

# Check Node version compatibility
node --version
```

#### "Cannot find module" error
```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Check package.json is valid
cat package.json

# Check file paths in imports
```

### Frontend Issues

#### Port 3000 already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9

# OR modify vite.config.js
```

#### White screen or components not loading
```bash
# Clear browser cache
ctrl+shift+delete (or cmd+shift+delete on Mac)

# Check browser console for errors
F12 → Console tab

# Verify vite server is running
# Check terminal for compilation errors
```

#### Tailwind CSS not applied
```bash
# Rebuild CSS
cd client
npm run build

# Clear Tailwind cache
rm -rf node_modules/.tailwindcss

# Reinstall
npm install
```

### Authentication Issues

#### Cannot login

**Check credentials:**
- Admin: admin@banking.com / admin123
- User: user@banking.com / user123

**Verify backend is running:**
```bash
curl http://localhost:5000/api/health
# Should return: {"message":"Server is running"}
```

**Check network requests:**
- Open DevTools → Network tab
- Try to login
- Check request/response in Network tab

#### Token expired
```bash
# Tokens expire after 24 hours
# Solution: Logout and login again

# Clear localStorage if stuck
localStorage.clear()
# Then refresh page
```

#### "Invalid token" error
```javascript
// Check localStorage has valid token
localStorage.getItem('token')

// If empty, user needs to login
// If exists, try:
localStorage.removeItem('token')
localStorage.removeItem('user')
// Then login again
```

### CORS Issues

#### "Access to XMLHttpRequest blocked by CORS policy"

**Solution: Verify backend CORS configuration**
```javascript
// In server/index.js
app.use(cors({
  origin: 'http://localhost:3000',  // Ensure this matches frontend URL
  credentials: true
}));
```

**Ensure both servers are running:**
```bash
# Backend on port 5000
# Frontend on port 3000

# Test backend
curl http://localhost:5000/api/health

# Test frontend
open http://localhost:3000
```

### API Issues

#### "Cannot GET /api/auth/login"
```bash
# Verify backend is running
curl http://localhost:5000/api/health

# Check routes are loaded
# Verify route files exist in server/routes/
```

#### 404 Not Found errors
```bash
# Verify endpoint exists
# Check for typos in route names
# Ensure required parameters are included

# Test with curl
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@banking.com","password":"admin123"}'
```

#### 500 Internal Server Error
```bash
# Check backend console for error message
# Verify database is accessible
# Check for syntax errors in route handlers
# Verify middleware order
```

### Database Issues

#### "User not found"
```javascript
// Verify user exists in database.js
// Check user ID format (should be string)
// Ensure you're using correct field names

// In server/database.js, check:
usersDatabase.forEach(user => console.log(user));
```

#### Data lost after restart
```
This is expected! Mock database uses in-memory storage.
Data is reset when server restarts.

Solution for production:
- Connect to persistent database (MongoDB, PostgreSQL)
- Implement database schemas
- Add migration system
```

#### Balance not updating
```bash
# Verify transaction approval happens
# Check database.js updateTransaction logic
# Ensure status is changed to 'approved'
# Verify fundAccount is called
```

### Account/User Issues

#### Cannot access admin dashboard
```javascript
// Verify user role is 'super_admin'
localStorage.getItem('user')
// Should show: {"role":"super_admin"}

// If role is 'standard_user', login as admin account
```

#### Blocked account can still perform actions
```javascript
// Verify checkAccountStatus middleware is working
// In server/routes/user.js:
// router.get('/dashboard', authenticate, checkAccountStatus(db), ...)

// Check if frozen correctly
// In server/database.js: accountStatus should be 'blocked'
```

#### Cannot approve transactions
```bash
# Verify you're logged in as admin
# Check transaction status in database
# Ensure transaction ID is correct
# Verify transaction exists before approving
```

### UI/UX Issues

#### Dashboard not loading
```bash
# Check network requests in DevTools
# Verify token is sent in Authorization header
# Check backend logs for errors
# Ensure user account status is 'active'
```

#### Sidebar not showing tabs
```javascript
// Verify Sidebar component is imported
// Check userRole prop is passed correctly
// Ensure CSS classes are loaded
```

#### Buttons not working
```javascript
// Check browser console for JavaScript errors
// Verify onClick handlers are defined
// Check for missing axios imports
// Verify token is available in context
```

#### Styling issues
```bash
# Verify Tailwind CSS is installed
cd client && npm list tailwindcss

# Check tailwind.config.js exists
# Verify index.css imports Tailwind
# Clear browser cache (Ctrl+Shift+Delete)
```

### Performance Issues

#### Slow loading
```bash
# Check network tab for slow requests
# Verify backend is responding quickly
# Check for large datasets
# Consider implementing pagination
```

#### High CPU usage
```bash
# Check for infinite loops
# Verify useEffect dependencies
# Check for unnecessary re-renders
# Monitor console for errors
```

## Debug Checklist

- [ ] Check browser console for errors (F12)
- [ ] Check backend console for errors
- [ ] Verify both servers are running
- [ ] Check network requests (DevTools → Network)
- [ ] Verify token exists in localStorage
- [ ] Clear cache and hard refresh (Ctrl+Shift+R)
- [ ] Check firewall/antivirus blocking ports
- [ ] Verify correct credentials being used
- [ ] Ensure database has required data
- [ ] Test with curl for backend endpoints

## Getting Help

### Information to provide when asking for help
1. Error message (exact text)
2. Browser console errors
3. Backend console errors
4. Steps to reproduce
5. Expected vs actual behavior
6. Node and npm versions
7. Operating system

### Resources
- Express.js docs: https://expressjs.com/
- React docs: https://react.dev/
- Axios docs: https://axios-http.com/
- Tailwind CSS: https://tailwindcss.com/
- JWT: https://jwt.io/

## Testing Endpoints with curl

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@banking.com","password":"admin123"}'
```

### Get all users (requires token)
```bash
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Fund account
```bash
curl -X POST http://localhost:5000/api/admin/fund-account \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"userId":"2","amount":500}'
```

### Get user dashboard
```bash
curl -X GET http://localhost:5000/api/user/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

**Still having issues?**
- Review INSTALLATION.md for setup instructions
- Check SECURITY.md for security-related issues
- Review source code comments
- Check git logs for recent changes
