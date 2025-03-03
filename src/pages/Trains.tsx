
import { useState } from 'react';
import TrainSearch from '@/components/trains/TrainSearch';
import TrainResults from '@/components/trains/TrainResults';

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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Train</h1>
          <p className="text-gray-600">Search and book train tickets across India</p>
        </div>

        <TrainSearch onSearch={handleSearch} />
        {searchPerformed && <TrainResults searchCriteria={searchCriteria} />}
      </div>
    </div>
  );
};

export default Trains;
