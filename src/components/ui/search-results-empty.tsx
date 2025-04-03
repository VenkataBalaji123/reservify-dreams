
import { Search, FrownIcon } from "lucide-react";

interface SearchResultsEmptyProps {
  searchTerm?: string;
  filterCount?: number;
  type: 'flights' | 'buses' | 'trains' | 'events' | 'movies';
}

const typeLabels = {
  flights: 'flights',
  buses: 'buses',
  trains: 'trains',
  events: 'events',
  movies: 'movies'
};

const SearchResultsEmpty = ({ searchTerm, filterCount = 0, type }: SearchResultsEmptyProps) => {
  const typeLabel = typeLabels[type];
  
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center text-center bg-gray-50 rounded-lg border border-gray-200">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        {searchTerm ? <Search className="h-8 w-8 text-gray-400" /> : <FrownIcon className="h-8 w-8 text-gray-400" />}
      </div>
      
      <h3 className="text-xl font-semibold mb-2">No {typeLabel} found</h3>
      
      {searchTerm && (
        <p className="text-gray-500 mb-4">
          We couldn't find any {typeLabel} matching "{searchTerm}"
        </p>
      )}
      
      {filterCount > 0 && (
        <p className="text-gray-500 mb-4">
          Try changing your filters or search criteria
        </p>
      )}
      
      {!searchTerm && filterCount === 0 && (
        <p className="text-gray-500 mb-4">
          No {typeLabel} are available for the selected criteria
        </p>
      )}
    </div>
  );
};

export default SearchResultsEmpty;
