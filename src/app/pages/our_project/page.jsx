
"use client";
import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaFacebook, FaCalendarAlt, FaMapMarkerAlt, FaUserMd, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const OurProject = () => {
  const [programs, setPrograms] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      // Simulate API loading
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const data = [
        {
          id: 1,
          title: 'Public Health Awareness Program',
          date: '2025-04-15',
          location: 'Town Hall Auditorium',
          description: 'A comprehensive session to educate the public on hygiene practices and disease prevention methods.',
          category: 'Health',
          image: '/images/health-awareness.jpg',
          link: '/programs/1',
          speakers: ['Dr. Samantha Perera', 'Dr. Rajitha Fernando']
        },
        {
          id: 2,
          title: 'Community Health Check-up',
          date: '2025-04-20',
          location: 'Divisional Secretariat Premises',
          description: 'Free medical check-ups including blood pressure, sugar levels, and basic consultations with volunteer doctors.',
          category: 'Health',
          image: '/images/health-checkup.jpg',
          link: '/programs/2',
          speakers: ['Dr. Nimal Karunaratne']
        },
        {
          id: 3,
          title: 'Entrepreneurship Workshop',
          date: '2025-05-05',
          location: 'Vocational Training Center',
          description: 'Training session for aspiring entrepreneurs covering business planning, marketing, and financial management.',
          category: 'Economic',
          image: '/images/entrepreneurship.jpg',
          link: '/programs/3',
          speakers: ['Mr. Asela Silva', 'Ms. Priyanka Bandara']
        },
        {
          id: 4,
          title: 'Environmental Conservation Day',
          date: '2025-05-15',
          location: 'Local Park Area',
          description: 'Community tree planting and awareness program about sustainable environmental practices.',
          category: 'Environment',
          image: '/images/environment-day.jpg',
          link: '/programs/4',
          speakers: ['Mr. Chaminda Rathnayake']
        },
        {
          id: 5,
          title: 'Youth Skills Development',
          date: '2025-06-01',
          location: 'Community Center',
          description: 'Workshops on digital literacy, communication skills, and career guidance for young adults.',
          category: 'Education',
          image: '/images/youth-skills.jpg',
          link: '/programs/5',
          speakers: ['Ms. Anoma Wijesinghe', 'Mr. Dilshan Fernando']
        },
        {
          id: 6,
          title: 'Senior Citizens Day',
          date: '2025-06-10',
          location: 'Public Playground',
          description: 'Special event with health talks, entertainment, and benefits information for senior citizens.',
          category: 'Social',
          image: '/images/seniors-day.jpg',
          link: '/programs/6',
          speakers: ['Dr. Harsha Gamage']
        }
      ];
      setPrograms(data);
      setIsLoading(false);
    };

    fetchPrograms();
  }, []);

  const categories = ['All', 'Health', 'Economic', 'Environment', 'Education', 'Social'];
  
  const filteredPrograms = activeFilter === 'All' 
    ? programs 
    : programs.filter(program => program.category === activeFilter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header Section */}
      <header className="bg-blue-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-4"
          >
            Divisional Secretariat Programs
          </motion.h1>
          <p className="text-xl max-w-2xl mx-auto">
            Explore our upcoming community programs and initiatives
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === category 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          /* Programs Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Program Image */}
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                      {program.category}
                    </span>
                  </div>
                </div>

                {/* Program Content */}
                <div className="p-6">
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <FaCalendarAlt className="mr-2" />
                    {new Date(program.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{program.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <FaMapMarkerAlt className="mr-2" />
                    {program.location}
                  </div>
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  
                  {/* Speakers */}
                  {program.speakers && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaUserMd className="mr-2" />
                        Speakers:
                      </h4>
                      <ul className="text-sm text-gray-600">
                        {program.speakers.map((speaker, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
                            {speaker}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <a
                    href={program.link}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    More details <FaInfoCircle className="ml-2" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaCalendarAlt className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No programs found in this category
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Check back later or browse other categories for upcoming events.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-800">Welivitiya Divisional Secretariat</h3>
              <p className="text-gray-600">Serving our community since 1985</p>
            </div>
            
            <div className="flex space-x-6">
              <a
                href="mailto:info@welivitiya.gov.lk"
                className="text-gray-500 hover:text-blue-500 transition-colors"
                aria-label="Email"
              >
                <FaEnvelope className="text-xl" />
              </a>
              <a
                href="https://www.facebook.com/WelivitiyaDivithuraDS"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-700 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="text-xl" />
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-500 text-center">
            <p>© 2025 Welivitiya Divisional Secretariat. All rights reserved.</p>
            <p className="mt-1">Developed by the IT Unit | Contact: info@welivitiya.gov.lk</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OurProject;
