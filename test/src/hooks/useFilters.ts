import { useState, useMemo } from 'react';
import type { ConstructionObject, FilterState } from '../types';
import { getUniqueCities, filterObjects } from '../utils/dataUtils';
import { RESIDENTIAL_COMPLEXES } from '../types';

interface UseFiltersProps {
  objects: ConstructionObject[];
}

interface UseFiltersReturn {
  filters: FilterState;
  cities: string[];
  residentialComplexes: string[];
  filteredObjects: ConstructionObject[];
  handleSearchChange: (query: string) => void;
  handleCityChange: (city: string) => void;
  handleResidentialComplexChange: (residentialComplex: string) => void;
}

export const useFilters = ({ objects }: UseFiltersProps): UseFiltersReturn => {
  const [filters, setFilters] = useState<FilterState>({
    city: '',
    residentialComplex: '',
    searchQuery: '',
  });

  const cities = useMemo(() => getUniqueCities(objects), [objects]);
  
  const residentialComplexes = useMemo(() => [...RESIDENTIAL_COMPLEXES], []);

  const filteredObjects = useMemo(() =>
    filterObjects(objects, filters),
    [objects, filters]
  );

  const handleSearchChange = (query: string) => {
    setFilters((prev: FilterState) => ({ ...prev, searchQuery: query }));
  };

  const handleCityChange = (city: string) => {
    setFilters((prev: FilterState) => ({
      ...prev,
      city: city === 'all' ? '' : city,
      residentialComplex: '' // Сбрасываем ЖК при смене города
    }));
  };

  const handleResidentialComplexChange = (residentialComplex: string) => {
    setFilters((prev: FilterState) => ({
      ...prev,
      residentialComplex: residentialComplex === 'all' ? '' : residentialComplex
    }));
  };

  return {
    filters,
    cities,
    residentialComplexes,
    filteredObjects,
    handleSearchChange,
    handleCityChange,
    handleResidentialComplexChange,
  };
};
