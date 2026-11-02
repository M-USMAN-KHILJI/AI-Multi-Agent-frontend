import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * Custom Hook for Speech-to-Text using Web Speech API
 * Automatically handles browser vendor prefixes (SpeechRecognition / webkitSpeechRecognition)
 */
export const useSpeechRecognition = ({ onTranscriptChange, onError } = {}) => {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef(null)
  const initialTextRef = useRef('')

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = 0; i < event.results.length; i++) {
          const chunk = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += chunk + ' '
          } else {
            interimTranscript += chunk
          }
        }

        const spoken = (finalTranscript + interimTranscript).trim()
        if (spoken && onTranscriptChange) {
          const prefix = initialTextRef.current
            ? initialTextRef.current.trim() + ' '
            : ''
          onTranscriptChange(prefix + spoken)
        }
      }

      recognition.onerror = (event) => {
        console.warn('Speech recognition status/error:', event.error)
        if (event.error !== 'no-speech') {
          setIsListening(false)
          if (onError) onError(event.error)
        }
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    } else {
      setIsSupported(false)
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch {
          // ignore
        }
      }
    }
  }, [onTranscriptChange, onError])

  const toggleListening = useCallback(
    (currentInputValue = '') => {
      if (!isSupported) {
        alert(
          'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.'
        )
        return
      }

      if (isListening) {
        try {
          recognitionRef.current?.stop()
        } catch (err) {
          console.error('Error stopping speech recognition:', err)
        }
        setIsListening(false)
      } else {
        try {
          initialTextRef.current = currentInputValue || ''
          recognitionRef.current?.start()
          setIsListening(true)
        } catch (err) {
          console.error('Error starting speech recognition:', err)
          setIsListening(false)
        }
      }
    },
    [isSupported, isListening]
  )

  return {
    isListening,
    isSupported,
    toggleListening,
  }
}

export default useSpeechRecognition
