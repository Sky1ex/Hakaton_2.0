import type { ApiProjectCard, ApiResponse, SearchParams, ApiError } from '../types/api';

const API_BASE_URL = import.meta.env.DEV 
  ? '' // Используем прокси в dev режиме
  : ''; // В production используем относительные пути через nginx прокси

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const error: ApiError = {
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        };
        return { data: null as T, error };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 0,
      };
      return { data: null as T, error: apiError };
    }
  }

  // Health check
  async checkHealth(): Promise<ApiResponse<any>> {
    return this.request('/actuator/health');
  }

  // Search projects
  async searchProjects(params: SearchParams): Promise<ApiResponse<ApiProjectCard[]>> {
    const searchParams = new URLSearchParams();
    searchParams.append('q', params.q);
    
    return this.request(`/api/v1/projects/search?${searchParams.toString()}`);
  }

  // Search by specific criteria
  async searchByAddress(address: string): Promise<ApiResponse<ApiProjectCard[]>> {
    return this.searchProjects({ q: address });
  }

  async searchByStatus(status: string): Promise<ApiResponse<ApiProjectCard[]>> {
    return this.searchProjects({ q: status });
  }

  async searchByPerson(personName: string): Promise<ApiResponse<ApiProjectCard[]>> {
    return this.searchProjects({ q: personName });
  }

  async searchByYear(year: string): Promise<ApiResponse<ApiProjectCard[]>> {
    return this.searchProjects({ q: year });
  }

  // Get all projects
  async getAllProjects(): Promise<ApiResponse<ApiProjectCard[]>> {
    return this.request('/api/v1/projects');
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export class for testing
export { ApiClient };