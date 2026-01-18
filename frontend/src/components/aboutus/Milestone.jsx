import React from "react";
import { motion } from "framer-motion";
import { Home, Target } from "lucide-react";
import CountUp from "./Contup";

const milestones = [
  {
    icon: Home,
    title: "Properties Explored",
    value: 5134,
    description: "Homes browsed and shortlisted through ApniEstate.",
  },
  {
    icon: Target,
    title: "Happy Users",
    value: 104,
    description: "People who used ApniEstate to move closer to their ideal home.",
  },
];

export default function Milestones() {
  return (
    <section className="py-12 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Our Journey So Far</h2>
          <div className="w-16 md:w-24 h-1 bg-blue-600 mx-auto mb-4 md:mb-6"></div>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Milestones that show how ApniEstate is helping people find better
            homes, faster.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-12 max-w-4xl mx-auto">
          {milestones.map((milestone, index) => {
            const Icon = milestone.icon;
            return (
              <motion.div
                key={milestone.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 md:w-24 md:h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Icon className="w-8 h-8 md:w-12 md:h-12 text-blue-600" />
                </div>
                <h3 className="text-3xl md:text-5xl font-bold text-blue-600 mb-2 md:mb-4">
                  <CountUp from={0} to={milestone.value} duration={2} separator="," />
                </h3>
                <p className="text-lg md:text-2xl font-semibold mb-2 md:mb-3">{milestone.title}</p>
                <p className="text-gray-600 text-sm md:text-lg">{milestone.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
