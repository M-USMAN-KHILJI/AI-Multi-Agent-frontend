import axios from 'axios'

export const BACKEND_URL = 'http://localhost:8000'

// Base Axios instance configured for OmniAgent Backend
const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 90000, // 90 seconds timeout for AI generation / vision
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
 * Analyze an uploaded image using NVIDIA Multimodal Vision
 * @param {File} file - Image file object
 * @param {string} prompt - Question or instruction about the image
 * @returns {Promise<{analysis: string, filename: string}>}
 */
export const analyzeImage = async (file, prompt = 'Describe what is in this image') => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('prompt', prompt)

    const response = await apiClient.post('/images/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 90000,
    })
    return response.data
  } catch (error) {
    console.error('Image analysis error:', error)
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail)
    }
    throw new Error(error.message || 'Failed to analyze image via backend')
  }
}

/**
 * Edit an uploaded image with instructions via NVIDIA Vision + FLUX 3 Image Klein
 * @param {File} file - Original image file
 * @param {string} instruction - Modification instruction
 * @returns {Promise<{status: string, image_url: string, full_image_url: string, filename: string, size_bytes: number}>}
 */
export const editImage = async (file, instruction) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('instruction', instruction)

    const response = await apiClient.post('/images/edit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000,
    })
    const data = response.data
    return {
      ...data,
      full_image_url: `${BACKEND_URL}${data.image_url}`,
    }
  } catch (error) {
    console.error('Image edit error:', error)
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail)
    }
    throw new Error(error.message || 'Failed to edit image via backend')
  }
}

/**
 * Video AI Agent API Call (Hugging Face Drishya-Tiny)
 * @param {string} prompt - Prompt describing the video to generate
 * @param {number} seed - Random seed (-1 for random)
 * @returns {Promise<{video_url: string, full_video_url: string, filename: string, prompt: string, model: string, size_bytes: number, duration_seconds: number, status: string}>}
 */
export const generateVideo = async (prompt, seed = -1) => {
  try {
    const payload = {
      prompt,
      seed,
    }
    const response = await apiClient.post('/videos/generate', payload, {
      timeout: 120000,
    })
    const data = response.data
    return {
      ...data,
      full_video_url: `${BACKEND_URL}${data.video_url}`,
    }
  } catch (error) {
    console.error('Video AI Agent generation error:', error)
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail)
    }
    throw new Error(error.message || 'Failed to generate video via backend')
  }
}

/**
 * Text-to-Speech API Call (NVIDIA Resemble.AI Chatterbox TTS)
 * @param {string} text - Text to synthesize into speech
 * @param {string} voice - Voice profile
 * @returns {Promise<{audio_url: string, full_audio_url: string, filename: string, size_bytes: number}>}
 */
export const synthesizeSpeech = async (text, voice = 'Chatterbox-Multilingual.en-US.Male') => {
  try {
    const payload = { text, voice }
    const response = await apiClient.post('/audio/tts', payload, {
      timeout: 60000,
    })
    const data = response.data
    return {
      ...data,
      full_audio_url: `${BACKEND_URL}${data.audio_url}`,
    }
  } catch (error) {
    console.error('TTS API error:', error)
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail)
    }
    throw new Error(error.message || 'Failed to synthesize speech')
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
