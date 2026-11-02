import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  colors,
  fontSize,
  radius,
  shadows,
  gradients,
  modalityThemes,
} from '../../Const/display'
import {
  Button,
  Badge,
  Card,
  FileUpload,
} from '../../customComp'
import { useChatStore } from '../../store/chatStore'
import { useSpeechRecognition } from '../../utils/useSpeechRecognition'
import '../../Style/Home.css'
import {
  FiCpu,
  FiMessageSquare,
  FiMic,
  FiImage,
  FiVideo,
  FiSend,
  FiPaperclip,
  FiZap,
  FiLayers,
  FiActivity,
  FiCheckCircle,
  FiArrowRight,
  FiPlay,
  FiVolume2,
  FiEye,
  FiFilm,
  FiStar,
  FiRefreshCw,
  FiPlus,
} from 'react-icons/fi'

/**
 * HomePage - Master Multimodal Multi-Agent Command Dashboard
 * Designed according to Project Specification
 */
export const HomePage = () => {
  const navigate = useNavigate()
  const { createNewChat, addMessage } = useChatStore()

  const [prompt, setPrompt] = useState('')
  const [selectedModality, setSelectedModality] = useState('auto') // 'auto' | 'text' | 'audio' | 'image' | 'video'
  const [selectedFile, setSelectedFile] = useState(null)
  const [showUploader, setShowUploader] = useState(false)
  const [activeTabModality, setActiveTabModality] = useState('all')
  const [isProcessing, setIsProcessing] = useState(false)

  // Speech-to-Text Recognition Hook
  const { isListening, toggleListening } = useSpeechRecognition({
    onTranscriptChange: (text) => setPrompt(text),
  })

  // Quick prompt suggestions with predefined routing
  const quickPrompts = [
    {
      label: 'Text: Explain Multi-Agent LangGraph',
      text: 'Explain how LangGraph supervisor patterns coordinate specialized modality agents with conditional routing.',
      modality: 'text',
      agent: 'Text Agent',
    },
    {
      label: 'Audio: Speech-to-Text Transcription',
      text: 'Transcribe this lecture recording and summarize the key technical takeaways.',
      modality: 'audio',
      agent: 'Audio Agent',
    },
    {
      label: 'Image: Visual Object Analysis',
      text: 'Analyze this uploaded diagram and identify architectural bottlenecks and flow diagrams.',
      modality: 'image',
      agent: 'Image Agent',
    },
    {
      label: 'Video: Keyframe Summarization',
      text: 'Sample keyframes from this 1-minute video at 1.0s intervals and summarize scene transitions.',
      modality: 'video',
      agent: 'Video Agent',
    },
  ]

  // Detect which agent the supervisor will select
  const getPredictedAgent = () => {
    if (selectedModality !== 'auto') {
      return selectedModality
    }
    if (selectedFile) {
      if (selectedFile.type.startsWith('audio/')) return 'audio'
      if (selectedFile.type.startsWith('image/')) return 'image'
      if (selectedFile.type.startsWith('video/')) return 'video'
    }
    const lower = prompt.toLowerCase()
    if (
      lower.includes('transcribe') ||
      lower.includes('speech') ||
      lower.includes('audio') ||
      lower.includes('voice') ||
      lower.includes('tts')
    ) {
      return 'audio'
    }
    if (
      lower.includes('draw') ||
      lower.includes('image') ||
      lower.includes('photo') ||
      lower.includes('picture') ||
      lower.includes('visual')
    ) {
      return 'image'
    }
    if (
      lower.includes('video') ||
      lower.includes('movie') ||
      lower.includes('frame') ||
      lower.includes('opencv') ||
      lower.includes('footage')
    ) {
      return 'video'
    }
    return prompt.trim().length > 0 ? 'text' : 'supervisor'
  }

  const predictedAgent = getPredictedAgent()

  const handleQuickPrompt = (item) => {
    setPrompt(item.text)
    setSelectedModality(item.modality)
  }

  const getSimulatedResponse = (agentType, query) => {
    switch (agentType) {
      case 'audio':
        return `[Audio Pipeline Executed]
• Speech-to-Text: File processed via Whisper model. Audio waveform decoded with clean normalization.
• Transcript: "The multi-agent workflow coordinates tasks seamlessly across modalities."
• Text-to-Speech: Synthesized preview available with Edge-TTS JennyNeural voice.`
      case 'image':
        return `[Image Pipeline Executed]
• Vision Analysis: Multimodal visual feature maps processed. 
• Findings: High-contrast objects identified with 98.4% detection confidence. 
• Composition: Balanced lighting, central focal arrangement, metadata recorded.`
      case 'video':
        return `[Video Pipeline Executed]
• OpenCV Frame Extraction: 8 keyframes extracted at 1.0s intervals.
• Audio Track: Separated and normalized for speech transcription.
• Scene Transition Analysis: 2 primary shot cuts detected with high camera pan velocity.`
      case 'text':
      default:
        return `The **Supervisor Multi-Agent architecture** processes requests through shared state graph nodes:
1. **Supervisor Agent** receives input and evaluates modality requirements.
2. **Conditional routing** edges inspect input modality (Text, Audio, Image, Video).
3. **Specialized Agent** executes tools, models, or synthesis.
4. **State Persistence**: The conversation history and metadata persist across sessions.`
    }
  }

  const handleDispatch = (e) => {
    e.preventDefault()
    if (!prompt.trim() && !selectedFile) return

    setIsProcessing(true)
    const targetAgent = predictedAgent === 'supervisor' ? 'text' : predictedAgent

    const agentNames = {
      text: 'Text AI Agent (LangChain LLM)',
      audio: 'Audio AI Agent (Faster-Whisper / Edge-TTS)',
      image: 'Image AI Agent (Vision Multimodal / Diffusers)',
      video: 'Video AI Agent (OpenCV Frame Extraction / Video Gen)',
    }

    // 1. Create a brand new chat in the store
    const newChat = createNewChat(prompt, selectedFile)

    // 2. Add the agent's response to that chat
    addMessage(newChat.id, {
      id: `msg_${Date.now()}_a`,
      sender: 'assistant',
      text: getSimulatedResponse(targetAgent, prompt),
      agentType: targetAgent,
      agentName: agentNames[targetAgent] || 'Supervisor Agent',
      routingReason: `Supervisor analyzed user prompt & modality attachments. Routed automatically via LangGraph conditional edges to ${agentNames[targetAgent]}.`,
      timestamp: 'Just now',
    })

    // 3. Immediately open that conversation page!
    setIsProcessing(false)
    navigate(`/chat/${newChat.id}`)
  }

  const handleLaunchAgentChat = (agent) => {
    const defaultPrompts = {
      text: 'How can the LangChain Text Agent help me today?',
      audio: 'I want to transcribe or synthesize audio with the Audio Agent.',
      image: 'I want to analyze or generate an image with the Vision Agent.',
      video: 'I want to extract video keyframes or generate a video.',
    }
    const starter = defaultPrompts[agent.id] || `Start a conversation with ${agent.title}`
    const newChat = createNewChat(starter)
    addMessage(newChat.id, {
      id: `msg_${Date.now()}_a`,
      sender: 'assistant',
      text: `Hello! I am the **${agent.title}**. ${agent.desc}\n\nHow can I help you today? You can type a message or attach relevant files.`,
      agentType: agent.id,
      agentName: agent.title,
      routingReason: `User selected ${agent.title}. Routing initialized directly via LangGraph node.`,
      timestamp: 'Just now',
    })
    navigate(`/chat/${newChat.id}`)
  }

  // Modality Agent definitions for UI cards
  const agentCards = [
    {
      id: 'text',
      title: 'Text AI Agent',
      subtitle: 'LangChain LLM Core',
      desc: 'Handles conversational chat, question answering, long-form content generation, summarization, and prompt engineering.',
      icon: FiMessageSquare,
      theme: modalityThemes.text,
      tools: ['LangChain Models', 'Prompt Templates', 'Streaming Output', 'Chat Context'],
    },
    {
      id: 'audio',
      title: 'Audio AI Agent',
      subtitle: 'Whisper STT & Edge TTS',
      desc: 'Dual-pipeline audio intelligence: converts speech audio to text transcription, and synthesizes natural speech from text.',
      icon: FiMic,
      theme: modalityThemes.audio,
      tools: ['Faster-Whisper STT', 'Edge-TTS Voices', 'Audio Player', 'Transcription Summaries'],
    },
    {
      id: 'image',
      title: 'Image AI Agent',
      subtitle: 'Vision & Diffusion Models',
      desc: 'Deep visual understanding, image question answering, feature extraction, and text-to-image prompt generation.',
      icon: FiImage,
      theme: modalityThemes.image,
      tools: ['Vision Multimodal LLM', 'Image Generation APIs', 'Visual Q&A', 'Image Downloads'],
    },
    {
      id: 'video',
      title: 'Video AI Agent',
      subtitle: 'OpenCV & VideoGen',
      desc: 'Automates keyframe extraction with OpenCV/FFmpeg, separates audio tracks, generates video summaries, and creates AI videos.',
      icon: FiVideo,
      theme: modalityThemes.video,
      tools: ['OpenCV Frame Sampler', 'Audio Separation', 'Video Summarizer', 'Text-to-Video Engine'],
    },
  ]

  return (
    <div className="home-container p-4 sm:p-8 lg:p-10 w-full flex flex-col gap-10">
      {/* Background Ambient Glows & Gradients */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />
      <div className="ambient-glow-3" />

      {/* Hero Title & Overview Section */}
      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <Badge variant="supervisor" size="md">
            Supervisor Routing Architecture
          </Badge>
          <Badge variant="primary" size="md">
            Multimodal Multi-Agent
          </Badge>
        </div>

        <h1
          style={{ fontSize: fontSize.hero }}
          className="hero-gradient-text font-black tracking-tight mb-4 leading-tight"
        >
          Unified Multimodal Multi-Agent AI Platform
        </h1>

        <p
          style={{ color: colors.textSecondary, fontSize: fontSize.bodyLg }}
          className="leading-relaxed max-w-2xl"
        >
          A single intelligent command hub for <strong>Text</strong>, <strong>Audio</strong>,{' '}
          <strong>Images</strong>, and <strong>Videos</strong>. The LangGraph Supervisor
          evaluates your request, opens a chat session, and routes to specialized agents.
        </p>
      </div>

      {/* Central Universal Dispatch Hub */}
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <form
          onSubmit={handleDispatch}
          className="dispatch-bar rounded-2xl p-4 flex flex-col gap-4 shadow-2xl"
        >
          {/* Modality Selector Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-white/5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-gray-400 font-medium mr-1">Target Agent:</span>
              {[
                { id: 'auto', label: 'Auto (Supervisor)', color: colors.supervisor },
                { id: 'text', label: 'Text AI', color: colors.textAgent },
                { id: 'audio', label: 'Audio AI', color: colors.audioAgent },
                { id: 'image', label: 'Image AI', color: colors.imageAgent },
                { id: 'video', label: 'Video AI', color: colors.videoAgent },
              ].map((tab) => {
                const isActive = selectedModality === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedModality(tab.id)}
                    style={{
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                      color: isActive ? '#fff' : colors.textMuted,
                      borderRadius: radius.full,
                      borderColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    }}
                    className="px-3 py-1 text-xs font-semibold border transition-all hover:text-white cursor-pointer"
                  >
                    <span style={{ color: tab.color }}>●</span> {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Live Predicted Route Indicator */}
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span>Routing to:</span>
              <Badge variant={predictedAgent} size="sm">
                {predictedAgent.toUpperCase()} AGENT
              </Badge>
            </div>
          </div>

          {/* Listening Live Indicator */}
          {isListening && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-950/40 border border-pink-500/30 text-xs text-pink-300 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping shrink-0" />
              <span className="font-medium">Listening to your speech... Speak now and text will convert into the prompt</span>
            </div>
          )}

          {/* Prompt Input Row */}
          <div className="flex items-center gap-3">
            <FiZap className="w-5 h-5 text-indigo-400 shrink-0" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={isListening ? 'Listening... Speak into your microphone' : 'Ask a question, upload audio to transcribe, upload photos for visual Q&A, or analyze video...'}
              className="w-full bg-transparent text-white placeholder-gray-500 outline-none text-base font-normal leading-relaxed"
            />

            {/* Microphone Voice-to-Text Button */}
            <button
              type="button"
              onClick={() => toggleListening(prompt)}
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
              title={isListening ? 'Listening... Click to stop' : 'Click to speak (Speech-to-Text)'}
            >
              <FiMic className="w-4 h-4" />
            </button>

            {/* File Upload Trigger */}
            <button
              type="button"
              onClick={() => {
                setShowUploader(!showUploader)
                setActiveTabModality(selectedModality === 'auto' ? 'all' : selectedModality)
              }}
              style={{
                backgroundColor: showUploader ? colors.primary : 'rgba(255, 255, 255, 0.08)',
                color: showUploader ? '#fff' : colors.textSecondary,
                borderRadius: radius.md,
              }}
              className="p-2.5 transition-colors hover:text-white shrink-0 cursor-pointer"
              title="Attach Audio, Image, or Video file"
            >
              <FiPaperclip className="w-4 h-4" />
            </button>

            {/* Send / Dispatch Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={FiSend}
              iconPosition="right"
              isLoading={isProcessing}
              disabled={!prompt.trim() && !selectedFile}
              className="shrink-0"
            >
              Start Chat
            </Button>
          </div>

          {/* Collapsible File Upload Section */}
          {showUploader && (
            <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Select file modality format:</span>
                <div className="flex gap-2">
                  {['all', 'audio', 'image', 'video'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setActiveTabModality(m)}
                      className={`uppercase text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                        activeTabModality === m ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <FileUpload
                modality={activeTabModality}
                selectedFile={selectedFile}
                onFileSelect={(file) => setSelectedFile(file)}
                onClear={() => setSelectedFile(null)}
              />
            </div>
          )}

          {/* Quick Prompt Starters */}
          <div className="flex items-center gap-2 pt-1 overflow-x-auto text-xs pb-1">
            <span className="text-gray-500 shrink-0">Try prompt:</span>
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickPrompt(item)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors truncate text-left shrink-0 max-w-[220px] cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Modality Agents Grid (Text, Audio, Image, Video) */}
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2
              style={{ color: colors.textPrimary, fontSize: fontSize.h2 }}
              className="font-bold tracking-tight"
            >
              Specialized Modality Agents
            </h2>
            <p style={{ color: colors.textMuted, fontSize: fontSize.bodySm }}>
              Direct access to individual AI agents orchestrated by the Supervisor
            </p>
          </div>
          <Badge variant="supervisor" size="md">
            4 Modalities Supported
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agentCards.map((agent) => {
            const Icon = agent.icon
            return (
              <div
                key={agent.id}
                style={{
                  backgroundColor: colors.bgCard,
                  borderRadius: radius.xl,
                  border: `1px solid ${colors.borderGlass}`,
                }}
                className={`agent-card agent-card-${agent.id} p-6 flex flex-col justify-between`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      style={{
                        backgroundColor: agent.theme.bg,
                        color: agent.theme.color,
                        border: `1px solid ${agent.theme.border}`,
                        borderRadius: radius.md,
                      }}
                      className="p-3"
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant={agent.id} size="sm">
                      {agent.subtitle}
                    </Badge>
                  </div>

                  {/* Title & Desc */}
                  <h3
                    style={{ color: colors.textPrimary, fontSize: fontSize.h3 }}
                    className="font-bold mb-1"
                  >
                    {agent.title}
                  </h3>
                  <p
                    style={{ color: colors.textSecondary, fontSize: fontSize.caption }}
                    className="leading-relaxed mb-4"
                  >
                    {agent.desc}
                  </p>

                  {/* Tool Capabilities */}
                  <div className="flex flex-col gap-1.5 mb-4 pt-3 border-t border-white/5">
                    {agent.tools.map((tool, idx) => (
                      <span
                        key={idx}
                        style={{ color: colors.textMuted, fontSize: fontSize.tiny }}
                        className="flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/60" />
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Action Button - Opens New Chat with Agent */}
                <button
                  type="button"
                  onClick={() => handleLaunchAgentChat(agent)}
                  style={{
                    color: agent.theme.color,
                    borderColor: agent.theme.border,
                    backgroundColor: agent.theme.bg,
                    borderRadius: radius.md,
                    fontSize: fontSize.caption,
                  }}
                  className="w-full py-2.5 font-semibold border flex items-center justify-center gap-1.5 hover:brightness-125 transition-all cursor-pointer"
                >
                  <span>Chat with {agent.title.split(' ')[0]}</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Architecture & Routing State Flow Visualizer */}
      <Card
        header={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <FiLayers className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-white text-base">
                Supervisor Multi-Agent LangGraph Workflow
              </span>
            </div>
            <Badge variant="supervisor" size="sm">
              Compiled Graph
            </Badge>
          </div>
        }
        className="relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center items-center py-2">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 text-left">
            <span className="text-[10px] text-gray-400 font-mono uppercase">Node 1: Ingest</span>
            <p className="font-semibold text-white mt-1 text-sm">User Request</p>
            <p className="text-xs text-gray-400 mt-1">Prompt, Audio, Image, or Video payload.</p>
          </div>

          <div className="hidden md:flex justify-center text-gray-500">
            <FiArrowRight className="w-5 h-5 text-indigo-400" />
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-left">
            <span className="text-[10px] text-emerald-400 font-mono uppercase">Node 2: Supervisor</span>
            <p className="font-semibold text-emerald-300 mt-1 text-sm">Intent & Modality Router</p>
            <p className="text-xs text-gray-400 mt-1">Evaluates modality and executes conditional edge.</p>
          </div>

          <div className="hidden md:flex justify-center text-gray-500">
            <FiArrowRight className="w-5 h-5 text-indigo-400" />
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-left">
            <span className="text-[10px] text-indigo-400 font-mono uppercase">Node 3: Execution</span>
            <p className="font-semibold text-indigo-300 mt-1 text-sm">Specialized Agent</p>
            <p className="text-xs text-gray-400 mt-1">Text, Audio, Image, or Video agent returns output.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default HomePage
