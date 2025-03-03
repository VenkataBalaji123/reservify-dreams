
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Train, IndianRupee, Clock, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';

interface SearchCriteria {
  from: string;
  to: string;
  date: string;
  trainClass: string;
  trainType: string;
}

interface TrainResultsProps {
  searchCriteria: SearchCriteria;
}

const TrainResults = ({ searchCriteria }: TrainResultsProps) => {
  const [selectedTrain, setSelectedTrain] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: trains, isLoading } = useQuery({
    queryKey: ['trains', searchCriteria],
    queryFn: async () => {
      let query = supabase
        .from('train_routes')
        .select('*')
        .gte('departure_time', new Date().toISOString())
        .order('departure_time', { ascending: true });

      // Apply filters if provided
      if (searchCriteria.from) {
        query = query.ilike('departure_station', `%${searchCriteria.from}%`);
      }
      
      if (searchCriteria.to) {
        query = query.ilike('arrival_station', `%${searchCriteria.to}%`);
      }
      
      if (searchCriteria.date) {
        const selectedDate = new Date(searchCriteria.date);
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        
        query = query
          .gte('departure_time', selectedDate.toISOString())
          .lt('departure_time', nextDay.toISOString());
      }
      
      if (searchCriteria.trainType && searchCriteria.trainType !== 'all') {
        query = query.eq('train_type', searchCriteria.trainType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    }
  });

  const handleSelect = (trainId: string) => {
    setSelectedTrain(trainId);
    navigate(`/trains/${trainId}/seats`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!trains || trains.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">No trains found matching your criteria.</p>
        <p className="text-sm mt-2">Try adjusting your search parameters.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {trains.map((train) => (
        <Card key={train.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Train className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{train.train_name}</h3>
                <p className="text-sm text-gray-500">Train #{train.train_number}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="text-center">
                <p className="font-semibold">{format(new Date(train.departure_time), 'HH:mm')}</p>
                <p className="text-sm text-gray-500">{train.departure_station}</p>
              </div>

              <div className="hidden md:block">
                <div className="w-32 h-px bg-gray-300 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <p className="text-xs text-gray-500">
                      {format(new Date(train.arrival_time), 'HH:mm')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="font-semibold">{format(new Date(train.arrival_time), 'HH:mm')}</p>
                <p className="text-sm text-gray-500">{train.arrival_station}</p>
              </div>

              <div className="ml-auto flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold flex items-center">
                    <IndianRupee className="h-5 w-5" />
                    {train.base_price.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-gray-500">{train.available_seats} seats left</p>
                </div>
                <Button onClick={() => handleSelect(train.id)}>Select</Button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(train.departure_time), 'dd MMM yyyy')}
            </div>
            <div className="flex items-center gap-1">
              <Train className="h-4 w-4" />
              {train.train_type}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TrainResults;
