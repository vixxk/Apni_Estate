import { useState } from "react";
import {
  Home,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ChevronRight,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Heart,
  Star,
  Zap,
  Shield,
  Award,
  Building2,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const SocialLinks = () => {
  const links = [
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/company/apni-estate/",
      label: "LinkedIn",
      color: "hover:bg-[#0077B5]"
    }
  ];

  return (
    <div className="flex gap-3">
      {links.map(({ icon: Icon, href, label, color }) => (
        <motion.a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 transition-all duration-300 ${color} hover:text-white hover:shadow-lg`}
          aria-label={label}
        >
          <Icon className="w-5 h-5" />
        </motion.a>
      ))}
    </div>
  );
};

const FooterColumn = ({ title, children }) => (
  <div className="flex flex-col space-y-4">
    <h3 className="text-lg font-bold text-gray-900 relative inline-block">
      {title}
      <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-600 rounded-full"></span>
    </h3>
    <ul className="space-y-3 pt-2">{children}</ul>
  </div>
);

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="group flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
    >
      <ChevronRight className="w-4 h-4 mr-2 text-blue-400 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
      <span className="group-hover:translate-x-1 transition-transform duration-200">
        {children}
      </span>
    </Link>
  </li>
);

// Mobile Accordion
const MobileFooterAccordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-base font-semibold text-gray-900">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <ul className="pb-4 space-y-3 pl-2 text-gray-600">
              {children}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const companyRoutes = [
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const exploreRoutes = [
    { name: "Properties", path: "/properties" },
    { name: "Services", path: "/services" },
    { name: "Loan Analyzer", path: "/loan-analyzer" },
    { name: "Vendor Registration", path: "/register" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 pt-16 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Section: Grid Layout for Desktop */}
        <div className="hidden lg:grid grid-cols-12 gap-8 mb-16">
          {/* Brand Info - Spans 4 Cols */}
          <div className="col-span-4 pr-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg group-hover:bg-blue-700 transition-colors">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">ApniEstate</span>
            </Link>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Your trusted partner in finding the perfect home. We bridge the gap
              between dreams and reality with cutting-edge technology and
              personalized real estate services.
            </p>
            <SocialLinks />
          </div>

          {/* Spacer */}
          <div className="col-span-1"></div>

          {/* Quick Links - Spans 2 Cols */}
          <div className="col-span-2">
            <FooterColumn title="Company">
              {companyRoutes.map((link) => (
                <FooterLink key={link.name} to={link.path}>
                  {link.name}
                </FooterLink>
              ))}
            </FooterColumn>
          </div>

          {/* Explore - Spans 2 Cols */}
          <div className="col-span-2">
            <FooterColumn title="Explore">
              {exploreRoutes.map((link) => (
                <FooterLink key={link.name} to={link.path}>
                  {link.name}
                </FooterLink>
              ))}
            </FooterColumn>
          </div>

          {/* Contact - Spans 3 Cols */}
          <div className="col-span-3">
            <div className="flex flex-col space-y-4">
              <h3 className="text-lg font-bold text-gray-900 relative inline-block">
                Contact Us
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-600 rounded-full"></span>
              </h3>
              <div className="space-y-4 pt-2">
                <a
                  href="https://www.google.com/maps/place/Tripura"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <MapPin className="w-5 h-5 flex-shrink-0" />
                  </div>
                  <span className="text-gray-600 mt-1 group-hover:text-blue-600 transition-colors">
                    Tripura, Agartala,<br />India
                  </span>
                </a>

                <a
                  href="tel:+916009396197"
                  className="flex items-center gap-3 group"
                >
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Phone className="w-5 h-5 flex-shrink-0" />
                  </div>
                  <span className="text-gray-600 group-hover:text-blue-600 transition-colors">
                    +91 6009396197
                  </span>
                </a>

                <a
                  href="mailto:apniestateofficial@gmail.com"
                  className="flex items-center gap-3 group"
                >
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Mail className="w-5 h-5 flex-shrink-0" />
                  </div>
                  <span className="text-gray-600 group-hover:text-blue-600 transition-colors">
                    apniestateofficial@gmail.com
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View: Accordion */}
        <div className="lg:hidden mb-12 space-y-6">
          {/* Mobile Brand */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg shadow-md">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">ApniEstate</span>
            </Link>
            <p className="text-gray-600 mb-6 text-sm">
              Your trusted partner in finding the perfect home.
            </p>
            <div className="flex justify-center">
              <SocialLinks />
            </div>
          </div>

          <MobileFooterAccordion title="Company">
            {companyRoutes.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="block py-1 hover:text-blue-600">
                  {link.name}
                </Link>
              </li>
            ))}
          </MobileFooterAccordion>

          <MobileFooterAccordion title="Explore">
            {exploreRoutes.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="block py-1 hover:text-blue-600">
                  {link.name}
                </Link>
              </li>
            ))}
          </MobileFooterAccordion>

          <MobileFooterAccordion title="Contact Us">
            <li className="flex items-center gap-3 py-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Tripura, Agartala</span>
            </li>
            <li className="flex items-center gap-3 py-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>+91 6009396197</span>
            </li>
            <li className="flex items-center gap-3 py-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span className="break-all">apniestateofficial@gmail.com</span>
            </li>
          </MobileFooterAccordion>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 py-8 bg-gray-50/50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mt-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 text-sm text-gray-500">
              <p className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-blue-600" />
                &copy; {currentYear} ApniEstate.
              </p>
              <span className="hidden md:inline">|</span>
              <p>All Rights Reserved.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                <Award className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">Verified</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-700">Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

FooterColumn.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

FooterLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

MobileFooterAccordion.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Footer;
