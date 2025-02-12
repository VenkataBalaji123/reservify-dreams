
import { useState } from 'react';
import { Search, Calendar, MapPin, Users, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdvancedSearchProps {
  type: 'events' | 'movies' | 'trains';
  onSearch: (data: any) => void;
}

const AdvancedSearch = ({ type, onSearch }: AdvancedSearchProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Card className="p-6 animate-fade-in-up glass">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder={`${type === 'trains' ? 'From' : 'Location'}`}
            className="pl-10"
          />
        </div>

        {type === 'trains' && (
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="To"
              className="pl-10"
            />
          </div>
        )}

        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="date"
            className="pl-10"
          />
        </div>

        <div className="relative">
          <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Select>
            <SelectTrigger className="pl-10">
              <SelectValue placeholder="Number of people" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Person</SelectItem>
              <SelectItem value="2">2 People</SelectItem>
              <SelectItem value="3">3 People</SelectItem>
              <SelectItem value="4">4+ People</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Advanced Filters
        </Button>

        <Button onClick={() => onSearch({})} className="bg-indigo-600 hover:bg-indigo-700">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {showFilters && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up">
          {type === 'movies' && (
            <>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="action">Action</SelectItem>
                  <SelectItem value="comedy">Comedy</SelectItem>
                  <SelectItem value="drama">Drama</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Show Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}

          {type === 'events' && (
            <>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concert">Concert</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="theater">Theater</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Time of Day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}

          {type === 'trains' && (
            <>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first">First Class</SelectItem>
                  <SelectItem value="second">Second Class</SelectItem>
                  <SelectItem value="sleeper">Sleeper</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Train Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="superfast">Superfast</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Journey Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
        </div>
      )}
    </Card>
  );
};

export default AdvancedSearch;
