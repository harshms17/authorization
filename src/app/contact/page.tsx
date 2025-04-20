'use client';

import { motion } from 'framer-motion';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

export default function Contact() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white px-4 py-16">
      <motion.div
        className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-10 border border-gray-200"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
          📬 Contact Us
        </h1>

        <p className="text-gray-600 text-center mb-10">
          Reach out to us with any queries or feedback—we’d love to connect!
        </p>

        <div className="space-y-6 text-gray-800">
          {/* <div className="flex items-start gap-4">
            <FaUser className="text-indigo-500 text-xl mt-1" />
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">Harsh Sharma</p>
            </div>
          </div> */}

          <div className="flex items-start gap-4">
            <FaEnvelope className="text-indigo-500 text-xl mt-1" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">harsh23cse404@rtu.ac.in</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FaPhoneAlt className="text-indigo-500 text-xl mt-1" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">+91 93524 77134</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FaMapMarkerAlt className="text-indigo-500 text-xl mt-1" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">Rajasthan, India</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
