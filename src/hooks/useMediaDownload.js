import { useState, useCallback } from 'react'

/**
 * Custom Hook for Downloading Remote Media Assets (Images / Videos)
 * Handles blob conversion, progress states, and automatic trigger downloads.
 */
export const useMediaDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState(null)

  const downloadMedia = useCallback(async (url, defaultFilename) => {
    setIsDownloading(true)
    setError(null)
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch media (status: ${response.status})`)
      }
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = defaultFilename || `download_${Date.now()}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(blobUrl)
      return true
    } catch (err) {
      console.error('Download media error:', err)
      setError(err.message || 'Download failed')
      return false
    } finally {
      setIsDownloading(false)
    }
  }, [])

  return {
    downloadMedia,
    isDownloading,
    error,
  }
}

