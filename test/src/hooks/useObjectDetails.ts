import { useState } from 'react';
import type { ConstructionObject } from '../types';

interface UseObjectDetailsReturn {
  selectedObject: ConstructionObject | null;
  isDetailsOpen: boolean;
  openDetails: (object: ConstructionObject) => void;
  closeDetails: () => void;
}

export const useObjectDetails = (): UseObjectDetailsReturn => {
  const [selectedObject, setSelectedObject] = useState<ConstructionObject | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const openDetails = (object: ConstructionObject) => {
    setSelectedObject(object);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setSelectedObject(null);
  };

  return {
    selectedObject,
    isDetailsOpen,
    openDetails,
    closeDetails,
  };
};
