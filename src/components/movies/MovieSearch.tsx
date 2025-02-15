
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
}

const MovieSearch = ({ onSearch }: MovieSearchProps) => {
  const [title, setTitle] = useState('');
  const [languageId, setLanguageId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      title: title || undefined,
      language_id: languageId || undefined,
      category_id: categoryId || undefined,
      date: date || undefined
    });
  };

  return (
    <Card className="p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Movie Title
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Search movies..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <Select value={languageId} onValueChange={setLanguageId}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Languages</SelectItem>
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
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Show Date
            </label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button type="submit" className="w-full md:w-auto">
            Find Movies
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default MovieSearch;
