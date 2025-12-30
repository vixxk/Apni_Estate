import { motion } from "framer-motion";
import { Shield, Sparkles, Users, Home, Star } from "lucide-react";
import heroimage from "../assets/images/heroimage.png";
import { RadialGradient } from "react-text-gradients";
import { useNavigate } from "react-router-dom";


/* ================= IMAGE IMPORTS ================= */
import constructionServices from "../assets/construction.png";
import interior from "../assets/interior.png";
import legal from "../assets/legal.png";
import vastu from "../assets/vastu.png";
// import consulting from "../assets/consulting.png";
import loan from "../assets/loan.png";
import materials from "../assets/materials.png";
import houses from "../assets/houses.png";
import apartments from "../assets/apartments.png";
import shops from "../assets/shops.png";
import commercialPlots from "../assets/commercial-plots.png";
// import farmHouse from "../assets/farm-house.png";


/* ================= DATA ================= */
const services = [
  { title: "Construction Services", img: constructionServices },
  { title: "Interior Designing", img: interior },
  { title: "Legal Service", img: legal },
  { title: "Vastu", img: vastu },
  // { title: "Construction Consulting", img: consulting },
  { title: "Home Loan", img: loan },
  { title: "Construction Materials", img: materials },
  { title: "Houses", img: houses },
  { title: "Apartments", img: apartments },
  { title: "Shops", img: shops },
  { title: "Plots", img: commercialPlots },
  // { title: "Farm House", img: farmHouse },
];


const stats = [
  {
    icon: Users,
    value: "50K+",
    label: "Happy Customers",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Home,
    value: "10K+",
    label: "Properties Listed",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Star,
    value: "4.9",
    label: "Average Rating",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    value: "100%",
    label: "Verified Properties",
    color: "from-purple-500 to-pink-500",
  },
];


/* ================= ANIMATIONS ================= */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};


const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 90, damping: 18 },
  },
};


const floatingAnimation = {
  y: [-10, 10, -10],
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
};


const sparkleAnimation = {
  scale: [1, 1.2, 1],
  rotate: [0, 180, 360],
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
};


/* ================= COMPONENT ================= */
const Hero = () => {
  const navigate = useNavigate();


  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50" />


        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroimage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
        </motion.div>


        {/* Floating blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={floatingAnimation}
            className="absolute top-20 left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [10, -10, 10],
              transition: { duration: 8, repeat: Infinity },
            }}
            className="absolute top-40 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
          />
        </div>


        {/* Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={sparkleAnimation}
              className="absolute text-yellow-400/60"
              style={{ top: `${20 + i * 10}%`, left: `${15 + i * 12}%` }}
            >
              <Sparkles />
            </motion.div>
          ))}
        </div>
      </div>


      {/* ================= CONTENT ================= */}
      <div className="relative z-10 min-h-screen flex items-center px-4 py-8">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Trust Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 rounded-full shadow mb-8"
            >
              {/* <Shield className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-700">
                Trusted by 50,000+ families
              </span> */}
            </motion.div>


            {/* Heading */}
            <motion.div variants={itemVariants} className="mb-12">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
                <RadialGradient gradient={["circle, #3f5efb 0%, #fc466b 100%"]}>
                  Find Your Perfect
                </RadialGradient>
                <br />
                <span className="text-gray-900">Dream Home</span>
              </h1>


              <p className="hidden sm:block text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto">
                All property services you need — buying, selling, construction &
                more
              </p>
            </motion.div>


            {/* ================= SERVICES GRID ================= */}
            <motion.div
              variants={itemVariants}
              className="max-w-6xl mx-auto mb-12"
            >
              <div className="bg-white/95 rounded-3xl p-4 sm:p-8 shadow-2xl">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-10">
                  ALL YOUR <span className="text-purple-600">REAL ESTATE</span>{" "}
                  NEEDS IN ONE PLACE
                </h2>


                {/* Mobile: 4 columns, Tablet+: Original layout */}
                <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
                  {services.map((service, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -6, scale: 1.05 }}
                      onClick={() => navigate("/properties")}
                      className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-5 shadow-md hover:shadow-xl cursor-pointer group"
                    >
                      <div
                        className="w-12 h-12 sm:w-24 sm:h-24 mx-auto mb-2 sm:mb-4 rounded-lg sm:rounded-2xl bg-gradient-to-br 
                                      from-purple-50 to-blue-50 flex items-center 
                                      justify-center shadow-inner group-hover:scale-110 transition-transform"
                      >
                        <img
                          src={service.img}
                          alt={service.title}
                          className="w-8 h-8 sm:w-16 sm:h-16 object-contain"
                        />
                      </div>


                      <p className="font-semibold text-gray-800 text-center text-[10px] sm:text-base leading-tight">
                        {service.title}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>


            {/* ================= STATS ================= */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-4 gap-3 sm:gap-6 lg:gap-10 max-w-3xl mx-auto"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="bg-white/90 rounded-lg sm:rounded-xl p-2 sm:p-4 shadow text-center hover:shadow-xl transition-all"
                >
                  <div
                    className={`w-8 h-8 sm:w-12 sm:h-11 mx-auto mb-1 sm:mb-3 bg-gradient-to-br ${stat.color} 
                                rounded-lg sm:rounded-xl flex items-center justify-center`}
                  >
                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="text-base sm:text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-[9px] sm:text-xs text-gray-600 leading-tight">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};


export default Hero;
