import { Outlet } from 'react-router-dom';
import Header from '../components/OperatorPage/OperatorHeader';
import Footer from '../components/LandingPage/Footer';
// import NotificationIcon from '../components/common/Notification';
import ProtectedRoute from '../components/ProtectedRoute';
import ChatIcon from '../components/common/ChatAdmin';
// import ChatUserOpe from '../components/common/ChatUserOpe'

const userId = localStorage.getItem("id");
const OperatorLayout = () => {
  return (
    <>
      <ProtectedRoute allowedRoles={['operator']}>
        <Header />
          <section id="home">
            <Outlet />
          </section>
        {/* <NotificationIcon userId={userId}/> */}
        <ChatIcon userId={userId}/>
        {/* <ChatUserOpe/> */}
        <Footer />
      </ProtectedRoute>
    </>
  );
};


export default OperatorLayout;