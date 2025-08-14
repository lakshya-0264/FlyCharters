# FlyCharters

## 🚁 Project Overview

FlyCharters is a comprehensive flight charter booking platform that connects customers, aircraft operators, and administrators in a unified ecosystem. The application supports private jet bookings, empty leg utilization, and multi-user role management.

## 🏗️ Architecture Overview

### Full-Stack Structure
```
flightcharters/
├── flycharters_frontend/     # React Frontend Application
└── flycharters_backend/      # Node.js/Express Backend API
```

### Technology Stack

#### Frontend (React + Vite)
- **Framework:** React 19.1.0 with Vite 6.3.5
- **State Management:** Redux Toolkit + Redux Persist
- **Styling:** Tailwind CSS 4.1.11
- **Routing:** React Router DOM 7.6.1
- **UI Components:** Radix UI, Lucide React, Framer Motion
- **Real-time:** Socket.io Client
- **Charts:** Recharts for analytics
- **Payment:** Cashfree Payments integration

#### Backend (Node.js + Express)
- **Runtime:** Node.js with Express 5.1.0
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT with bcryptjs
- **File Upload:** Multer + Cloudinary
- **Real-time:** Socket.io
- **Payment Processing:** Cashfree API
- **PDF Generation:** PDFKit
- **Email:** Nodemailer
- **Validation:** Zod schema validation

## 🔐 Authentication & Authorization

### User Roles
1. **Customer (User)** - Book flights, manage bookings, view history
2. **Operator** - Manage fleet, upload empty legs, handle bookings
3. **Admin** - Oversee platform, approve operators, analytics

### Authentication Flow
```javascript
// Frontend Auth Context (src/context/AuthContext.jsx)
- Automatic session validation every 5 minutes
- Role-based routing (user/operator/admin)
- JWT token management with localStorage
- Automatic logout on session expiry
```

### API Authentication Endpoints
```javascript
// Backend Routes (src/Routers/User_Router/)
POST /auth/signup          # User registration
POST /auth/login           # User login
GET  /auth/current         # Get current user
POST /auth/logout          # User logout
```

## 👤 **DETAILED USER DASHBOARD ARCHITECTURE**

### **User Dashboard Overview**
The user dashboard (`src/components/CustomerView/User_dash.jsx`) is the main interface for customers to book flights, manage bookings, and access additional services.

#### **Component Structure & Technologies Used:**

**1. Main Component: `User_dash.jsx`**

**Key Features:**
- **State Management:** Uses React hooks for local state
- **Navigation:** React Router for client-side routing
- **Icons:** Lucide React for consistent iconography
- **Responsive Design:** CSS Grid and Flexbox for layout

**2. Styling Architecture: `User_dash.css`**

**CSS Technologies Used:**
- **CSS Grid:** For responsive layouts
- **Flexbox:** For alignment and spacing
- **CSS Variables:** For consistent theming
- **Media Queries:** For mobile responsiveness
- **CSS Animations:** For smooth transitions

#### **User Dashboard Features:**

**1. Navigation Bar (`navbar`)**
**2. Flight Booking Form Integration**
**3. Upgrade Services Section**
**4. Real-time Features**

#### **User Dashboard API Connections:**

**1. Authentication APIs**
**2. Flight Booking APIs**
**3. User Profile APIs**

#### **User Dashboard State Management:**

**1. Local State (React Hooks)**
**2. Redux Integration**

#### **User Dashboard Routing:**

**1. Nested Routes**
**2. Route Protection**

## 👨‍💼 **DETAILED ADMIN DASHBOARD ARCHITECTURE**

### **Admin Dashboard Overview**
The admin dashboard (`src/components/AdminView/AdminDashboard.jsx`) provides comprehensive platform management capabilities including operator verification, fleet approval, and analytics.

#### **Component Structure & Technologies Used:**

**1. Main Admin Component: `AdminDashboard.jsx`**

**Key Features:**
- **Tab-based Navigation:** Multiple admin functions in tabs
- **Real-time Data Fetching:** Live updates from backend
- **Analytics Integration:** Charts and statistics
- **Role-based Access:** Admin-only functionality

**2. Admin Styling: `AdminDashboard.css`**

#### **Admin Dashboard Features:**

**1. Tab Navigation System**
**2. Fleet Management System**
**3. Analytics Dashboard**

#### **Admin Dashboard API Connections:**

**1. Fleet Management APIs**
**2. Analytics APIs**
**3. Operator Management APIs**

#### **Admin Dashboard State Management:**

**1. Local State Management**
**2. Real-time Updates**

#### **Admin Dashboard Analytics:**

**1. Chart Components (Recharts)**
**2. Statistics Cards**

## 🛩️ Core Features & API Connections

### 1. Flight Booking System

#### Empty Leg Booking
**Frontend Components:**
- `src/components/CustomerView/Flight_Booking/EmptyLegPage.jsx`
- `src/components/CustomerView/Flight_Booking/ConfirmEmptyLeg.jsx`

**API Endpoints:**
```javascript
// Backend Routes (src/Routers/EmptyLeg_Router/)
GET    /empty/all                    # Get all empty legs
POST   /empty/search                 # Search empty legs
POST   /empty/add_flight            # Add new empty leg
GET    /empty/suggest/:flightId     # Get suggested empty legs
```

**Data Flow:**
1. Customer searches empty legs with criteria (date, airports, passengers)
2. Frontend calls `/empty/search` with search parameters
3. Backend filters available empty legs based on aircraft capacity and availability
4. Results displayed with booking options
5. Booking confirmation triggers payment processing

#### One-Way & Round Trip Booking
**Frontend Components:**
- `src/components/CustomerView/Flight_Booking/OneWayBooking.jsx`
- `src/components/CustomerView/Flight_Booking/RoundTrip.jsx`

**API Endpoints:**
```javascript
// Backend Routes (src/Routers/Flight_Router/)
POST   /flight/create               # Create new flight
GET    /flight/operator/:operatorId # Get operator flights
POST   /flight/book                 # Book flight
```

**Fleet Availability API:**
```javascript
// Backend Routes (src/Routers/Fleet_Router/)
POST   /fleet/availablefleet       # Get available fleet for booking
GET    /fleet/fleetoperator/:id    # Get operator's fleet
```

### 2. Fleet Management System

#### Operator Fleet Management
**Frontend Components:**
- `src/components/OperatorPage/AddFleet.jsx`
- `src/components/OperatorPage/ManageFleets.jsx`

**API Endpoints:**
```javascript
// Backend Routes (src/Routers/Fleet_Router/)
POST   /fleet/add                   # Add new fleet
GET    /fleet/fleetoperator/:id     # Get operator fleets
PATCH  /fleet/update/:id           # Update fleet details
DELETE /fleet/delete/:id           # Delete fleet
```

**Admin Fleet Approval:**
```javascript
// Backend Routes (src/Routers/Fleet_Router/)
PATCH  /fleet/ApprovalRejection/:id # Admin approve/reject fleet
GET    /fleet/pendingApproval      # Get pending fleet approvals
```

### 3. Payment Processing

#### Cashfree Integration
**Frontend Components:**
- Payment processing in booking confirmation components

**API Endpoints:**
```javascript
// Backend Routes (src/Routers/Payment_Router/)
POST   /pay/create-order           # Create payment order
POST   /pay/verify-payment        # Verify payment
GET    /pay/payment-status/:id    # Get payment status
```

**Payment Flow:**
1. Customer confirms booking
2. Frontend calls `/pay/create-order` with booking details
3. Backend creates Cashfree order and returns payment URL
4. Customer redirected to Cashfree payment gateway
5. Payment verification via webhook/callback
6. Booking confirmed upon successful payment

### 4. Real-time Communication

#### Socket.io Implementation
**Frontend:** `src/components/common/ChatUserOpe.jsx`
**Backend:** `src/index.js` (Socket.io server setup)

**Real-time Features:**
- Live chat between customers and operators
- Real-time booking status updates
- Instant notifications

**Socket Events:**
```javascript
// Frontend Socket Events
socket.emit('join', userId)           # Join user room
socket.emit('chat-message', data)     # Send chat message
socket.on('chat-message', callback)   # Receive chat message
```

### 5. Analytics & Reporting

#### Admin Analytics
**Frontend Components:**
- `src/components/AdminView/AdminDashboardAnalytics.jsx`

**API Endpoints:**
```javascript
// Backend Routes (src/Routers/Analytics_Router/)
GET    /analytics/overview          # Platform overview stats
GET    /analytics/bookings          # Booking analytics
GET    /analytics/fleet-utilization # Fleet usage stats
GET    /analytics/operators         # Operator performance
GET    /analytics/routes            # Popular routes
```

### 6. Invoice Generation

#### PDF Invoice System
**Frontend Components:**
- `src/components/CustomerView/MyBookings.jsx` (Download functionality)

**API Endpoints:**
```javascript
// Backend Routes (src/Routers/Invoice_Router/)
POST   /invoice/empty              # Generate empty leg invoice
GET    /invoice/addon/:id/:paymentId # Generate regular flight invoice
```

## 📊 Database Schema

### Core Models (Backend: src/Models/)

#### User Management

#### Flight & Booking

#### Fleet & Aircraft

## 🔄 Data Flow Architecture

### 1. User Registration & Authentication
```
Frontend → POST /auth/signup → Backend → Database
Frontend → POST /auth/login → Backend → JWT Token → Frontend Storage
```

### 2. Flight Search & Booking
```
Customer Search → Frontend Form → POST /empty/search → Backend Filter → Results
Customer Booking → Frontend → POST /emptylegbooking/create → Payment → Confirmation
```

### 3. Operator Fleet Management
```
Operator → Add Fleet → POST /fleet/add → Admin Approval → Available for Booking
```

### 4. Real-time Communication
```
User Chat → Socket.io → Backend → Database → Socket.io → Operator Chat
```

## 🚀 Development Setup

### Frontend Setup
```bash
cd flycharters_frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd flycharters_backend
npm install
npm run dev
```

### Environment Variables

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8080
```

#### Backend (.env)
```env
Please DM
```

## 📱 Component Architecture

### Frontend Structure
```
src/
├── components/
│   ├── AdminView/           # Admin dashboard & analytics
│   ├── CustomerView/        # User booking interfaces
│   │   └── Flight_Booking/  # Booking flow components
│   ├── OperatorPage/        # Operator management interfaces
│   └── LandingPage/         # Marketing pages
├── context/                 # React context providers
├── layouts/                 # Layout components
├── pages/                   # Main page components
├── routes/                  # Route configuration
├── utils/                   # Utilities & Redux store
└── api/                     # API integration layer
```

### Backend Structure
```
src/
├── Routers/                 # API route handlers
├── Controllers/             # Business logic
├── Models/                  # Database schemas
├── Middlewares/             # Authentication & validation
├── Helpers/                 # Utility functions
└── Databases/               # Database configuration
```

## 🔗 API Integration Points

### Frontend-Backend Communication
1. **Authentication:** JWT tokens with automatic refresh
2. **Real-time:** Socket.io for live updates
3. **File Upload:** Multer + Cloudinary for document management
4. **Payment:** Cashfree API integration
5. **Notifications:** Real-time status updates

### External API Integrations
- **Cashfree Payments:** Payment processing
- **Cloudinary:** File storage and management
- **Email Service:** Nodemailer for notifications

## 🛡️ Security Features

1. **JWT Authentication:** Secure token-based authentication
2. **Role-based Access:** User/Operator/Admin permissions
3. **Input Validation:** Zod schema validation
4. **CORS Configuration:** Secure cross-origin requests
5. **Password Hashing:** bcryptjs for secure passwords

## 📈 Performance Optimizations

1. **Lazy Loading:** React components loaded on demand
2. **Redux Persist:** State persistence across sessions
3. **Socket.io:** Real-time updates without polling
4. **Image Optimization:** Cloudinary for optimized images
5. **Database Indexing:** Optimized MongoDB queries

## 🧪 Testing & Quality

- **ESLint:** Code quality and consistency
- **Error Handling:** Comprehensive error management
- **Logging:** Detailed application logging
- **Validation:** Frontend and backend validation

## 🚀 Deployment

### Frontend Deployment
- Build with Vite: `npm run build`
- Deploy to Vercel/Netlify
- Configure environment variables

### Backend Deployment
- Node.js server deployment
- MongoDB Atlas for database
- Environment variable configuration
- SSL certificate setup

## 📞 Support & Maintenance

### Monitoring
- Application logging
- Error tracking
- Performance monitoring
- User analytics

### Updates
- Regular security updates
- Feature enhancements
- Bug fixes
- Performance optimizations

---


