
import { useState, useRef, useEffect } from 'react';
import TrainSearch from '@/components/trains/TrainSearch';
import TrainResults from '@/components/trains/TrainResults';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Train, Clock, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  // Popular routes
  const popularRoutes = [
    { from: 'Delhi', to: 'Mumbai', time: '16h 30m', price: '₹1,250' },
    { from: 'Bangalore', to: 'Chennai', time: '6h 45m', price: '₹850' },
    { from: 'Kolkata', to: 'Delhi', time: '17h 20m', price: '₹1,450' },
    { from: 'Mumbai', to: 'Ahmedabad', time: '8h 10m', price: '₹750' }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-blue-100 pt-16 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <motion.div 
          className="absolute top-10 right-10 w-64 h-64 rounded-full bg-blue-300/20 blur-3xl -z-10 animate-blob animation-delay-2000"
          animate={{ 
            x: [0, 30, -30, 0],
            y: [0, 40, -40, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-40 left-10 w-72 h-72 rounded-full bg-indigo-400/20 blur-3xl -z-10 animate-blob animation-delay-4000"
          animate={{ 
            x: [0, -40, 40, 0],
            y: [0, 30, -30, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />

        <motion.div 
          style={{ y, opacity }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 relative"
        >
          <div className="inline-block bg-white/20 backdrop-blur-sm p-2 rounded-full mb-2">
            <div className="bg-indigo-100 p-2 rounded-full">
              <Train className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Train</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Search and book train tickets across India with real-time availability and instant confirmations</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 mb-8 border border-indigo-100"
        >
          <TrainSearch onSearch={handleSearch} />
        </motion.div>
        
        {!searchPerformed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Popular Routes</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-indigo-600 border-indigo-200">
                    View All Routes
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>All Popular Routes</DialogTitle>
                    <DialogDescription>
                      Browse popular train routes across India
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-3 py-4">
                    {[...popularRoutes, ...popularRoutes].map((route, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex gap-2 items-center">
                          <MapPin className="h-4 w-4 text-indigo-600" />
                          <span>{route.from} - {route.to}</span>
                        </div>
                        <span className="text-indigo-600 font-medium">{route.price}</span>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularRoutes.map((route, i) => (
                <motion.div 
                  key={i}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100 hover:shadow-xl transition-all duration-300"
                  whileHover={{ 
                    scale: 1.03,
                    y: -5,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Route</div>
                        <div className="font-semibold text-gray-800 mb-3 flex items-center gap-1">
                          {route.from} 
                          <span className="inline-block w-4 h-px bg-gray-300 mx-1"></span>
                          <Train className="h-3 w-3 text-indigo-600" />
                          <span className="inline-block w-4 h-px bg-gray-300 mx-1"></span>
                          {route.to}
                        </div>
                      </div>
                      <div className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-medium">
                        Popular
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{route.time}</span>
                      </div>
                      <div className="font-semibold text-indigo-700">
                        {route.price}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 bg-gradient-to-r from-indigo-50 to-blue-50 p-3 flex justify-between items-center">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Daily</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-indigo-600 hover:bg-indigo-700 text-xs py-1 h-8"
                      onClick={() => {
                        setSearchCriteria({
                          from: route.from,
                          to: route.to,
                          date: '',
                          trainClass: 'all',
                          trainType: 'all'
                        });
                        setSearchPerformed(true);
                      }}
                    >
                      Book Now
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {searchPerformed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl border border-indigo-100 overflow-hidden"
          >
            <TrainResults searchCriteria={searchCriteria} />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-white text-center shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-4">Travel Smart, Travel Easy</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Get exclusive benefits, real-time updates, and special offers with our premium booking service.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-white text-indigo-700 hover:bg-gray-100">
              Join Premium
            </Button>
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Trains;
