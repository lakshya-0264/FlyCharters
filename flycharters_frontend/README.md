# FlyCharters - Complete Documentation

## 🚁 Project Overview

FlyCharters is a comprehensive flight charter booking platform that connects customers, aircraft operators, and administrators in a unified ecosystem. The application supports private jet bookings, empty leg utilization, and multi-user role management.

## 🏗️ Architecture Overview

### Full-Stack Structure
```
flightcharters/
├── flightcharters_frontend/     # React Frontend Application
└── flightcharters_backend/      # Node.js/Express Backend API
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
```javascript
// Technologies: React Hooks, React Router, Lucide React Icons
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, User, Star, Home, LogOut, Search, Calendar, Users, MapPin } from 'lucide-react';
```

**Key Features:**
- **State Management:** Uses React hooks for local state
- **Navigation:** React Router for client-side routing
- **Icons:** Lucide React for consistent iconography
- **Responsive Design:** CSS Grid and Flexbox for layout

**2. Styling Architecture: `User_dash.css`**
```css
/* Component-specific styling with modern CSS features */
.user-dash-container {
    min-height: 100vh;
    background-color: #f8f9fa;
}

.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.3rem 3rem;
    background-color: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    height: 80px;
}
```

**CSS Technologies Used:**
- **CSS Grid:** For responsive layouts
- **Flexbox:** For alignment and spacing
- **CSS Variables:** For consistent theming
- **Media Queries:** For mobile responsiveness
- **CSS Animations:** For smooth transitions

#### **User Dashboard Features:**

**1. Navigation Bar (`navbar`)**
```javascript
// Features: Fixed positioning, user profile dropdown, logout functionality
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [isLoggingOut, setIsLoggingOut] = useState(false);

// Dropdown functionality with hover effects
const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
    }
    setIsDropdownOpen(true);
};
```

**2. Flight Booking Form Integration**
```javascript
// Integrated component for flight search
import FlightBookingForm from "./Flight_Booking/FlightBookingForm";

// Rendered in dashboard content
const DashboardContent = () => (
    <>
        <FlightBookingForm/>
        <UpcomingBookingsOneway/>
        {/* Additional sections */}
    </>
);
```

**3. Upgrade Services Section**
```javascript
const upgradeOptions = [
    { 
        title: 'Add Land Commute',
        image: addlandcommute,
        route: '/user/landcommute'
    },
    { 
        title: 'Add Onboard Catering',
        image: myImage,
        route: '/user/catering'
    },
    {
        title: 'Add Pet Travel',
        image: pettravel,
        route: '/user/pettravel'
    },
    { 
        title: 'Add a Celebration',
        image: celebration,
        route: '/user/celebration'
    }
];
```

**4. Real-time Features**
```javascript
// Socket.io integration for live updates
import NotificationIcon from '../common/Notification.jsx';

// User ID for real-time notifications
const userId = localStorage.getItem("id");
```

#### **User Dashboard API Connections:**

**1. Authentication APIs**
```javascript
// Logout functionality
const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsDropdownOpen(false);
    localStorage.clear();
    localStorage.setItem("showLogoutToast", "true");
    navigate('/', { replace: true });
};
```

**2. Flight Booking APIs**
```javascript
// Integrated through FlightBookingForm component
// APIs called: /fleet/availablefleet, /empty/search, /flight/create
```

**3. User Profile APIs**
```javascript
// User data from localStorage
const first_name = localStorage.getItem("first_name");
```

#### **User Dashboard State Management:**

**1. Local State (React Hooks)**
```javascript
const [feedback, setFeedback] = useState('');
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [isLoggingOut, setIsLoggingOut] = useState(false);
```

**2. Redux Integration**
```javascript
// Connected to Redux store for global state
// User preferences, booking data, authentication state
```

#### **User Dashboard Routing:**

**1. Nested Routes**
```javascript
// UserLayout handles routing with Outlet
const UserLayout = () => {
    return (
        <ProtectedRoute allowedRoles={['user']}>
            <NotificationIcon userId={userId}/>
            <User_dash />
        </ProtectedRoute>
    );
};
```

**2. Route Protection**
```javascript
// ProtectedRoute component ensures only authenticated users access
<ProtectedRoute allowedRoles={['user']}>
    {/* User dashboard content */}
</ProtectedRoute>
```

## 👨‍💼 **DETAILED ADMIN DASHBOARD ARCHITECTURE**

### **Admin Dashboard Overview**
The admin dashboard (`src/components/AdminView/AdminDashboard.jsx`) provides comprehensive platform management capabilities including operator verification, fleet approval, and analytics.

#### **Component Structure & Technologies Used:**

**1. Main Admin Component: `AdminDashboard.jsx`**
```javascript
// Technologies: React Hooks, Fetch API, Recharts, Lucide React
import React, { useState, useEffect } from 'react';
import { LogOut, Users, Truck, Check, X, Eye, Plane, Clock, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';
import OperatorManagement from './OperatorManagement';
import AdminDashboardAnalytics from './AdminDashboardAnalytics';
```

**Key Features:**
- **Tab-based Navigation:** Multiple admin functions in tabs
- **Real-time Data Fetching:** Live updates from backend
- **Analytics Integration:** Charts and statistics
- **Role-based Access:** Admin-only functionality

**2. Admin Styling: `AdminDashboard.css`**
```css
/* Modern admin dashboard styling */
.admin-dashboard {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 1.5rem;
}

.dashboard-container-admin {
  max-width: 80rem;
  margin: 0 auto;
}

/* Responsive grid layouts */
.dashboard-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

#### **Admin Dashboard Features:**

**1. Tab Navigation System**
```javascript
const [activeTab, setActiveTab] = useState('operators');

// Tab switching with visual feedback
<button
  onClick={() => setActiveTab('operators')}
  style={{
    padding: '8px 4px',
    borderBottom: activeTab === 'operators' ? '2px solid #1e40af' : '2px solid transparent',
    fontWeight: '500',
    fontSize: '0.95rem',
    color: activeTab === 'operators' ? '#1e40af' : '#64748b',
  }}
>
  <Users style={{ width: '20px', height: '20px' }} />
  Operator Management
</button>
```

**2. Fleet Management System**
```javascript
const FleetManagement = () => {
  const [fleets, setFleets] = useState([]);
  const [stats, setStats] = useState({ 
    totalFleets: 0, 
    pendingApproval: 0, 
    approvedFleets: 0, 
    maintenanceFleets: 0 
  });
  const [loading, setLoading] = useState(true);
  const [processingFleetId, setProcessingFleetId] = useState(null);
```

**3. Analytics Dashboard**
```javascript
// AdminDashboardAnalytics.jsx - Comprehensive analytics
const AnalyticsDashboard = () => {
  const [data, setData] = useState({
    overview: {},
    bookings: {},
    fleet: {},
    operators: {},
    routes: {}
  });
```

#### **Admin Dashboard API Connections:**

**1. Fleet Management APIs**
```javascript
const API_BASE = 'http://localhost:8080/fleet';

const fetchFleets = async () => {
  try {
    const response = await fetch(`${API_BASE}/fleetsRequestingApproval`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (data.success) {
      setFleets(data.data || []);
    }
  } catch (error) {
    console.error('Error fetching fleets:', error);
  }
};
```

**2. Analytics APIs**
```javascript
const API_BASE = 'http://localhost:8080/analytics';

const fetchData = async (endpoint, key) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const result = await response.json();
    if (result.success) {
      setData(prev => ({ ...prev, [key]: result.data }));
    }
  } catch (error) {
    console.error(`Error fetching ${key} data:`, error);
  }
};
```

**3. Operator Management APIs**
```javascript
// Operator verification and management
const verifyOperator = async (operatorId) => {
  try {
    const response = await fetch(`${API_BASE}/verify/${operatorId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (data.success) {
      alert('Operator verified successfully!');
      fetchOperators();
      fetchStats();
    }
  } catch (error) {
    console.error('Error verifying operator:', error);
  }
};
```

#### **Admin Dashboard State Management:**

**1. Local State Management**
```javascript
// Fleet management state
const [fleets, setFleets] = useState([]);
const [stats, setStats] = useState({});
const [loading, setLoading] = useState(true);
const [processingFleetId, setProcessingFleetId] = useState(null);

// Analytics state
const [data, setData] = useState({
  overview: {},
  bookings: {},
  fleet: {},
  operators: {},
  routes: {}
});
```

**2. Real-time Updates**
```javascript
// Automatic data refresh
useEffect(() => {
  fetchFleets();
  fetchStats();
}, [filter]);

// Periodic updates for analytics
useEffect(() => {
  const interval = setInterval(() => {
    fetchData('/overview', 'overview');
  }, 300000); // 5 minutes
  return () => clearInterval(interval);
}, []);
```

#### **Admin Dashboard Analytics:**

**1. Chart Components (Recharts)**
```javascript
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Booking trends chart
<LineChart data={dailyData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} name="Total" />
  <Line type="monotone" dataKey="confirmed" stroke="#10B981" strokeWidth={2} name="Confirmed" />
  <Line type="monotone" dataKey="cancelled" stroke="#EF4444" strokeWidth={2} name="Cancelled" />
</LineChart>
```

**2. Statistics Cards**
```javascript
const StatCard = ({ title, value, icon: Icon, color = "blue" }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-full bg-${color}-100`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
    </div>
  </div>
);
```

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
```javascript
// userModel.js
{
  name, email, password, role, phone, 
  isVerified, profileImage, createdAt
}

// operatorModel.js  
{
  name, email, password, companyName, 
  isAdminVerify, documents, fleet
}
```

#### Flight & Booking
```javascript
// flightsModel.js
{
  operatorId, departureAirport, destinationAirport,
  departureDate, departureTime, aircraftId,
  price, availableSeats, status
}

// bookingModel.js
{
  userId, flightId, passengerDetails,
  paymentId, bookingStatus, totalAmount
}

// emptylegbookingModel.js
{
  emptyLegId, userId, passengerDetails,
  paymentId, bookingStatus, specialRequests
}
```

#### Fleet & Aircraft
```javascript
// fleetModel.js
{
  operatorId, aircraftId, registrationNumber,
  capacity, isAdminVerify, status, documents
}

// aircraftModel.js
{
  manufacturer, model, type, maxRange,
  maxAltitude, landingCapabilities
}
```

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
cd flightcharters_frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd flightcharters_backend
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
PORT=8080
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CASHFREE_API_ID=your_cashfree_app_id
CASHFREE_API_KEY=your_cashfree_secret_key
ORIGIN=http://localhost:5173
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

**FlyCharters** - Connecting the world through private aviation, one flight at a time.
