# Installation & Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## Backend Setup

### 1. Install Dependencies

```bash
cd online-banking-app
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### 3. Start the Backend Server

```bash
npm start
```

The server will run on `http://localhost:5000`

**For development with auto-reload:**

```bash
npm run dev
```

## Frontend Setup

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Start the Development Server

```bash
npm start
```

The application will open at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

## Quick Start (One Terminal)

If you want to run both frontend and backend from one location:

```bash
# From the root directory
# Terminal 1 - Backend
npm start

# Terminal 2 - Frontend
npm run client
```

## Default Test Credentials

### Super Admin Account
- **Email:** admin@banking.com
- **Password:** admin123
- **Access:** Full system control, user management, transaction approvals

### Standard User Account
- **Email:** user@banking.com
- **Password:** user123
- **Access:** Limited to own account dashboard and transaction requests

### Additional Test User
- **Email:** jane@banking.com
- **Password:** user123
- **Access:** Standard user features

## Testing the Application

### Admin Workflows

1. **Login as Admin**
   - Navigate to login page
   - Click "Admin Account" button or enter admin@banking.com / admin123
   - You'll be redirected to the admin dashboard

2. **Manage Users**
   - View all registered users
   - Select a user to fund, withdraw, freeze, or unblock their account
   - Monitor account statuses

3. **Approve Transactions**
   - Navigate to "Approvals" tab
   - Review pending transaction requests from standard users
   - Approve or reject requests

4. **View Platform Metrics**
   - Total users count
   - Pending approvals
   - Total platform balance

### User Workflows

1. **Login as Standard User**
   - Navigate to login page
   - Click "User Account" button or enter user@banking.com / user123
   - You'll be redirected to your user dashboard

2. **View Account**
   - See your current balance
   - Check account status
   - View transaction history

3. **Submit Requests**
   - Navigate to "New Request" tab
   - Select transfer or withdrawal
   - Enter amount and description
   - Submit for admin approval

4. **Check Request Status**
   - Go to "History" tab
   - See all your transactions
   - Track pending requests

## API Documentation

### Authentication Endpoints

```
POST /api/auth/signup
- Register a new user
- Body: { name, email, password }

POST /api/auth/login
- Authenticate user
- Body: { email, password }
- Returns: { token, user }
```

### Admin Endpoints (Requires super_admin role)

```
GET /api/admin/users
- Get all users
- Headers: Authorization: Bearer {token}

GET /api/admin/transactions
- Get all transactions
- Headers: Authorization: Bearer {token}

POST /api/admin/fund-account
- Fund user account
- Body: { userId, amount }

POST /api/admin/withdraw-account
- Withdraw from account
- Body: { userId, amount }

POST /api/admin/freeze-account
- Freeze/block account
- Body: { userId }

POST /api/admin/unblock-account
- Unblock account
- Body: { userId }

POST /api/admin/approve-transaction
- Approve pending transaction
- Body: { transactionId }

POST /api/admin/reject-transaction
- Reject pending transaction
- Body: { transactionId }
```

### User Endpoints

```
GET /api/user/dashboard
- Get user dashboard data
- Headers: Authorization: Bearer {token}
- Returns: { user, stats }

GET /api/user/transactions
- Get user's transactions
- Headers: Authorization: Bearer {token}

POST /api/user/request-transfer
- Submit transfer request
- Body: { amount, description }

POST /api/user/request-withdrawal
- Submit withdrawal request
- Body: { amount, description }
```

## Database Schema

### Users Table

```javascript
{
  id: string,
  name: string,
  email: string,
  password: string (bcrypt hashed),
  role: 'super_admin' | 'standard_user',
  balance: number,
  accountStatus: 'active' | 'blocked',
  createdAt: Date
}
```

### Transactions Table

```javascript
{
  id: string,
  userId: string,
  amount: number,
  type: 'deposit' | 'withdrawal',
  status: 'pending' | 'approved' | 'failed',
  description: string,
  timestamp: Date
}
```

## Security Features

✅ **JWT Authentication**
- Token-based authentication with 24-hour expiration
- Secure token storage in localStorage

✅ **Password Security**
- Bcrypt hashing with salt rounds of 10
- Passwords never stored in plain text

✅ **Role-Based Access Control (RBAC)**
- Super Admin role with full system access
- Standard User role with restricted access
- Middleware protection on all sensitive endpoints

✅ **Account Blocking**
- Blocked accounts cannot perform any actions
- Clear visual indicators in the UI
- Blocked users cannot access their dashboard

✅ **Transaction Approval Workflow**
- All user-initiated transactions require admin approval
- Prevents unauthorized fund transfers
- Audit trail of all transactions

## Troubleshooting

### Port Already in Use

If port 5000 is already in use:

```bash
# Change port in server/.env
PORT=5001
```

### CORS Issues

If you see CORS errors, ensure:
- Backend is running on `http://localhost:5000`
- Frontend is running on `http://localhost:3000`
- Both services are running

### Authentication Issues

- Clear browser localStorage: `localStorage.clear()`
- Check that token is being stored correctly
- Verify JWT_SECRET matches in .env file

### Database Connection

This app uses an in-memory mock database. Data is lost on server restart. To persist data, you would need to:
1. Connect to a real database (MongoDB, PostgreSQL, etc.)
2. Modify database.js to use database queries instead of in-memory arrays

## Next Steps for Production

1. **Replace Mock Database**
   - Implement MongoDB or PostgreSQL
   - Use Mongoose or TypeORM for ORM

2. **Enhance Security**
   - Implement refresh tokens
   - Add rate limiting
   - Add HTTPS/TLS
   - Implement CSRF protection

3. **Add Logging**
   - Implement Winston or Bunyan for logging
   - Track all admin actions
   - Monitor transactions

4. **Email Notifications**
   - Send transaction confirmations
   - Notify users of account actions
   - Admin alerts for critical operations

5. **Frontend Enhancements**
   - Add form validation
   - Implement error boundaries
   - Add loading states
   - Implement pagination for large datasets

6. **Testing**
   - Add unit tests (Jest)
   - Add integration tests
   - Add E2E tests (Cypress)

## Support

For issues or questions, please check the README.md file for more information about the project structure and features.
