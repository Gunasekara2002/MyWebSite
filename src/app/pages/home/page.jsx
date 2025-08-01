

import React from 'react';
import Image from 'next/image';
import { FaEnvelope, FaFacebook } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 px-4 py-12">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-purple-500 to-yellow-500">
            Welivitiya Divithura Divisional Secretariat
          </h1>
          <p className="text-xl text-gray-800 max-w-2xl mx-auto">
            Empowering citizens through excellence in service delivery, governance, and sustainable development.
          </p>
          <div className="flex justify-center">
            <Image
              src="/home_image.jpg"
              alt="Divisional Secretariat"
              width={500}
              height={300}
              className="rounded-3xl shadow-2xl"
            />
          </div>
        </section>

        {/* Vision & Mission Section */
        /*<section className="bg-white rounded-3xl shadow-lg px-8 py-12 grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-semibold text-blue-700">Our Vision</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              To be the leading divisional secretariat that ensures sustainable development
              and delivers quality public service for a better future.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-semibold text-pink-700">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              To deliver efficient, effective, and people-friendly administrative and development services
              through transparency, integrity, and active community engagement.
            </p>
          </div>
        </section>*/}

        {/* Services Overview */}
        <section className="bg-white rounded-3xl shadow-lg p-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-blue-800 mb-4">Digital Transformation of Public Services</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              This platform modernizes public service delivery by streamlining processes, reducing paperwork,
              and improving access for both citizens and government employees. With secure digital solutions,
              we ensure efficiency, transparency, and timely service.
            </p>
          </div>
          <div>
            <Image
              src="/office1.jpg"
              alt="Digital Services"
              width={550}
              height={400}
              className="rounded-xl shadow-xl"
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-yellow-100 text-gray-900 py-8 mt-10 rounded-2xl shadow-inner text-center space-y-4">
          <div className="flex justify-center items-center space-x-6">
            <a
              href="mailto:info@welivitiya.gov.lk"
              className="text-gray-700 hover:text-blue-600 transition"
              aria-label="Email"
            >
              <FaEnvelope className="w-6 h-6" />
            </a>
            <a
              href="https://www.facebook.com/WelivitiyaDivithuraDS"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-700 transition"
              aria-label="Facebook"
            >
              <FaFacebook className="w-6 h-6" />
            </a>
          </div>
          <p className="text-sm">&copy; 2025 Welivitiya Divithura Divisional Secretariat. All rights reserved.</p>
          <p className="text-sm">Developed by the IT Unit | Contact: <a href="mailto:info@welivitiya.gov.lk" className="text-blue-700 hover:underline">info@welivitiya.gov.lk</a></p>
        </footer>
      </div>
    </div>
  );
};

export default Home;


            
          
            
      


