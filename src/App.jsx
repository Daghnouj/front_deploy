import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop"; // ✅ Import ScrollToTop
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/home/Home";
import BookingForm from "./pages/BookingForm";
import Login from "./login/Login";
import Profdashboard from "./pages/prof";
import Galerie from "./pages/profpages/Galerie";
import Partenaires from "./pages/profpages/Partenaires";
import Calendar from "./pages/profpages/Calendar";
import Demandes from "./pages/profpages/Demandes";
import Dashboard from "./pages/profpages/dashboard";
import Profile from "./pages/profpages/profile";
import ContactForm from "./pages/Contact";
import ForgotPassword from "./pages/pass";
import Gallery from "./pages/galerie";
import Community from "./pages/Community/community";
import Location from "./pages/Location";
import UserDash from "./pages/userdash";
import OverviewPage from "./pages/userpages/OverviewPage";
import SchedulePage from "./pages/userpages/SchedulePage";
import RequestsPage from "./pages/userpages/RequestsPage";
import AboutPage from "./pages/apropos";
import PartenairesPage from "./pages/partenaires";
import Messages from "./pages/profpages/Messagerie/Messages";
import MentalHealthCheck from './pages/MentalHealthCheck';
import Professionals from "./pages/professionals";
import OAuthRedirect from "./OAuthRedirect";
import ProfessionalProfile from './pages/ProfessionalProfile';
import SportsRooms from './pages/Sports';
import UserProfilePage from "./pages/userpages/UserProfilePage";



import AdminDash from "./admin/AdminDash";
import AdminOverview from "./admin/AdminOverview";
import UserManagement from "./admin/Users";
import Signin from "./admin/SignIn";
import Signup from "./admin/SignUp";
import AdminProfile from "./admin/ProfilePage";
import VideoGallery from "./admin/admingalerie";
import VerificationRequests from "./admin/demandes";
import PartnersManagement from "./admin/adminpartenaires";
import EventAdmin from "./admin/events";
import ForgotPasswordAdmin from "./admin/ForgotPassword";
import ResetPassword from "./admin/ResetPassword";
import Logout from "./admin/Logout";
import SubscriptionPage from "./pages/SubscriptionPage";
import SuccessPage from "./pages/SuccessPage";
import SignUp from "./login/Register";

const MainLayout = ({ children }) => (
  <>
    <Header />
    <div>{children}</div>
    <Footer />
  </>
);
const App = () => {
  return (
    <Router>
      <ScrollToTop /> {/* ✅ Automatically scrolls to top on route change */}
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/book/:therapistId" element={<MainLayout><BookingForm /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><ContactForm /></MainLayout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/oauth-redirect" element={<OAuthRedirect />} />
        <Route path="/test" element={<MainLayout><MentalHealthCheck /></MainLayout>} />
        <Route path="/subscription" element={<MainLayout><SubscriptionPage /></MainLayout>} />
        <Route path="/success" element={<SuccessPage />} />
        
        <Route path="/galerie" element={<MainLayout><Gallery /></MainLayout>} />
        <Route path="/activities-centres" element={<MainLayout><Location /></MainLayout>} />
        <Route path="/partenaires" element={<MainLayout><PartenairesPage /></MainLayout>} />
        <Route path="/community" element={<MainLayout><Community /></MainLayout>} />
        <Route path="/apropos" element={<MainLayout><AboutPage /></MainLayout>} />
        <Route path="/professionals" element={<MainLayout><Professionals /></MainLayout>} />
        <Route path="/professionals/:id" element={<MainLayout><ProfessionalProfile /> </MainLayout>} />
        <Route path="/sports" element={<MainLayout><SportsRooms /> </MainLayout>} />
        <Route path="/adminsignin" element={<Signin />} />
        <Route path="/adminsignup" element={<Signup />} />
        <Route path="/adminforgot" element={<ForgotPasswordAdmin />} />
        <Route path="/adminreset" element={<ResetPassword />} />
        <Route path="/admin/logout" element={<Logout />} />


        <Route path="/admin" element={<AdminDash />}>
          <Route index element={<AdminOverview />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="galerie" element={<VideoGallery />} />
          <Route path="demandes" element={<VerificationRequests />} />
          <Route path="partenaires" element={<PartnersManagement />} />
          <Route path="events" element={<EventAdmin />} />
          {/* Add other admin routes here when ready */}
          {/* 
          <Route path="users" element={<AdminUsers />} />
          <Route path="galerie" element={<AdminGalerie />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="partenaires" element={<AdminPartenaires />} />
          <Route path="demandes" element={<AdminDemandes />} />
          */}
        </Route>





        {/* Admin Dashboard with Nested Routes */}
        <Route path="/prof" element={<Profdashboard />}>
          <Route index element={<Dashboard />} />
          <Route path="home" element={<Dashboard />} />
          <Route path="galerie" element={<Galerie />} />
          <Route path="partenaires" element={<Partenaires />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="demandes" element={<Demandes />} />
          <Route path="messages" element={<Messages />} />
           <Route path="/prof/messages/users/:userId" element={<Messages />} />

          <Route path="profile" element={<Profile />} />
        </Route>

        {/* User Dashboard with Nested Routes */}
        <Route path="/user" element={<UserDash />}>
          <Route index element={<OverviewPage />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="communications" element={<Messages />} />
          <Route path="profile" element={<UserProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
