import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';

interface UseSearchOptions {
  delay?: number;
  minLength?: number;
}

interface UseSearchReturn {
  searchTerm: string;
  debouncedSearchTerm: string;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  isSearching: boolean;
}

export function useSearch({ 
  delay = 300, 
  minLength = 0 
}: UseSearchOptions = {}): UseSearchReturn {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  const isSearching = useMemo(() => {
    return searchTerm !== debouncedSearchTerm;
  }, [searchTerm, debouncedSearchTerm]);

  const effectiveSearchTerm = useMemo(() => {
    return debouncedSearchTerm.length >= minLength ? debouncedSearchTerm : '';
  }, [debouncedSearchTerm, minLength]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return {
    searchTerm,
    debouncedSearchTerm: effectiveSearchTerm,
    setSearchTerm,
    clearSearch,
    isSearching,
  };
}