
/*'use client';

import React from 'react';
import { FaEnvelope, FaFacebook } from 'react-icons/fa';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8 space-y-12">
      {/* Header */
      /*<div className="text-center">
        <h1 className="text-4xl font-bold text-purple-800">About Us</h1>
        <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
          We are a community-focused organization serving the people of Welivitiya Divithura Agaliya. Our goal is to support and empower citizens through accessible and transparent services.
        </p>
      </div>

      {/* Contact Information */
      /*<div className="bg-white rounded-3xl p-8 shadow-xl max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Contact Information</h2>
        <div className="text-lg space-y-2 text-gray-700">
          <p><strong>Email:</strong> info@welivitiya.gov.lk</p>
          <p><strong>Telephone:</strong> +94 91 222 1234</p>
          <p><strong>Address:</strong> Divisional Secretariat, Welivitiya Divithura, Agaliya, Sri Lanka</p>
        </div>
      </div>

      {/* Location Map */
      /*<div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Location</h2>
        <iframe
          title="Welivitiya Divithura Agaliya Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.6108967825024!2d80.16399941477624!3d6.171128495535235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae19001e5ef3fb9%3A0x4f2c82e184f8ea24!2sWelivitiya-Divithura!5e0!3m2!1sen!2slk!4v1713966543210"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          className="rounded-2xl shadow-lg border"
        ></iframe>
      </div>

      {/* Organization Chart */
      /*<div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Organization Chart</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="font-bold text-lg">Divisional Secretary</h3>
            <p>Mrs. Anula Perera</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="font-bold text-lg">Admin Officer</h3>
            <p>Mr. Saman Silva</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="font-bold text-lg">Development Officer</h3>
            <p>Ms. Nadeesha Fernando</p>
          </div>
        </div>
      </div>
      {/* Footer */
        /*<footer className="mt-20 text-center text-sm text-gray-900 bg-yellow-100 py-6">
          <div className="flex items-center justify-center space-x-4 mb-2">
              <a
                href="mailto:info@welivitiya.gov.lk"
                className="text-gray-600 hover:text-blue-500"
                aria-label="Email"
              >
              <FaEnvelope className="inline w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/WelivitiyaDivithuraDS"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:text-blue-700"
                aria-label="Facebook"
              >
              <FaFacebook className="inline w-5 h-5" />
              </a>
            </div>
              <p>© 2025 Welivitiya Divithura Divisional Secretariat. All rights reserved.</p>
              <p>Developed by the IT Unit | Contact us: info@welivitiya.gov.lk</p>
          </footer>
    </div>
    
  );
}
*/
'use client';

import React from 'react';
import { FaEnvelope, FaFacebook, FaPhone, FaMapMarkerAlt, FaUserTie, FaBuilding, FaUsers, FaHandshake } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function AboutUs() {
  const teamMembers = [
    {
      name: "Mrs. Anula Perera",
      position: "Divisional Secretary",
      bio: "Over 15 years of public service experience with expertise in community development.",
      img: "/images/person.jpg"
    },
    {
      name: "Mr. Saman Silva",
      position: "Admin Officer",
      bio: "Specializes in administrative systems and public service coordination.",
      img: "/images/saman-silva.jpg"
    },
    {
      name: "Ms. Nadeesha Fernando",
      position: "Development Officer",
      bio: "Focuses on sustainable development projects and community empowerment.",
      img: "/images/nadeesha-fernando.jpg"
    }
  ];

  const services = [
    {
      icon: <FaBuilding className="text-3xl text-blue-600" />,
      title: "Government Services",
      description: "Processing official documents, certificates, and licenses"
    },
    {
      icon: <FaUsers className="text-3xl text-green-600" />,
      title: "Community Programs",
      description: "Organizing welfare initiatives and development projects"
    },
    {
      icon: <FaHandshake className="text-3xl text-purple-600" />,
      title: "Public Assistance",
      description: "Support for citizens in need through various aid programs"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-blue-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            About Welivitiya Divithura Secretariat
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl max-w-3xl mx-auto"
          >
            Serving our community with dedication, transparency, and innovation since 1985
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* Mission Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Mission & Vision</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Mission</h3>
              <p className="text-gray-700">
                To deliver efficient, transparent public services that empower our community and foster sustainable development through innovative solutions and compassionate governance.
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-purple-700 mb-3">Vision</h3>
              <p className="text-gray-700">
                A thriving, resilient community where every citizen has equal access to opportunities and services, supported by a responsive and accountable local government.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Services Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">{service.title}</h3>
                <p className="text-gray-600 text-center">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="h-48 bg-gray-200 relative">
                  {/* Placeholder for team member photo */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent flex items-end p-4">
                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-blue-600 font-medium mb-2">{member.position}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="grid md:grid-cols-2">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-blue-600 mt-1 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Address</h3>
                    <p className="text-gray-600">Divisional Secretariat, Welivitiya Divithura, Agaliya, Sri Lanka</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaPhone className="text-blue-600 mt-1 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Telephone</h3>
                    <p className="text-gray-600">+94 91 222 1234</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaEnvelope className="text-blue-600 mt-1 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600">info@welivitiya.gov.lk</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full min-h-80">
              <iframe
                title="Welivitiya Divithura Agaliya Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.6108967825024!2d80.16399941477624!3d6.171128495535235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae19001e5ef3fb9%3A0x4f2c82e184f8ea24!2sWelivitiya-Divithura!5e0!3m2!1sen!2slk!4v1713966543210"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Welivitiya Divithura</h3>
              <p className="text-gray-300">
                Committed to serving our community with excellence and integrity.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/pages/services" className="text-gray-300 hover:text-white transition">Services</a></li>
                <li><a href="/pages/subsides" className="text-gray-300 hover:text-white transition">Subsidies</a></li>
                <li><a href="/pages/about_us" className="text-gray-300 hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a
                  href="mailto:info@welivitiya.gov.lk"
                  className="text-gray-300 hover:text-white transition text-xl"
                  aria-label="Email"
                >
                  <FaEnvelope />
                </a>
                <a
                  href="https://www.facebook.com/WelivitiyaDivithuraDS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition text-xl"
                  aria-label="Facebook"
                >
                  <FaFacebook />
                </a>
              </div>
              <p className="text-gray-300 mt-4">
                © 2025 Welivitiya Divithura Divisional Secretariat
              </p>
              <p className="text-gray-400 text-sm">
                Developed by the IT Unit
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}