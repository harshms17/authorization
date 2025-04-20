'use client';

import { motion } from 'framer-motion';
import { FaUserShield, FaUsers, FaGlobe } from 'react-icons/fa';

export default function About() {
  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-gray-50 to-white text-gray-800">
      <div className="max-w-5xl mx-auto">
        <motion.h1 
          className="text-4xl font-extrabold text-center mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🌐 About This Project
        </motion.h1>

        <motion.p 
          className="text-center max-w-3xl mx-auto mb-10 text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          This is a full-stack, role-based user management system designed for hierarchical and secure user approval flows. It empowers admins to control access within specific regions, while super admins maintain global oversight. From user sign-up to status updates—every action is streamlined and secure.
        </motion.p>

        {/* Project Roles */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: <FaUsers className="text-3xl text-indigo-600" />,
              title: "User",
              desc: "Registers, waits for approval, and gets access to their personal dashboard."
            },
            {
              icon: <FaUserShield className="text-3xl text-green-600" />,
              title: "Admin",
              desc: "Manages users in their assigned region, updates statuses, and monitors activity."
            },
            {
              icon: <FaGlobe className="text-3xl text-red-500" />,
              title: "Super Admin",
              desc: "Full control over users and admins across all regions. Can promote users to admins."
            }
          ].map((role, index) => (
            <motion.div 
              key={index}
              className="bg-white shadow-md p-6 rounded-2xl hover:shadow-xl transition"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="mb-4">{role.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
              <p className="text-gray-600">{role.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Technologies */}
        <motion.h2 
          className="text-2xl font-bold mb-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          🛠️ Technologies Used
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
          {[
            { tech: 'HTML/CSS', desc: 'Foundation for structure and styling of UI pages.' },
            { tech: 'Tailwind CSS', desc: 'Utility-first CSS framework for fast styling.' },
            { tech: 'React', desc: 'Component-based frontend framework.' },
            { tech: 'Next.js', desc: 'Full-stack framework for routing, SSR, and API routes.' },
            { tech: 'MongoDB', desc: 'NoSQL database storing users, roles, and regions.' },
            { tech: 'Mongoose', desc: 'ODM for schema definition and DB interaction.' },
            { tech: 'JWT', desc: 'Secure token-based authentication via HttpOnly cookies.' },
            { tech: 'Vercel', desc: 'Deployment platform for Next.js frontend and APIs.' },
            { tech: 'Git & GitHub', desc: 'Version control and collaboration tools.' },
            { tech: 'Zod', desc: 'Schema validation for type-safe API handling.' },
            { tech: 'Framer Motion', desc: 'Smooth animations and transitions in the UI.' },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="p-4 bg-gray-100 rounded-xl hover:shadow-md transition"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <h4 className="text-lg font-semibold">{item.tech}</h4>
              <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Summary Section */}
        <motion.div 
          className="mt-16 bg-indigo-50 p-8 rounded-xl text-center shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-4">✨ Why This Project?</h3>
          <p className="max-w-3xl mx-auto text-gray-700">
            This app was built to serve organizations where controlled user access and regional management are essential—like NGOs, internal company portals, or educational systems. With intuitive controls and flexible roles, managing people and permissions is finally simple.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
