import { lazy } from 'react';
import UserLayout from '../layouts/UserLayout.jsx';

// Lazy loading for better performance
const Layout = lazy(() => import('../pages/Layout.jsx'));
// const HomePage = lazy(() => import('../pages/HomePage'));
const Dashboard = lazy(() => import('../pages/Dashboard.jsx'));
const OperatorLayout = lazy(()=> import('../layouts/OperatorLayout.jsx'));
const AddFleet = lazy(() => import('../components/OperatorPage/AddFleet.jsx'));
const ManageFleets = lazy(() => import('../components/OperatorPage/ManageFleets.jsx'));
const BookingStatus = lazy(() => import('../components/OperatorPage/BookingStatus.jsx'));
const Passenger = lazy(() => import('../components/OperatorPage/PassengerManifest.jsx'));
const History = lazy(() => import('../components/OperatorPage/History.jsx'));
const ContactAdmin = lazy(() => import('../components/OperatorPage/ContactAdmin.jsx'));
const MyProfile = lazy(() => import('../components/OperatorPage/MyProfile.jsx'));
const Home = lazy(() => import('../components/OperatorPage/OperatorHome.jsx'));
const FleetFlightHome = lazy(() => import('../components/OperatorPage/FleetFlightHome.jsx'));
const OperatorForm = lazy(() => import('../components/OperatorForm.jsx'));
const EmptyLegsForm = lazy(() => import('../components/OperatorPage/Emptyleg.jsx'));
const LandingCapabilites = lazy(() => import('../components/OperatorPage/LandingCap.jsx'));
const OperatorQuotes = lazy(()=>import('../components/OperatorPage/QuoteCheck.jsx'));
const ChatUserOpe = lazy(()=>import('../components/common/ChatUserOpe.jsx'));


// Footer links
const Faq = lazy(() => import('../pages/footerLinks/Faq.jsx'));
const TeamMembers = lazy(() => import('../pages/footerLinks/Team.jsx'));
const TermsAndConditions = lazy(() => import('../pages/footerLinks/TermsAndCondition.jsx'));
const PrivacyRightsPage = lazy(() => import('../pages/footerLinks/Privacy.jsx'));
const DailyBlogs = lazy(() => import('../pages/footerLinks/Blog.jsx'));
const NewsletterPage = lazy(() => import('../pages/footerLinks/Newsletter.jsx'));
const CareerDevelopmentPage = lazy(() => import('../pages/footerLinks/Career.jsx'));
const LearnEmptyLeg = lazy(() => import('../pages/LearnEmptyLeg.jsx'));

// Customer views
const User_dash = lazy(() => import('../components/CustomerView/User_dash.jsx'));
const FlightBookingForm = lazy(() => import('../components/CustomerView/Flight_Booking/FlightBookingForm.jsx'));
const ProfileEditor = lazy(() => import('../components/CustomerView/ProfileEditor.jsx'));
const ConfirmEmptyLeg = lazy(() => import('../components/CustomerView/Flight_Booking/ConfirmEmptyLeg.jsx'));
const BookingSuccess = lazy(() => import('../components/CustomerView/Flight_Booking/BookingSuccess.jsx'));
const EmptyLegPage = lazy(() => import('../components/CustomerView/Flight_Booking/EmptyLegPage.jsx'));
const MyBookings = lazy(() => import('../components/CustomerView/MyBookings.jsx'));
const AddPetTravel = lazy(() => import('../components/CustomerView/AddPetTravel.jsx'));
const LandCommute = lazy(() => import('../components/CustomerView/LandCommute.jsx'));
const OnboardCatering = lazy(() => import('../components/CustomerView/Catering.jsx'));
const Celebration = lazy(() => import('../components/CustomerView/AddCelebration.jsx'));
const OneWayBooking = lazy(() => import('../components/CustomerView/Flight_Booking/OneWayBooking.jsx'));
import ConfirmOneWay from '../components/CustomerView/Flight_Booking/ConfirmOneWay.jsx';
import BookingSuccessEmptyLeg from '../components/CustomerView/Flight_Booking/BookingSuccessEmptyLeg.jsx';
import BookingSuccessOneWay from '../components/CustomerView/Flight_Booking/BookingSuccessOneWay.jsx';


// Admin views
const AdminDashboard = lazy(() => import('../components/AdminView/AdminDashboard.jsx'));

export const routes = {
    public: [
        { path: '/', element: <Layout /> },
        { path: '/test', element: <Dashboard /> },
        { path: '/faq', element: <Faq /> },
        { path: '/team', element: <TeamMembers /> },
        { path: '/terms', element: <TermsAndConditions /> },
        { path: '/privacy', element: <PrivacyRightsPage /> },
        { path: '/blog', element: <DailyBlogs /> },
        { path: '/membership', element: <DailyBlogs /> },
        { path: '/newsletter', element: <NewsletterPage /> },
        { path: '/referFriend', element: <DailyBlogs /> },
        { path: '/career', element: <CareerDevelopmentPage /> },
        { path: '/learn-empty-leg', element: <LearnEmptyLeg /> },
        { path: '/operator-details', element: <OperatorForm /> },
        

    ],
    user: [
        { 
        path: '/user', 
        element: <UserLayout />,
        children: [
            { path: 'newbooking', element: <FlightBookingForm /> },
            { path: 'bookings', element: <MyBookings /> },
            { path: 'profile', element: <ProfileEditor /> },
            { path: 'empty-leg', element: <EmptyLegPage /> },
            { path: 'confirm-oneway-empty', element: <ConfirmEmptyLeg /> },
            { path: 'booking-success', element: <BookingSuccess /> },
            { path: 'booking-success/:bookingId', element: <BookingSuccessEmptyLeg /> },
            { path: 'booking-success/:bookingId', element: <BookingSuccessOneWay /> },
            { path: 'one-way-booking', element: <OneWayBooking /> },
            { path: 'confirm-oneway-fullflight', element: <ConfirmOneWay /> },
            { path: 'pettravel', element: <AddPetTravel /> },
            { path: 'landcommute', element: <LandCommute /> },
            { path: 'catering', element: <OnboardCatering /> },
            { path: 'celebration', element: <Celebration /> },
            { path: 'chat-to-operator',element:<ChatUserOpe/>}
        ]
        }
    ],
    operator: [
  { 
    path: '/operator', 
    element: <OperatorLayout />,
    children: [
      { 
        index: true,  
        element: (
          <>
            <Home />
            <FleetFlightHome />
          </>
        )
      },
            { path: 'addFleet', element: <AddFleet /> },
            { path: 'uploadLegs', element: <EmptyLegsForm /> },
            { path: 'updateSchedule', element: <LandingCapabilites /> },
            { path: 'booking-status', element: <BookingStatus /> },
            { path: 'passenger-manifest', element: <Passenger /> },
            { path: 'history', element: <History /> },
            { path: 'contact-admin', element: <ContactAdmin /> },
            { path: 'profile', element: <MyProfile /> },
            { path: 'Airport-restriction', element: <ContactAdmin /> },
            { path: 'Check-Quote', element: <OperatorQuotes /> },
            { path: 'chat-to-user/',element:<ChatUserOpe/>}
        ]
        }
    ],
    admin: [
        { path: '/admin', element: <AdminDashboard /> }
    ]
};