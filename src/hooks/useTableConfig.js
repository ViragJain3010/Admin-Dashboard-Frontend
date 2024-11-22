import { useState, useMemo } from 'react';

export const useTableData = (
  initialData = [], 
  initialSort = { key: 'name', direction: 'asc' }
) => {
  const [sortConfig, setSortConfig] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering function for search
  const filteredData = useMemo(() => {
    if (!searchTerm) return initialData;

    const lowercasedTerm = searchTerm.toLowerCase();
    return initialData.filter(item => 
      item.name.toLowerCase().includes(lowercasedTerm) ||
      item.email.toLowerCase().includes(lowercasedTerm)
    );
  }, [initialData, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string') {
        if (sortConfig.direction === 'asc') {
          return aValue.localeCompare(bValue);
        }
        return bValue.localeCompare(aValue);
      }

      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  }, [filteredData, sortConfig]);

  // Get paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleSort = (columnKey) => {
    setSortConfig(current => ({
      key: columnKey,
      direction: 
        current.key === columnKey && current.direction === 'asc' 
          ? 'desc' 
          : 'asc',
    }));
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  return {
    data: paginatedData,
    sortConfig,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    searchTerm,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
  };
};