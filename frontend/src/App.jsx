import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./components/layout/Navbar";
import Home from "./features/home/HomePage";
import Properties from "./features/properties/PropertiesIndex";
import PropertyDetails from "./features/properties/components/propertydetail";
import Aboutus from "./features/home/About";
import Contact from "./features/contact/Contact";
import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import ForgotPassword from "./features/auth/ForgetPassword";
import ResetPassword from "./features/auth/ResetPassword";
import Footer from "./components/layout/Footer";
import NotFoundPage from "./components/common/NotFound";
import { AuthProvider } from "./context/AuthContext";
import AIPropertyHub from "./features/ai-tools/AiAgent";
import StructuredData from "./components/SEO/StructuredData";
import Profile from "./features/users/UserProfile";
import "react-toastify/dist/ReactToastify.css";
import SavedProperties from "./features/properties/SavedProperties.jsx";
import VendorAddService from "./features/properties/AddProperty.jsx";
import VendorProfile from "./features/users/VendorProfile";
import VendorRegister from "./features/auth/VendorRegister";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import { MobileMenuProvider } from "./context/MobileMenuContext";
import Chat from "./features/chat/Chat.jsx";
import ServicesPage from "./features/services/ServicesPage";
import SalesItemsPage from "./features/services/SalesItemsPage";
import EverythingPage from "./features/home/EverythingPage";
import AdminLogin from "./features/admin/components/AdminLogin";
import AdminDashboard from "./features/admin/components/AdminDashboard";
import VendorContactRequests from "./features/vendor/ContactRequests";
import ChatList from "./features/chat/ChatList.jsx";
import LoanAnalysisPage from "./features/ai-tools/LoanAnalysisPage.jsx";
import AIFeaturesPage from "./features/ai-tools/AIFeaturesPage";
import ComingSoonPage from "./components/common/ComingSoonPage";
import UserProfile from "./features/users/PublicUserProfile";
import ConstructionEstimator from "./features/ai-tools/ConstructionEstimator";
import VastuConsultant from "./features/ai-tools/VastuConsultant";
import ManpowerPage from "./features/manpower/ManpowerPage";

export const Backendurl = import.meta.env.VITE_API_BASE_URL;

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isLoanPage = location.pathname === "/loan-analyzer";
  const isAIPage = location.pathname === "/ai-features" || location.pathname === "/coming-soon";

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

        <main
          className={`flex-grow ${!isAdminRoute ? "pt-20 pb-24 md:pb-0" : ""}`}
        >
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
                <Route path="/reset-password/:token" element={<ResetPassword />} />
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
                <Route path="/user/:userId" element={<UserProfile />} />
                <Route path="/saved" element={<SavedProperties />} />

                <Route path="/chat/:vendorId" element={<Chat />} />
                <Route path="/messages" element={<ChatList />} />

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                <Route path="/vendor/contact-requests" element={<VendorContactRequests />} />

                <Route path="/loan-analyzer" element={<LoanAnalysisPage />} />

                <Route path="*" element={<NotFoundPage />} />

                <Route path="/ai-features" element={<AIFeaturesPage />} />
                <Route path="/construction-estimator" element={<ConstructionEstimator />} />
                <Route path="/vastu-consultant" element={<VastuConsultant />} />
                <Route path="/manpower" element={<ManpowerPage />} />
                <Route path="/coming-soon" element={<ComingSoonPage />} />

              </Routes>
            </AppLayout>
          </Router>
        </AuthProvider>
      </MobileMenuProvider>
    </HelmetProvider>
  );
};

export default App;
