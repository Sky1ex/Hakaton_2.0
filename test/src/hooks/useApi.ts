import { useState, useCallback } from 'react';
import { apiClient } from '../services/api';
import type { ApiProjectCard, ApiError } from '../types/api';

interface UseApiState {
  data: ApiProjectCard[] | null;
  loading: boolean;
  error: ApiError | null;
}

interface SearchResult {
  data: ApiProjectCard[];
  error: ApiError | null;
}

export const useApi = () => {
  const [state, setState] = useState<UseApiState>({
    data: null,
    loading: false,
    error: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: ApiError | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setData = useCallback((data: ApiProjectCard[] | null) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const searchProjects = useCallback(async (query: string): Promise<SearchResult> => {
    if (!query.trim()) {
      setData([]);
      return { data: [], error: null };
    }

    setLoading(true);
    clearError();

    try {
      const response = await apiClient.searchProjects({ q: query });
      
      if (response.error) {
        setError(response.error);
        setData([]);
        return { data: [], error: response.error };
      } else {
        setData(response.data);
        return { data: response.data, error: null };
      }
    } catch (error) {
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 0,
      };
      setError(apiError);
      setData([]);
      return { data: [], error: apiError };
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData, clearError]);

  const getAllProjects = useCallback(async (): Promise<SearchResult> => {
    setLoading(true);
    clearError();

    try {
      const response = await apiClient.getAllProjects();
      
      if (response.error) {
        setError(response.error);
        setData([]);
        return { data: [], error: response.error };
      } else {
        setData(response.data);
        return { data: response.data, error: null };
      }
    } catch (error) {
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 0,
      };
      setError(apiError);
      setData([]);
      return { data: [], error: apiError };
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData, clearError]);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    clearError();

    try {
      const response = await apiClient.checkHealth();
      
      if (response.error) {
        setError(response.error);
      }
    } catch (error) {
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 0,
      };
      setError(apiError);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, clearError]);

  return {
    ...state,
    searchProjects,
    getAllProjects,
    checkHealth,
    clearError,
  };
};
