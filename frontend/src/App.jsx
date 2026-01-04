import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./components/properties/propertydetail";
import Aboutus from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./components/login";
import Signup from "./components/signup";
import ForgotPassword from "./components/forgetpassword";
import ResetPassword from "./components/resetpassword";
import Footer from "./components/footer";
import NotFoundPage from "./components/Notfound";
import { AuthProvider } from "./context/AuthContext";
import AIPropertyHub from "./pages/Aiagent";
import StructuredData from "./components/SEO/StructuredData";
import Profile from "./pages/Profile";
import "react-toastify/dist/ReactToastify.css";
import SavedProperties from "./pages/SavedProperties.jsx";
import VendorAddService from "./pages/VendorAddProperty.jsx";
import VendorProfile from "./pages/VendorProfile";
import VendorRegister from "./pages/VendorRegister";
import MobileBottomNav from "./components/MobileBottomNav";
import { MobileMenuProvider } from "./context/MobileMenuContext";
import Chat from "./components/Chat.jsx";
import ServicesPage from "./pages/ServicesPage";
import SalesItemsPage from "./pages/SalesItemsPage";
import EverythingPage from "./pages/EverythingPage";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import VendorContactRequests from './pages/VendorContactRequests';

export const Backendurl = import.meta.env.VITE_API_BASE_URL;

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Base website structured data */}
      {!isAdminRoute && (
        <>
          <StructuredData type="website" />
          <StructuredData type="organization" />
        </>
      )}

      <div className="flex flex-col min-h-screen">
        {!isAdminRoute && <Navbar />}

        {/* Main content */}
        <main className={`flex-grow ${!isAdminRoute ? 'md:pb-0' : ''}`}>
          {children}
        </main>

        {!isAdminRoute && (
          <div className="hidden md:block">
            <Footer />
          </div>
        )}

        {!isAdminRoute && <MobileBottomNav />}

        <ToastContainer />
      </div>
    </>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <MobileMenuProvider>
        <AuthProvider>
          <Router>
            <AppLayout>
              <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<VendorRegister />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset/:token" element={<ResetPassword />} />
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/sales-items" element={<SalesItemsPage />} />
                <Route path="/everything" element={<EverythingPage />} />
                <Route path="/properties" element={<Properties />} />
                <Route
                  path="/properties/single/:id"
                  element={<PropertyDetails />}
                />
                <Route path="/about" element={<Aboutus />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/ai-property-hub" element={<AIPropertyHub />} />
                <Route path="/profile" element={<Profile />} />
                <Route
                  path="/vendor/add-service"
                  element={<VendorAddService />}
                />
                <Route path="/vendor/:vendorId" element={<VendorProfile />} />
                <Route path="/saved" element={<SavedProperties />} />
                <Route path="/chat" element={<Chat />} />

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                <Route path="/vendor/contact-requests" element={<VendorContactRequests />} />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AppLayout>
          </Router>
        </AuthProvider>
      </MobileMenuProvider>
    </HelmetProvider>
  );
};

export default App;
