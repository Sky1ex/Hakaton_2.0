import { useState, useEffect } from 'react';

interface UsePaginationProps {
  items: any[];
  itemsPerPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  paginatedItems: any[];
  handlePageChange: (page: number) => void;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
}

export const usePagination = ({ 
  items, 
  itemsPerPage = 6 
}: UsePaginationProps): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(1);

  // Расчет пагинации
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  // Сброс страницы при изменении списка элементов
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Прокрутка к началу страницы при смене страницы
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    handlePageChange,
    handlePreviousPage,
    handleNextPage,
  };
};
