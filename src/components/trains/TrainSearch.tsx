
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from 'framer-motion';
import { Train, MapPin, CalendarRange, ArrowRight } from 'lucide-react';

interface TrainSearchProps {
  onSearch: (criteria: {
    from: string;
    to: string;
    date: string;
    trainClass: string;
    trainType: string;
  }) => void;
}

const TrainSearch = ({ onSearch }: TrainSearchProps) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [trainClass, setTrainClass] = useState('all');
  const [trainType, setTrainType] = useState('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      from,
      to,
      date,
      trainClass,
      trainType
    });
  };

  return (
    <Card className="p-6 mb-8 shadow-lg hover:shadow-xl transition-shadow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <MapPin className="h-4 w-4 mr-1" /> From
            </label>
            <Input
              id="from"
              type="text"
              placeholder="Departure Station"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
              className="transition-all focus:ring-2 focus:ring-primary"
            />
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <MapPin className="h-4 w-4 mr-1" /> To
            </label>
            <Input
              id="to"
              type="text"
              placeholder="Arrival Station"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              className="transition-all focus:ring-2 focus:ring-primary"
            />
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <CalendarRange className="h-4 w-4 mr-1" /> Date
            </label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="transition-all focus:ring-2 focus:ring-primary"
            />
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <label htmlFor="trainClass" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Train className="h-4 w-4 mr-1" /> Class
            </label>
            <Select value={trainClass} onValueChange={setTrainClass}>
              <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="first">First Class</SelectItem>
                <SelectItem value="second">Second Class</SelectItem>
                <SelectItem value="sleeper">Sleeper</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <label htmlFor="trainType" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Train className="h-4 w-4 mr-1" /> Train Type
            </label>
            <Select value={trainType} onValueChange={setTrainType}>
              <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="express">Express</SelectItem>
                <SelectItem value="superfast">Superfast</SelectItem>
                <SelectItem value="local">Local</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </div>
        
        <div className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              type="submit" 
              className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-2"
            >
              Search Trains
            </Button>
          </motion.div>
        </div>
      </form>
    </Card>
  );
};

export default TrainSearch;
