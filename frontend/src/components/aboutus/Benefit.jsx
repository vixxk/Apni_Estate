import React from "react";
import { motion } from "framer-motion";
import { Home, Globe, Headphones, List } from "lucide-react";

const benefits = [
  {
    icon: Home,
    title: "Verified Properties",
    description:
      "Each listing on ApniEstate is screened so you spend time only on genuine, trustworthy properties.",
  },
  {
    icon: Globe,
    title: "Made for Indian Users",
    description:
      "Filters, locations, and flows designed around how people in India actually search, visit, and finalize homes.",
  },
  {
    icon: Headphones,
    title: "Guided Support",
    description:
      "From shortlisting to site visit, our team and tools help you at every step of the journey.",
  },
  {
    icon: List,
    title: "Organized Listings",
    description:
      "Compare amenities, locality, and pricing side‑by‑side so you can make clear, confident decisions.",
  },
];

export default function Benefits() {
  return (
    <section className="py-12 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Why Choose ApniEstate?</h2>
          <div className="w-16 md:w-24 h-1 bg-blue-600 mx-auto mb-4 md:mb-6"></div>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            ApniEstate combines verified data, smart tools, and a clean
            interface to make property search genuinely easier.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 md:mb-6 transform transition-transform duration-300 hover:rotate-6">
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">{benefit.title}</h3>
                <p className="text-gray-600 text-sm md:text-lg">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
