import axios from 'axios'

export const BACKEND_URL = 'http://localhost:8000'

// Base Axios instance configured for OmniAgent Backend
const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds timeout for AI generation
})

/**
 * Text AI Agent API Call
 * @param {string} message - Current prompt text from user
 * @param {Array<{role: string, content: string}>} history - Chat history context
 * @param {number} temperature - Sampling temperature (default 0.7)
 * @param {number} maxTokens - Max token limit (default 1024)
 * @returns {Promise<{response: string, agent_name: string, model: string, usage: object}>}
 */
export const sendTextMessage = async (message, history = [], temperature = 0.7, maxTokens = 1024) => {
  try {
    const payload = {
      message,
      history,
      temperature,
      max_tokens: maxTokens,
    }
    const response = await apiClient.post('/chat/text', payload)
    return response.data
  } catch (error) {
    console.error('Text AI Agent API error:', error)
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail)
    }
    throw new Error(error.message || 'Failed to connect to backend server')
  }
}

/**
 * Image AI Agent API Call (NVIDIA FLUX 3 Image Klein)
 * @param {string} prompt - Prompt describing the image to generate
 * @param {number} width - Output width (default 1024)
 * @param {number} height - Output height (default 1024)
 * @returns {Promise<{status: string, image_url: string, full_image_url: string, filename: string, size_bytes: number}>}
 */
export const generateImage = async (prompt, width = 1024, height = 1024) => {
  try {
    const payload = {
      prompt,
      width,
      height,
    }
    const response = await apiClient.post('/images/generate', payload)
    const data = response.data
    return {
      ...data,
      full_image_url: `${BACKEND_URL}${data.image_url}`,
    }
  } catch (error) {
    console.error('Image AI Agent generation error:', error)
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail)
    }
    throw new Error(error.message || 'Failed to generate image via backend')
  }
}

/**
 * Health check endpoint
 * @returns {Promise<{status: string, agents: object}>}
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health')
    return response.data
  } catch (error) {
    console.error('Health check failed:', error)
    return { status: 'offline', error: error.message }
  }
}

export default apiClient
