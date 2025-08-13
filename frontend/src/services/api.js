import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 30000, // 30 seconds for myth generation
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ API Response Error:', error)
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      let message = data?.detail || data?.message || 'Server error occurred'
      
      switch (status) {
        case 400:
          message = data?.detail || 'Invalid request. Please check your input.'
          break
        case 429:
          message = 'Rate limit exceeded. Please try again later.'
          break
        case 500:
          message = 'Server error. Please try again in a moment.'
          break
        default:
          message = `Server error (${status}): ${message}`
      }
      
      throw new Error(message)
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection and try again.')
    } else {
      // Other error
      throw new Error(error.message || 'An unexpected error occurred.')
    }
  }
)

/**
 * Generate a myth from a modern scenario
 * @param {Object} requestData - The myth generation request
 * @param {string} requestData.scenario - The modern scenario
 * @param {string} requestData.culture - The cultural tradition
 * @param {string} requestData.tone - The story tone
 * @returns {Promise<Object>} The generated myth data
 */
export const generateMythAPI = async (requestData) => {
  try {
    const response = await api.post('/generate-myth', requestData)
    return response.data
  } catch (error) {
    console.error('Failed to generate myth:', error)
    throw error
  }
}

/**
 * Check API health status
 * @returns {Promise<Object>} Health status data
 */
export const checkHealthAPI = async () => {
  try {
    const response = await api.get('/health')
    return response.data
  } catch (error) {
    console.error('Health check failed:', error)
    throw error
  }
}

export default api
