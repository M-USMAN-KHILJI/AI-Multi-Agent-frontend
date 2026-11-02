import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  colors,
  fontSize,
  radius,
  shadows,
  modalityThemes,
} from '../../Const/display'
import { Button, Badge, Card, FileUpload } from '../../customComp'
import { useChatStore } from '../../store/chatStore'
import {
  FiCpu,
  FiUser,
  FiSend,
  FiPaperclip,
  FiZap,
  FiCopy,
  FiCheck,
  FiVolume2,
  FiMic,
  FiImage,
  FiFilm,
  FiMessageSquare,
  FiX,
  FiCornerDownLeft,
} from 'react-icons/fi'
import { useSpeechRecognition } from '../../utils/useSpeechRecognition'

/**
 * ChatScreen - Multimodal Conversation View
 * Allows viewing previous chats and continuing conversations seamlessly
 */
export const ChatScreen = () => {
  const { chatId } = useParams()
  const navigate = useNavigate()
  const { chats, activeChatId, setActiveChat, addMessage, createNewChat } =
    useChatStore()

  const [input, setInput] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [showUploader, setShowUploader] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [copiedId, setCopiedId] = useState(null)

  // Speech-to-Text Recognition Hook
  const { isListening, toggleListening } = useSpeechRecognition({
    onTranscriptChange: (text) => setInput(text),
  })

  const messagesEndRef = useRef(null)

  // Find the current chat
  const currentChat = chats.find((c) => c.id === chatId) || chats[0]

  useEffect(() => {
    if (chatId && currentChat && activeChatId !== chatId) {
      setActiveChat(chatId)
    }
  }, [chatId, currentChat, activeChatId, setActiveChat])

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentChat?.messages, isProcessing])

  // If no chat exists, create one
  useEffect(() => {
    if (!currentChat && chats.length === 0) {
      const newChat = createNewChat()
      navigate(`/chat/${newChat.id}`, { replace: true })
    }
  }, [currentChat, chats.length, createNewChat, navigate])

  const copyToClipboard = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Modality intent predictor
  const detectModality = (text, file) => {
    if (file) {
      if (file.type.startsWith('audio/')) return 'audio'
      if (file.type.startsWith('image/')) return 'image'
      if (file.type.startsWith('video/')) return 'video'
    }
    const lower = text.toLowerCase()
    if (
      lower.includes('audio') ||
      lower.includes('speech') ||
      lower.includes('transcribe') ||
      lower.includes('voice') ||
      lower.includes('tts')
    ) {
      return 'audio'
    }
    if (
      lower.includes('image') ||
      lower.includes('photo') ||
      lower.includes('draw') ||
      lower.includes('picture') ||
      lower.includes('vision')
    ) {
      return 'image'
    }
    if (
      lower.includes('video') ||
      lower.includes('frame') ||
      lower.includes('movie') ||
      lower.includes('opencv')
    ) {
      return 'video'
    }
    return 'text'
  }

  const handleSendMessage = (e) => {
    if (e) e.preventDefault()
    if (!input.trim() && !selectedFile) return
    if (!currentChat) return

    const targetChatId = currentChat.id
    const userPrompt = input.trim()
    const attachedFile = selectedFile

    // Add user message to store
    addMessage(targetChatId, {
      id: `msg_${Date.now()}_u`,
      sender: 'user',
      text: userPrompt,
      file: attachedFile
        ? {
            name: attachedFile.name,
            size: `${(attachedFile.size / (1024 * 1024)).toFixed(2)} MB`,
            type: attachedFile.type,
          }
        : null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })

    setInput('')
    setSelectedFile(null)
    setShowUploader(false)
    setIsProcessing(true)

    // Supervisor Analysis & Routing
    const targetModality = detectModality(userPrompt, attachedFile)

    setTimeout(() => {
      setIsProcessing(false)

      let botResponse = ''
      let agentName = ''
      let routingReason = ''

      switch (targetModality) {
        case 'audio':
          agentName = 'Audio AI Agent (Whisper STT / Edge-TTS)'
          routingReason =
            'Supervisor detected audio keywords/files. Invoked speech recognition & audio pipeline.'
          botResponse = attachedFile
            ? `**Audio Ingestion & Transcription Complete:**\n\n• **File:** \`${attachedFile.name}\`\n• **Model:** Faster-Whisper (Large-v3)\n• **Transcript:** "The multimodal multi-agent system orchestrates distributed tasks seamlessly with LangGraph conditional execution."\n• **Action:** Text-to-speech preview synthesized with Edge-TTS JennyNeural.`
            : `**Audio Agent Response:**\n\nI can transcribe speech files or synthesize spoken responses using Edge-TTS. If you have an audio clip (MP3, WAV, M4A), upload it using the attachment button.`
          break

        case 'image':
          agentName = 'Image AI Agent (Vision Multimodal / Diffusers)'
          routingReason =
            'Supervisor identified visual question answering or generation request.'
          botResponse = attachedFile
            ? `**Vision Analysis Results:**\n\n• **File Analyzed:** \`${attachedFile.name}\`\n• **Detected Features:** Balanced composition, prominent subject focal point, high contrast structural boundaries.\n• **Contextual Q&A:** Content successfully interpreted and logged to graph state.`
            : `**Image Generation & Vision Studio:**\n\nTo generate an image, describe your scene (e.g. "A cyberpunk neon cityscape at twilight"). To analyze an image, attach any PNG/JPG photo.`
          break

        case 'video':
          agentName = 'Video AI Agent (OpenCV & VideoGen)'
          routingReason =
            'Supervisor routed request to OpenCV frame extraction & video summarization pipeline.'
          botResponse = attachedFile
            ? `**Video Processing Summary:**\n\n• **Source Video:** \`${attachedFile.name}\`\n• **Keyframes Extracted:** 12 frames sampled via OpenCV.\n• **Audio Track:** Separated for speech transcription.\n• **Scene Assessment:** Continuous smooth pans, high fidelity dynamic transitions.`
            : `**Video Agent Ready:**\n\nUpload a video file for automated keyframe extraction and summarization, or request a generated video prompt.`
          break

        case 'text':
        default:
          agentName = 'Text AI Agent (LangChain LLM)'
          routingReason =
            'Handled by LangChain conversational reasoning and prompt template execution.'
          botResponse = `The **Supervisor Multi-Agent architecture** processes requests through shared state graph nodes:\n\n1. **User Request & Payload**: The prompt or attached media enters the LangGraph compiled state machine.\n2. **Supervisor Routing Node**: Evaluates modalities (Text, Audio, Images, Videos) and chooses the specialized agent.\n3. **Specialized Agent Execution**: Executes domain-specific tools (Whisper, OpenCV, Diffusers, LLMs).\n4. **State Persistence**: The conversation history and metadata persist across sessions.`
          break
      }

      addMessage(targetChatId, {
        id: `msg_${Date.now()}_a`,
        sender: 'assistant',
        text: botResponse,
        agentType: targetModality,
        agentName,
        routingReason,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
    }, 1000)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!currentChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-gray-400">
        <FiMessageSquare className="w-8 h-8 mb-3 opacity-40" />
        <p>Loading conversation...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full max-h-full w-full px-6 py-3 overflow-hidden">
      {/* Top Conversation Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden text-left">
          <div
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              borderRadius: radius.md,
            }}
            className="w-9 h-9 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/20"
          >
            <FiCpu className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <h2
              style={{ color: colors.textPrimary, fontSize: fontSize.bodyLg }}
              className="font-bold truncate"
            >
              {currentChat.title || 'New Conversation'}
            </h2>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Supervisor Active
              </span>
              <span>•</span>
              <span>{currentChat.messages?.length || 0} messages</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area - ONLY this container scrolls when scrolling up or down */}
      <div className="flex-1 min-h-0 overflow-y-auto py-5 flex flex-col gap-5 pr-2">
        {currentChat.messages && currentChat.messages.length > 0 ? (
          currentChat.messages.map((msg) => {
            const isUser = msg.sender === 'user'
            const modalityTheme = modalityThemes[msg.agentType] || modalityThemes.supervisor

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  style={{
                    backgroundColor: isUser ? colors.primary : colors.bgCard,
                    borderColor: isUser ? 'transparent' : colors.borderGlass,
                    borderRadius: radius.full,
                  }}
                  className="w-8 h-8 flex items-center justify-center shrink-0 border text-white shadow-sm mt-0.5"
                >
                  {isUser ? (
                    <FiUser className="w-4 h-4" />
                  ) : (
                    <FiCpu
                      style={{ color: modalityTheme.color }}
                      className="w-4 h-4"
                    />
                  )}
                </div>

                {/* Message Bubble Container */}
                <div
                  style={{
                    backgroundColor: isUser ? 'rgba(99, 102, 241, 0.16)' : colors.bgCard,
                    border: `1px solid ${
                      isUser ? 'rgba(99, 102, 241, 0.35)' : colors.borderGlass
                    }`,
                    borderRadius: radius.lg,
                  }}
                  className="p-4 relative group text-left shadow-sm backdrop-blur-sm"
                >
                  {/* Supervisor Agent Routing Tag */}
                  {!isUser && (
                    <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <Badge variant={msg.agentType || 'supervisor'} size="sm">
                          {msg.agentName || 'Supervisor Agent'}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-gray-500 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  )}

                  {/* Supervisor Routing Explanation Insight */}
                  {!isUser && msg.routingReason && (
                    <div className="mb-3 px-3 py-1.5 rounded-md bg-white/5 border border-white/5 text-[11px] text-gray-400 font-sans">
                      <strong className="text-gray-300">Supervisor Decision:</strong>{' '}
                      {msg.routingReason}
                    </div>
                  )}

                  {/* File Attachment Pill */}
                  {msg.file && (
                    <div className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-950/50 border border-indigo-500/30 text-xs text-indigo-200">
                      <FiPaperclip className="w-3.5 h-3.5" />
                      <span className="font-medium">{msg.file.name}</span>
                      <span className="text-[10px] text-indigo-400">({msg.file.size})</span>
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>

                  {/* Bottom Metadata & Copy */}
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5 text-[11px] text-gray-500">
                    <span>{isUser ? msg.timestamp : 'Processed via LangGraph'}</span>
                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(msg.id, msg.text)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-white cursor-pointer"
                        title="Copy to clipboard"
                      >
                        {copiedId === msg.id ? (
                          <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <FiCopy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          /* Empty Chat Welcome State */
          <div className="flex flex-col items-center justify-center my-auto py-10 text-center max-w-full w-full mx-auto px-4">
            <div
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                borderRadius: radius.xl,
              }}
              className="w-14 h-14 flex items-center justify-center text-white mb-4 shadow-xl shadow-indigo-500/25"
            >
              <FiZap className="w-7 h-7" />
            </div>

            <h3
              style={{ color: colors.textPrimary, fontSize: fontSize.h3 }}
              className="font-bold mb-2"
            >
              Multimodal Multi-Agent Ready
            </h3>
            <p
              style={{ color: colors.textSecondary, fontSize: fontSize.bodySm }}
              className="leading-relaxed mb-6"
            >
              Type any question, upload audio for speech-to-text, inspect images with vision, or
              analyze videos. The Supervisor Agent will route your request automatically.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left text-xs">
              {[
                {
                  label: 'Text: Multi-Agent Logic',
                  prompt: 'Explain how the supervisor coordinates the 4 specialized agents.',
                },
                {
                  label: 'Audio: Speech-to-Text',
                  prompt: 'Transcribe audio recording and generate structured highlights.',
                },
                {
                  label: 'Image: Visual Inspection',
                  prompt: 'Analyze image composition, contrast, and visual objects.',
                },
                {
                  label: 'Video: Keyframe Summarization',
                  prompt: 'Sample video frames at regular intervals and summarize actions.',
                },
              ].map((starter, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInput(starter.prompt)}
                  className="p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-indigo-500/40 hover:bg-slate-800/60 transition-all text-gray-300 hover:text-white"
                >
                  <span className="font-semibold text-indigo-400 block mb-0.5">
                    {starter.label}
                  </span>
                  <span className="text-[11px] text-gray-400 line-clamp-1">
                    {starter.prompt}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex gap-3 max-w-xl mr-auto items-center animate-pulse">
            <div
              style={{
                backgroundColor: colors.bgCard,
                borderColor: colors.borderGlass,
                borderRadius: radius.full,
              }}
              className="w-8 h-8 flex items-center justify-center border text-indigo-400 shrink-0"
            >
              <FiCpu className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-gray-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Supervisor analyzing intent & routing to specialized agent...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Omnichannel Chat Input Bar */}
      <div className="shrink-0 pt-2 border-t border-white/5">
        <form
          onSubmit={handleSendMessage}
          className="dispatch-bar rounded-xl p-3 flex flex-col gap-2 relative shadow-lg"
        >
          {/* Selected File Chip */}
          {selectedFile && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-xs text-indigo-200">
              <div className="flex items-center gap-2 truncate">
                <FiPaperclip className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="font-medium truncate">{selectedFile.name}</span>
                <span className="text-[10px] text-gray-400">
                  ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="p-1 hover:text-red-400 text-gray-400 rounded transition-colors ml-2"
                title="Remove file"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Collapsible Dropzone */}
          {showUploader && (
            <div className="pt-2 pb-1 border-b border-white/5">
              <FileUpload
                modality="all"
                selectedFile={selectedFile}
                onFileSelect={(file) => {
                  setSelectedFile(file)
                  setShowUploader(false)
                }}
                onClear={() => setSelectedFile(null)}
              />
            </div>
          )}

          {/* Listening Live Indicator */}
          {isListening && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-pink-950/40 border border-pink-500/30 text-xs text-pink-300 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping shrink-0" />
              <span className="font-medium">Listening to your speech... Speak now and text will convert in real-time</span>
            </div>
          )}

          {/* Text Input Row */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowUploader(!showUploader)}
              style={{
                backgroundColor: showUploader ? colors.primary : 'rgba(255, 255, 255, 0.08)',
                color: showUploader ? '#fff' : colors.textSecondary,
                borderRadius: radius.md,
              }}
              className="p-2.5 hover:text-white transition-colors shrink-0 cursor-pointer"
              title="Attach Audio, Image, or Video file"
            >
              <FiPaperclip className="w-4 h-4" />
            </button>

            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? 'Listening... Speak into your microphone' : 'Message your multimodal agents... (Press Enter to send)'}
              className="w-full bg-transparent text-white placeholder-gray-500 outline-none text-sm resize-none py-1.5 font-normal leading-relaxed"
            />

            {/* Microphone Voice-to-Text Button */}
            <button
              type="button"
              onClick={() => toggleListening(input)}
              style={{
                backgroundColor: isListening
                  ? colors.audioAgent
                  : 'rgba(255, 255, 255, 0.08)',
                color: isListening ? '#ffffff' : colors.textSecondary,
                borderRadius: radius.md,
                boxShadow: isListening ? '0 0 16px rgba(236, 72, 153, 0.6)' : 'none',
              }}
              className={`p-2.5 transition-all shrink-0 cursor-pointer ${
                isListening ? 'animate-pulse scale-105' : 'hover:text-white'
              }`}
              title={isListening ? 'Listening... Click to stop recording' : 'Click to speak (Speech-to-Text)'}
            >
              <FiMic className="w-4 h-4" />
            </button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={FiSend}
              isLoading={isProcessing}
              disabled={!input.trim() && !selectedFile}
              className="shrink-0"
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatScreen

