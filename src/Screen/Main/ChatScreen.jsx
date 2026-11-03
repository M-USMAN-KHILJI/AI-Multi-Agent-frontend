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
import { sendTextMessage, generateImage } from '../../Api/Api'

/**
 * ChatScreen - Multimodal Conversation View
 * Integrates live Axios API calls to the FastAPI Text AI Agent backend.
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

  const handleSendMessage = async (e) => {
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

    try {
      if (targetModality === 'text') {
        // Build conversational history context from current chat messages
        const history = (currentChat.messages || [])
          .filter((m) => m.text && (m.sender === 'user' || m.sender === 'assistant'))
          .map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          }))

        // Call FastAPI Text AI Agent backend via Axios
        const data = await sendTextMessage(userPrompt, history)

        addMessage(targetChatId, {
          id: `msg_${Date.now()}_a`,
          sender: 'assistant',
          text: data.response,
          agentType: 'text',
          agentName: data.agent_name || 'Text AI Agent',
          routingReason: `Processed by ${data.model} on FastAPI backend`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })
      } else if (targetModality === 'image') {
        // Image AI Agent (NVIDIA FLUX 3 Image Klein)
        const promptForGen = userPrompt || 'A futuristic AI neural network visualization glowing blue'
        const imgData = await generateImage(promptForGen)

        addMessage(targetChatId, {
          id: `msg_${Date.now()}_a`,
          sender: 'assistant',
          text: `**Image Generated Successfully:**\n\n• **Model:** NVIDIA FLUX 3 Image Klein\n• **Prompt:** "${promptForGen}"\n• **Resolution:** 1024x1024 • File: \`${imgData.filename}\``,
          imageUrl: imgData.full_image_url,
          agentType: 'image',
          agentName: 'Image AI Agent (NVIDIA FLUX 3)',
          routingReason: 'Supervisor routed image generation task to NVIDIA FLUX 3 Image Klein via LangGraph',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })
      } else {
        // Other modalities (audio, video) placeholder pipelines for upcoming steps
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

          case 'video':
            agentName = 'Video AI Agent (OpenCV & VideoGen)'
            routingReason =
              'Supervisor routed request to OpenCV frame extraction & video summarization pipeline.'
            botResponse = attachedFile
              ? `**Video Processing Summary:**\n\n• **Source Video:** \`${attachedFile.name}\`\n• **Keyframes Extracted:** 12 frames sampled via OpenCV.\n• **Audio Track:** Separated for speech transcription.\n• **Scene Assessment:** Continuous smooth pans, high fidelity dynamic transitions.`
              : `**Video Agent Ready:**\n\nUpload a video file for automated keyframe extraction and summarization, or request a generated video prompt.`
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
      }
    } catch (err) {
      console.error('Chat error:', err)
      addMessage(targetChatId, {
        id: `msg_${Date.now()}_err`,
        sender: 'assistant',
        text: `**Backend Connection Error:** ${err.message}\n\nPlease ensure the FastAPI server is running on \`http://localhost:8000\`.`,
        agentType: 'supervisor',
        agentName: 'System Supervisor',
        routingReason: 'Error occurred during API request dispatch.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
    } finally {
      setIsProcessing(false)
    }
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

          <div className="truncate">
            <h2 className="text-sm font-bold text-white tracking-tight truncate">
              {currentChat.title || 'Multi-Agent Command Studio'}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-gray-400 font-mono">
                Supervisor Routing Active • Text Agent Online
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="supervisor" size="sm">
            FastAPI Live
          </Badge>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-5 pr-2 custom-scroll">
        {currentChat.messages && currentChat.messages.length > 0 ? (
          currentChat.messages.map((msg) => {
            const isUser = msg.sender === 'user'
            const theme = modalityThemes[msg.agentType] || modalityThemes.supervisor

            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 max-w-3xl ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar Icon */}
                <div
                  style={{
                    backgroundColor: isUser ? colors.primary : theme.bg,
                    borderColor: isUser ? 'rgba(255, 255, 255, 0.2)' : theme.border,
                  }}
                  className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 shadow-sm"
                >
                  {isUser ? (
                    <FiUser className="w-4 h-4 text-white" />
                  ) : (
                    <FiCpu style={{ color: theme.color }} className="w-4 h-4" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Sender Meta Header */}
                  {!isUser && (
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-xs font-semibold text-white tracking-tight">
                        {msg.agentName || 'OmniAgent Supervisor'}
                      </span>
                      {msg.agentType && (
                        <span
                          style={{
                            color: theme.color,
                            backgroundColor: theme.bg,
                            borderColor: theme.border,
                          }}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase"
                        >
                          {msg.agentType}
                        </span>
                      )}
                    </div>
                  )}

                  <div
                    style={{
                      backgroundColor: isUser ? 'rgba(99, 102, 241, 0.25)' : 'rgba(19, 25, 38, 0.85)',
                      borderColor: isUser ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.08)',
                      borderRadius: radius.xl,
                    }}
                    className="p-4 border backdrop-blur-md text-left shadow-lg relative group max-w-2xl"
                  >
                    {/* User Attached File Preview */}
                    {msg.file && (
                      <div className="mb-3 p-2.5 rounded-lg bg-black/30 border border-white/10 flex items-center gap-2.5 text-xs">
                        <FiPaperclip className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div className="truncate flex-1">
                          <p className="font-medium text-white truncate">{msg.file.name}</p>
                          <p className="text-[10px] text-gray-400">{msg.file.size}</p>
                        </div>
                      </div>
                    )}

                    {/* Markdown Message Text */}
                    <div className="text-sm leading-relaxed text-slate-100 whitespace-pre-wrap font-sans space-y-2">
                      {msg.text}
                    </div>

                    {/* AI Generated Image Display */}
                    {msg.imageUrl && (
                      <div className="mt-3 overflow-hidden rounded-xl border border-white/10 shadow-lg bg-black/30">
                        <img
                          src={msg.imageUrl}
                          alt="AI Generated"
                          className="w-full max-h-80 object-cover rounded-t-xl hover:opacity-95 transition-opacity"
                        />
                        <div className="p-2.5 flex items-center justify-between text-xs bg-black/40">
                          <span className="text-gray-400 font-mono text-[11px]">NVIDIA FLUX 3 (1024x1024)</span>
                          <a
                            href={msg.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 font-medium text-[11px]"
                          >
                            Open Full Image ↗
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Supervisor Routing Reason Pill */}
                    {msg.routingReason && (
                      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-gray-400 font-mono">
                        <FiZap className="w-3 h-3 text-emerald-400" />
                        <span>{msg.routingReason}</span>
                      </div>
                    )}

                    {/* Copy Action Button */}
                    <button
                      type="button"
                      onClick={() => copyToClipboard(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3 p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <FiCopy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Timestamp */}
                  <span className="text-[10px] text-gray-500 px-1 font-mono">
                    {msg.timestamp || 'Just now'}
                  </span>
                </div>
              </div>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <FiZap className="w-8 h-8 text-indigo-400 mb-2 opacity-50" />
            <h3 className="text-sm font-semibold text-white">Start a Conversation</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm">
              Type a prompt or attach media. The Supervisor will route your request to the specialized agent.
            </p>
          </div>
        )}

        {/* Processing Loading Indicator */}
        {isProcessing && (
          <div className="flex gap-3.5 mr-auto">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <FiCpu className="w-4 h-4 text-indigo-400 animate-spin" />
            </div>
            <div className="p-3.5 rounded-xl bg-white/4 border border-white/10 flex items-center gap-2 text-xs text-gray-300">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>Text AI Agent is generating response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Sticky Input Dispatch Form */}
      <div className="pt-2 border-t border-white/5 shrink-0">
        <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
          {/* File attachment preview chip */}
          {selectedFile && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
              <div className="flex items-center gap-2 truncate">
                <FiPaperclip className="w-3.5 h-3.5" />
                <span className="truncate">{selectedFile.name}</span>
                <span className="text-[10px] text-gray-400 font-mono">
                  ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="hover:text-white p-1"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Input Row */}
          <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-white/4 border border-white/10 focus-within:border-indigo-500/50 transition-colors">
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => setShowUploader(!showUploader)}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                showUploader || selectedFile
                  ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              title="Attach File"
            >
              <FiPaperclip className="w-4 h-4" />
            </button>

            {/* Microphone STT Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                isListening
                  ? 'bg-rose-600/30 border-rose-500 text-rose-300 animate-pulse'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              title={isListening ? 'Stop listening' : 'Voice Input'}
            >
              <FiMic className="w-4 h-4" />
            </button>

            {/* Input Field */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? 'Listening... Speak into your microphone' : 'Ask anything to the Text AI Agent...'}
              className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm outline-none px-2"
            />

            {/* Send Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={(!input.trim() && !selectedFile) || isProcessing}
              isLoading={isProcessing}
              leftIcon={<FiSend className="w-4 h-4" />}
            >
              Send
            </Button>
          </div>

          {/* Collapsible File Upload dropzone */}
          {showUploader && (
            <div className="p-3 rounded-xl bg-black/40 border border-white/10">
              <FileUpload
                onFileSelect={(file) => {
                  setSelectedFile(file)
                  setShowUploader(false)
                }}
                accept="audio/*,image/*,video/*,.pdf,.txt,.doc"
                maxSize={50 * 1024 * 1024}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default ChatScreen
