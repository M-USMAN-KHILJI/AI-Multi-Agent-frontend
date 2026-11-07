import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * Custom Hook for Speech-to-Text using Web Speech API
 * Automatically handles browser vendor prefixes (SpeechRecognition / webkitSpeechRecognition)
 */
export const useSpeechRecognition = ({ onTranscriptChange, onSpeechEnd, onError } = {}) => {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef(null)
  const initialTextRef = useRef('')
  const latestTranscriptRef = useRef('')

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
        if (spoken) {
          const prefix = initialTextRef.current
            ? initialTextRef.current.trim() + ' '
            : ''
          const fullText = prefix + spoken
          latestTranscriptRef.current = fullText
          if (onTranscriptChange) {
            onTranscriptChange(fullText)
          }
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
        // User clicked mic button a second time to stop & send!
        if (onSpeechEnd && latestTranscriptRef.current) {
          const textToSubmit = latestTranscriptRef.current
          latestTranscriptRef.current = ''
          initialTextRef.current = ''
          onSpeechEnd(textToSubmit)
        }
      } else {
        try {
          latestTranscriptRef.current = currentInputValue || ''
          initialTextRef.current = currentInputValue || ''
          recognitionRef.current?.start()
          setIsListening(true)
        } catch (err) {
          console.error('Error starting speech recognition:', err)
          setIsListening(false)
        }
      }
    },
    [isSupported, isListening, onSpeechEnd]
  )

  return {
    isListening,
    isSupported,
    toggleListening,
  }
}

export default useSpeechRecognition
