
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Filter, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Language, MovieCategory } from '@/types/movie';

interface MovieSearchProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  title?: string;
  language_id?: string;
  category_id?: string;
  date?: string;
  rating?: number;
  duration?: [number, number];
  priceRange?: [number, number];
}

const MovieSearch = ({ onSearch }: MovieSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  const { data: languages } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('languages')
        .select('*');
      if (error) throw error;
      return data as Language[];
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['movie-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movie_categories')
        .select('*');
      if (error) throw error;
      return data as MovieCategory[];
    }
  });

  // Real-time search
  useEffect(() => {
    // Only trigger search if title is present to avoid too many searches
    if (filters.title && filters.title.length > 2) {
      const debounceTimeout = setTimeout(() => {
        onSearch(filters);
      }, 500);
      
      return () => clearTimeout(debounceTimeout);
    }
  }, [filters.title, onSearch]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters.language_id && filters.language_id !== 'all') count++;
    if (filters.category_id && filters.category_id !== 'all') count++;
    if (filters.date) count++;
    if (filters.rating) count++;
    if (filters.duration) count++;
    if (filters.priceRange) count++;
    
    setActiveFilterCount(count);
  }, [filters]);

  const handleInputChange = (field: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleDurationChange = (values: number[]) => {
    setFilters(prev => ({ ...prev, duration: [values[0], values[1]] }));
  };

  const handlePriceChange = (values: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: [values[0], values[1]] }));
  };

  const clearFilters = () => {
    setFilters({
      title: filters.title,
      language_id: 'all',
      category_id: 'all',
      date: undefined,
      rating: undefined,
      duration: undefined,
      priceRange: undefined
    });
  };

  return (
    <Card className="p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Movie Title
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="title"
                type="text"
                placeholder="Search movies..."
                className="pl-10"
                value={filters.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <Select 
              value={filters.language_id || 'all'} 
              onValueChange={(value) => handleInputChange('language_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages?.map((lang) => (
                  <SelectItem key={lang.id} value={lang.id}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Select 
              value={filters.category_id || 'all'} 
              onValueChange={(value) => handleInputChange('category_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-auto">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Show Date
            </label>
            <Input
              id="date"
              type="date"
              className="w-full md:w-auto"
              value={filters.date || ''}
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
          </div>

          <Popover open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" className="ml-auto">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-2" variant="secondary">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <h4 className="font-medium">Advanced Filters</h4>
                
                <div>
                  <label className="text-sm font-medium">Rating</label>
                  <Select 
                    value={filters.rating?.toString() || ''}
                    onValueChange={(value) => handleInputChange('rating', value ? parseFloat(value) : undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Rating</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="3">3+ Stars</SelectItem>
                      <SelectItem value="2">2+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Duration (minutes)</label>
                  <div className="px-2">
                    <Slider
                      defaultValue={[90, 180]}
                      value={filters.duration || [90, 180]}
                      min={60}
                      max={240}
                      step={15}
                      onValueChange={handleDurationChange}
                      className="my-6"
                    />
                    <div className="flex justify-between text-sm">
                      <span>{filters.duration?.[0] || 90} min</span>
                      <span>{filters.duration?.[1] || 180} min</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Price Range (₹)</label>
                  <div className="px-2">
                    <Slider
                      defaultValue={[100, 500]}
                      value={filters.priceRange || [100, 500]}
                      min={100}
                      max={1000}
                      step={50}
                      onValueChange={handlePriceChange}
                      className="my-6"
                    />
                    <div className="flex justify-between text-sm">
                      <span>₹{filters.priceRange?.[0] || 100}</span>
                      <span>₹{filters.priceRange?.[1] || 500}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                  <Button type="button" size="sm" onClick={() => setShowAdvancedFilters(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button type="submit" className="w-full md:w-auto">
            <Search className="h-4 w-4 mr-2" />
            Find Movies
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default MovieSearch;
