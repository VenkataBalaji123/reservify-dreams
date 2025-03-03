
import { useState } from 'react';
import TrainSearch from '@/components/trains/TrainSearch';
import TrainResults from '@/components/trains/TrainResults';
import { motion } from 'framer-motion';

const Trains = () => {
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    from: '',
    to: '',
    date: '',
    trainClass: 'all',
    trainType: 'all'
  });

  const handleSearch = (criteria) => {
    setSearchCriteria(criteria);
    setSearchPerformed(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Train</h1>
          <p className="text-gray-600">Search and book train tickets across India</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TrainSearch onSearch={handleSearch} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <TrainResults searchCriteria={searchCriteria} />
        </motion.div>
      </div>
    </div>
  );
};

export default Trains;
