# SecureBank - Full-Stack Online Banking Application

## 🏦 Project Overview

SecureBank is a comprehensive, production-ready online banking web application built with a modern tech stack. It features strict Role-Based Access Control (RBAC) with two distinct user roles: **Super Admin** and **Standard User**. The application implements secure authentication, transaction approval workflows, and comprehensive account management capabilities.

## ✨ Features

### Super Admin Features
- 🔑 Full master control over the entire banking system
- 👥 User management panel with complete account oversight
- 💰 Manual fund and withdrawal operations on any account
- 🔒 Instant account freezing/blocking and unblocking
- ✅ Transaction approval/rejection workflow
- 📊 View all system transactions and global platform metrics
- 📈 Monitor total platform funding and account statistics
- 🔴 Visual indicators for blocked accounts (red badge)

### Standard User Features
- 👤 Personal dashboard with real-time balance display
- 📋 View individual transaction history
- 📤 Initiate withdrawal requests (pending admin approval)
- 💸 Submit transfer requests (pending admin approval)
- 🔒 Account status indicator with blocking prevention
- 🛡️ View-only access to personal data
- ⚠️ Blocked account status with action prevention

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Middleware**: CORS support

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Theme**: Dark mode (fintech aesthetic)

### Database
- **Type**: Mock in-memory database
- **Structure**: JavaScript arrays
- **Note**: Can be replaced with MongoDB, PostgreSQL, etc.

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bully280/online-banking-app.git
   cd online-banking-app
   ```

2. **Setup Backend**
   ```bash
   npm install
   cp server/.env.example server/.env
   npm start
   ```
   Server runs on: `http://localhost:5000`

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd client
   npm install
   npm start
   ```
   Application runs on: `http://localhost:3000`

## 🔐 Default Credentials

### Super Admin
- **Email**: admin@banking.com
- **Password**: admin123

### Standard User
- **Email**: user@banking.com
- **Password**: user123

### Additional User
- **Email**: jane@banking.com
- **Password**: user123

## 📁 Project Structure

```
online-banking-app/
├── server/
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── routes/
│   │   ├── auth.js              # Login/Signup endpoints
│   │   ├── admin.js             # Admin-only endpoints
│   │   └── user.js              # Standard user endpoints
│   ├── database.js              # Mock database with CRUD operations
│   ├── index.js                 # Express server initialization
│   └── .env.example             # Environment variables template
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx       # Navigation header
│   │   │   ├── Sidebar.jsx      # Navigation sidebar
│   ���   │   ├── UsersList.jsx    # User management component
│   │   │   ├── TransactionsList.jsx  # Transactions display
│   │   │   └── ApprovalPanel.jsx    # Transaction approval interface
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Authentication page
│   │   │   ├── AdminDashboard.jsx   # Admin control panel
│   │   │   ├── UserDashboard.jsx    # User account dashboard
│   │   │   └── RequestTransaction.jsx # Request submission form
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication state management
│   │   ├── App.jsx              # Main application component
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles with Tailwind
│   ├── index.html               # HTML template
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── postcss.config.js        # PostCSS configuration
│   └── package.json             # Frontend dependencies
├── package.json                 # Backend dependencies
├── README.md                    # This file
├── INSTALLATION.md              # Detailed installation guide
└── .gitignore                   # Git ignore rules
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/signup          Register new user
POST   /api/auth/login           Authenticate user
POST   /api/auth/logout          Logout user (client-side)
```

### Admin Operations
```
GET    /api/admin/users          Get all users
GET    /api/admin/transactions   Get all transactions
POST   /api/admin/fund-account   Fund user account
POST   /api/admin/withdraw-account   Withdraw from account
POST   /api/admin/freeze-account     Freeze account
POST   /api/admin/unblock-account    Unblock account
POST   /api/admin/approve-transaction    Approve transaction
POST   /api/admin/reject-transaction     Reject transaction
```

### Standard User Operations
```
GET    /api/user/dashboard       Get user dashboard data
GET    /api/user/transactions    Get user transactions
POST   /api/user/request-transfer    Submit transfer request
POST   /api/user/request-withdrawal  Submit withdrawal request
```

## 🔒 Security Implementation

### 1. Authentication
- JWT-based token system
- 24-hour token expiration
- Secure token storage in localStorage
- Token validation on protected routes

### 2. Authorization
- Role-Based Access Control (RBAC)
- Middleware-enforced role checking
- Protected API endpoints
- Automatic role detection on login

### 3. Password Security
- Bcrypt hashing with 10 salt rounds
- Never stored in plain text
- Secure comparison for validation

### 4. Account Protection
- Account status tracking (active/blocked)
- Blocked account action prevention
- Visual indicators for blocked status
- Automatic dashboard redirect based on status

### 5. Transaction Security
- Approval workflow for user transactions
- Admin verification required
- Complete transaction audit trail
- Status tracking (pending/approved/failed)

## 💾 Database Schema

### Users Collection
```javascript
{
  id: string,                    // Unique identifier
  name: string,                  // User full name
  email: string,                 // Email address (unique)
  password: string,              // Bcrypt hashed password
  role: 'super_admin' | 'standard_user',
  balance: number,               // Account balance
  accountStatus: 'active' | 'blocked',
  createdAt: Date                // Account creation date
}
```

### Transactions Collection
```javascript
{
  id: string,                    // Unique identifier
  userId: string,                // Associated user
  amount: number,                // Transaction amount
  type: 'deposit' | 'withdrawal',
  status: 'pending' | 'approved' | 'failed',
  description: string,           // Transaction details
  timestamp: Date                // Transaction time
}
```

## 🎨 UI/UX Highlights

### Design Philosophy
- **Dark Mode**: Professional fintech aesthetic
- **Clean Layout**: Intuitive navigation
- **Visual Feedback**: Status badges and indicators
- **Responsive**: Works on desktop and tablet
- **Accessibility**: Semantic HTML, keyboard navigation

### Key UI Components
- Authentication form with demo credential buttons
- Responsive navigation sidebar
- User management table with inline actions
- Transaction history with status indicators
- Transaction approval queue with quick actions
- Real-time balance display
- Account status badges
- Red blocked account indicator

## 🧪 Testing the Application

### Admin Workflow
1. Login with admin credentials
2. Navigate to Users tab
3. Select a user to manage
4. Fund or withdraw from account
5. Go to Approvals tab
6. Review and approve/reject pending transactions

### User Workflow
1. Login with user credentials
2. View balance on dashboard
3. Check transaction history
4. Submit withdrawal/transfer request
5. See request status change from pending to approved

### Account Blocking
1. Login as admin
2. Select a user and click "Freeze Account"
3. Try to login with that user account
4. See blocked account message and cannot perform actions
5. Login as admin and unblock the account

## 🚀 Deployment

### Development
```bash
# Backend
npm run dev

# Frontend
cd client && npm start
```

### Production Build
```bash
# Frontend
cd client && npm run build

# Serves static files from client/dist
```

### Environment Variables

**Backend (.env)**
```
PORT=5000
JWT_SECRET=your_secure_secret_key
NODE_ENV=production
```

## 📚 Key Features Deep Dive

### Role-Based Access Control
The application implements comprehensive RBAC:
- **Super Admin**: Unrestricted access to all features
- **Standard User**: Limited to personal account and transaction requests
- Middleware enforces role checks on every protected route
- Automatic role detection and dashboard redirect on login

### Transaction Approval Workflow
1. User submits withdrawal/transfer request
2. Transaction created with "pending" status
3. Admin sees request in Approvals tab
4. Admin reviews and approves/rejects
5. Balance updated on approval
6. User sees updated status in transaction history

### Account Freezing
1. Admin selects user and clicks "Freeze Account"
2. Account status changes to "blocked"
3. Blocked user sees warning on login
4. Blocked user cannot access dashboard or perform actions
5. Admin can unblock from user management panel

## 🔧 Customization

### Add New Users
Edit `server/database.js` and add to `usersDatabase` array:
```javascript
{
  id: '4',
  name: 'New User',
  email: 'newuser@banking.com',
  password: 'bcrypt_hashed_password',
  role: 'standard_user',
  balance: 0,
  accountStatus: 'active',
  createdAt: new Date()
}
```

### Change Colors/Theme
Edit `client/tailwind.config.js` to customize colors and theme

### Modify API Response
Edit route files in `server/routes/` to customize endpoints

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 📞 Support

For issues or questions:
1. Check INSTALLATION.md for setup help
2. Review the API documentation above
3. Check browser console for errors
4. Verify backend is running on port 5000

---

**Built with ❤️ by SecureBank Development Team**
