
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

interface TrainSearchProps {
  onSearch: () => void;
}

const TrainSearch = ({ onSearch }: TrainSearchProps) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [trainClass, setTrainClass] = useState('all');
  const [trainType, setTrainType] = useState('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <Card className="p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <Input
              id="from"
              type="text"
              placeholder="Departure Station"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <Input
              id="to"
              type="text"
              placeholder="Arrival Station"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="trainClass" className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <Select value={trainClass} onValueChange={setTrainClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="first">First Class</SelectItem>
                <SelectItem value="second">Second Class</SelectItem>
                <SelectItem value="sleeper">Sleeper</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="trainType" className="block text-sm font-medium text-gray-700 mb-1">Train Type</label>
            <Select value={trainType} onValueChange={setTrainType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="express">Express</SelectItem>
                <SelectItem value="superfast">Superfast</SelectItem>
                <SelectItem value="local">Local</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-center">
          <Button type="submit" className="w-full md:w-auto">Search Trains</Button>
        </div>
      </form>
    </Card>
  );
};

export default TrainSearch;
