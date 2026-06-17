# Development Guide

## Architecture Overview

### Client-Server Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend                           │
│          (http://localhost:3000)                           │
│  ┌──────────────────────────────────��───────────────┐      │
│  │ Login → Dashboard → Navigation → Components      │      │
│  │ (AuthContext manages global auth state)          │      │
│  └────────────────────────────┬─────────────────────┘      │
│                                │ API Calls (Axios)         │
└────────────────────────────────┼──────────────────────────┘
                                 │
                    HTTPS/REST API (JSON)
                                 │
┌────────────────────────────────▼──────────────────────────┐
│              Express.js Backend                           │
│           (http://localhost:5000)                         │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Auth Routes → Admin Routes → User Routes         │    │
│  │ (JWT Middleware validates all requests)          │    │
│  └──────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────┐    │
│  │         Mock In-Memory Database                  │    │
│  │ (Users & Transactions)                           │    │
│  └──────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── AppContent
│       ├── Router
│       │   ├── Login (Public)
│       │   ├── AdminDashboard (Protected)
│       │   │   ├── Header
│       │   │   ├── Sidebar
│       │   │   └── Content Area
│       │   │       ├── UsersList
│       │   │       ├── TransactionsList
│       │   │       └── ApprovalPanel
│       │   └── UserDashboard (Protected)
│       │       ├── Header
│       │       ├── Sidebar
│       │       └── Content Area
│       │           ├── Dashboard View
│       │           ├── TransactionsList
│       │           └── RequestTransaction
```

### State Management

**AuthContext** manages:
- Current user object
- JWT token
- Authentication state
- Login/Logout functions
- User role (admin/user)

```javascript
{
  user: { id, name, email, role, accountStatus },
  token: string,
  isAuthenticated: boolean,
  isAdmin: boolean,
  loading: boolean,
  error: string
}
```

## Backend Architecture

### Middleware Stack

```
Request
  ↓
CORS Middleware
  ↓
JSON Parser
  ↓
Route Handler
  ↓
[Protected Routes]
  ↓
Authenticate Middleware (JWT validation)
  ↓
Authorize Middleware (Role checking)
  ↓
CheckAccountStatus Middleware (Block checking)
  ↓
Route Controller
  ↓
Database Operation
  ↓
Response
```

### Request/Response Flow

#### Authentication Flow

```javascript
// 1. User submits login form
POST /api/auth/login
{
  email: "user@banking.com",
  password: "password123"
}

// 2. Backend validates credentials
// - Check email exists
// - Compare password hash

// 3. Generate JWT token
token = jwt.sign(
  { id, email, role },
  JWT_SECRET,
  { expiresIn: '24h' }
)

// 4. Return token to frontend
{
  token: "eyJhbGc...",
  user: { id, name, email, role, accountStatus }
}

// 5. Frontend stores token in localStorage
// 6. Frontend adds token to all subsequent requests
headers: {
  Authorization: "Bearer eyJhbGc..."
}
```

#### Protected Route Flow

```javascript
// 1. Frontend sends request with token
GET /api/user/dashboard
headers: { Authorization: "Bearer {token}" }

// 2. Backend receives request
// 3. Authenticate middleware extracts and validates token
const decoded = jwt.verify(token, JWT_SECRET)
req.user = decoded

// 4. Authorize middleware checks role
if (req.user.role !== 'super_admin') {
  return res.status(403).json({ message: 'Access denied' })
}

// 5. CheckAccountStatus middleware verifies account
const user = db.getUser(req.user.id)
if (user.accountStatus === 'blocked') {
  return res.status(403).json({ message: 'Account blocked' })
}

// 6. Route handler executes
const data = db.getAllUsers()
return res.json(data)

// 7. Frontend receives response
```

## Data Flow Examples

### User Submits Transaction Request

```
User Input Form
  ↓ (amount, description)
RequestTransaction Component
  ↓ (API call)
axios.post('/api/user/request-withdrawal', data)
  ↓
Backend Route Handler
  ↓
Validate amount & user balance
  ↓
Create transaction record (status: pending)
  ↓
Return success response
  ↓
Frontend shows success message
  ↓
Transaction appears in pending list
```

### Admin Approves Transaction

```
ApprovalPanel Component
  ↓ (displays pending transactions)
Admin clicks "Approve"
  ↓
axios.post('/api/admin/approve-transaction', { transactionId })
  ↓
Backend validates admin role
  ↓
Update transaction status to 'approved'
  ↓
Update user balance
  ↓
Return updated transaction
  ↓
Frontend refreshes transaction list
  ↓
Transaction no longer in pending list
```

### Admin Freezes User Account

```
UsersList Component
  ↓ (displays all users)
Admin selects user & clicks "Freeze Account"
  ↓
axios.post('/api/admin/freeze-account', { userId })
  ↓
Backend validates admin role
  ↓
Update user.accountStatus = 'blocked'
  ↓
Return updated user
  ↓
Frontend shows blocked badge
  ↓
Next login: User sees blocked message
  ↓
Blocked user cannot access dashboard
```

## Error Handling

### Backend Error Responses

```javascript
// 400 - Bad Request (invalid input)
{
  message: "Invalid userId or amount"
}

// 401 - Unauthorized (no/invalid token)
{
  message: "Invalid token"
}

// 403 - Forbidden (insufficient permissions)
{
  message: "Access denied. Insufficient permissions."
}

// 404 - Not Found
{
  message: "User not found"
}

// 500 - Server Error
{
  message: "Server error",
  error: "error details"
}
```

### Frontend Error Handling

```javascript
// Try-catch blocks
try {
  const response = await axios.get('/api/data')
  // Process response
} catch (error) {
  // Extract error message
  const message = error.response?.data?.message || 'Error occurred'
  // Show to user
  setError(message)
}

// Axios interceptors (optional)
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

## Database Operations

### User CRUD Operations

```javascript
// Create
db.createUser({ name, email, password, role, balance })

// Read
db.getUser(id)
db.getUserByEmail(email)
db.getAllUsers()

// Update
db.updateUser(id, { balance, accountStatus, ... })
db.freezeAccount(id)
db.unblockAccount(id)

// Balance Operations
db.fundAccount(id, amount)
db.withdrawFromAccount(id, amount)
```

### Transaction CRUD Operations

```javascript
// Create
db.createTransaction({
  userId,
  amount,
  type,     // 'deposit' | 'withdrawal'
  status,   // 'pending' | 'approved' | 'failed'
  description
})

// Read
db.getTransaction(id)
db.getUserTransactions(userId)
db.getAllTransactions()
db.getPendingTransactions()

// Update
db.updateTransaction(id, { status, ... })
```

## Development Workflow

### Running Development Environment

```bash
# Terminal 1: Backend
cd online-banking-app
npm run dev
# Runs with nodemon (auto-reload on file changes)

# Terminal 2: Frontend
cd client
npm start
# Runs with Vite dev server (fast refresh)
```

### Making Changes

1. **Backend Changes**
   - Edit files in `server/`
   - Server auto-reloads with nodemon
   - Test via API tools (Postman, curl, etc.)
   - Check console for errors

2. **Frontend Changes**
   - Edit files in `client/src/`
   - Browser auto-refreshes (Fast Refresh)
   - Check browser console for errors
   - Test with different user roles

### Testing Checklist

- [ ] Login with admin account
- [ ] Login with user account
- [ ] Submit transaction request as user
- [ ] Approve transaction as admin
- [ ] Reject transaction as admin
- [ ] Fund account as admin
- [ ] Withdraw from account as admin
- [ ] Freeze account as admin
- [ ] Try accessing frozen account
- [ ] Unblock account as admin
- [ ] View all users (admin only)
- [ ] View all transactions (admin only)
- [ ] Check balance display (user)
- [ ] Check transaction history (user)
- [ ] Test logout functionality

## Performance Considerations

### Frontend Optimization
- React.memo for expensive components
- useCallback for stable function references
- Code splitting with React.lazy
- Efficient re-renders with proper key props

### Backend Optimization
- Database query optimization
- Implement caching for frequently accessed data
- Use connection pooling for database
- Implement pagination for large datasets
- Add request validation before database queries

## Security Best Practices

### During Development
- Keep JWT_SECRET secret
- Don't commit .env file
- Use HTTPS in production
- Validate all inputs
- Never log sensitive data
- Use parameterized queries

### Code Review
- Check for SQL injection risks
- Verify authentication middleware usage
- Check CORS configuration
- Review role-based access control
- Verify password hashing

## Debugging Tips

### Frontend Debugging
```javascript
// Log user state
console.log('User:', user)
console.log('Token:', token)

// Check localStorage
localStorage.getItem('token')
localStorage.getItem('user')

// Network tab in DevTools
// Check request headers and response data
```

### Backend Debugging
```javascript
// Console logging
console.log('User:', req.user)
console.log('Database query result:', result)

// Check middleware order
// Verify token is being validated

// Use Postman or curl to test endpoints directly
curl -H "Authorization: Bearer {token}" http://localhost:5000/api/admin/users
```

## Common Issues & Solutions

### Issue: "Invalid token"
**Solution**: Token might be expired or malformed. Try logging out and logging back in.

### Issue: "Access denied" on admin endpoints
**Solution**: Ensure you're logged in as super_admin role. Check user's role field.

### Issue: CORS error
**Solution**: Ensure backend is running on port 5000 and frontend on port 3000.

### Issue: "User not found"
**Solution**: Check that userId exists in database. View all users first.

### Issue: "Account blocked" error
**Solution**: User account was frozen by admin. Admin needs to unblock it.

---

**For more information, see:**
- README.md - Project overview
- INSTALLATION.md - Setup guide
- SECURITY.md - Security policies
