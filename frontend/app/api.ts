/**
 * Custom fetch function that automatically uses BACKEND_URL from environment variables
 * This eliminates the need to specify the full backend URL in every API call
 */

interface FetchOptions extends RequestInit {
  // Allow additional options if needed
}

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Custom fetch function that automatically prepends BACKEND_URL to relative URLs
 * @param url - The endpoint URL (relative or absolute)
 * @param options - Fetch options (same as native fetch)
 * @returns Promise with parsed JSON response
 */
export async function apiFetch<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  try {
    // Get BACKEND_URL from environment variables
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;
    
    if (!backendUrl) {
      throw new Error('BACKEND_URL environment variable is not set');
    }

    // Construct full URL
    const fullUrl = url.startsWith('http') ? url : `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    
    // Set default headers
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Make the request
    const response = await fetch(fullUrl, {
      ...options,
      headers: defaultHeaders,
    });

    // Handle non-ok responses
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }
      
      return {
        error: errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        message: errorData.message,
      };
    }

    // Parse response
    const data = await response.json();
    return { data };
    
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

/**
 * Convenience methods for common HTTP methods
 */
export const api = {
  get: <T = any>(url: string, options?: FetchOptions) => 
    apiFetch<T>(url, { ...options, method: 'GET' }),
    
  post: <T = any>(url: string, body?: any, options?: FetchOptions) => 
    apiFetch<T>(url, { 
      ...options, 
      method: 'POST', 
      body: body ? JSON.stringify(body) : undefined 
    }),
    
  put: <T = any>(url: string, body?: any, options?: FetchOptions) => 
    apiFetch<T>(url, { 
      ...options, 
      method: 'PUT', 
      body: body ? JSON.stringify(body) : undefined 
    }),
    
  patch: <T = any>(url: string, body?: any, options?: FetchOptions) => 
    apiFetch<T>(url, { 
      ...options, 
      method: 'PATCH', 
      body: body ? JSON.stringify(body) : undefined 
    }),
    
  delete: <T = any>(url: string, options?: FetchOptions) => 
    apiFetch<T>(url, { ...options, method: 'DELETE' }),
};

/**
 * Example usage:
 * 
 * // Instead of:
 * const response = await fetch(`${process.env.BACKEND_URL}/api/trainings`);
 * 
 * // You can now use:
 * const response = await api.get('/api/trainings');
 * 
 * // Or with the full function:
 * const response = await apiFetch('/api/trainings');
 * 
 * // For POST requests:
 * const response = await api.post('/api/trainings', { name: 'My Training' });
 */
