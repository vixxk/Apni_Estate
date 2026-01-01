import { motion } from "framer-motion";
import { MessageCircle, Mail, Bell, Sparkles, ArrowRight } from "lucide-react";

const Chat = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8 md:py-12">
      <div className="w-full max-w-2xl">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-8 md:px-10 md:py-12 text-center">
            {/* Animated Background Elements */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full blur-3xl"
            />

            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative inline-block"
            >
              <div className="bg-white/20 backdrop-blur-sm p-4 md:p-6 rounded-2xl md:rounded-3xl">
                <MessageCircle className="w-12 h-12 md:w-16 md:h-16 text-white" strokeWidth={1.5} />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1 -right-1 md:-top-2 md:-right-2"
              >
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-yellow-300" />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative mt-6 text-3xl md:text-5xl font-bold text-white mb-2 md:mb-3"
            >
              Chat Coming Soon
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative text-blue-100 text-sm md:text-lg max-w-md mx-auto"
            >
              We're building something amazing for real-time conversations
            </motion.p>
          </div>

          {/* Content Section */}
          <div className="px-6 py-8 md:px-10 md:py-12">
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-10">
              {[
                "Real-time Messaging",
                "File Sharing",
                "Voice Messages",
                "Group Chats",
              ].map((feature, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs md:text-sm font-medium"
                >
                  {feature}
                </motion.span>
              ))}
            </div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mb-8 md:mb-10"
            >
              <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
                Our chat feature is currently under development. Get notified when we launch and be among the first to experience seamless real-time communication.
              </p>
            </motion.div>

            {/* Notify Form */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="max-w-md mx-auto"
            >
              <div className="relative">
                <Mail className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 border-2 border-gray-200 rounded-xl md:rounded-2xl focus:border-blue-500 focus:outline-none transition-colors text-sm md:text-base"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-3 md:mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                <Bell className="w-4 h-4 md:w-5 md:h-5" />
                Notify Me When Ready
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </motion.button>
            </motion.div> */}

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 md:mt-12 grid grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-gray-200"
            >
              {[
                { label: "Users Waiting", value: "2,450+" },
                { label: "Features", value: "15+" },
                { label: "Launch", value: "Q1 2026" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-[10px] md:text-sm text-gray-500 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-center mt-6 md:mt-8 text-xs md:text-sm text-gray-500"
        >
          Have questions?{" "}
          <a
            href="mailto:apniestateofficial@gmail.com"
            className="text-blue-600 hover:text-blue-700 font-medium underline"
          >
            Contact us
          </a>
        </motion.p>
      </div>
    </div>
  );
};

export default Chat;
