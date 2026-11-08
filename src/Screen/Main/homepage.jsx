import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
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
  AuthRequiredModal,
} from '../../customComp'
import { useChatStore } from '../../store/chatStore'
import { useAuthStore } from '../../store/authStore'
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
  FiShield,
  FiRadio,
  FiSliders,
} from 'react-icons/fi'

/**
 * HomePage - Master Multimodal Multi-Agent Command Dashboard
 * Powered by UI/UX Pro Max Design Intelligence & Silky-Smooth GSAP Choreography
 */
export const HomePage = () => {
  const navigate = useNavigate()
  const { createNewChat, addMessage } = useChatStore()
  const { isAuthenticated } = useAuthStore()

  const [prompt, setPrompt] = useState('')
  const [selectedModality, setSelectedModality] = useState('auto') // 'auto' | 'text' | 'audio' | 'image' | 'video'
  const [selectedFile, setSelectedFile] = useState(null)
  const [showUploader, setShowUploader] = useState(false)
  const [activeTabModality, setActiveTabModality] = useState('all')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [gatedFeatureName, setGatedFeatureName] = useState('Image & Video Generation')

  // GSAP Scope Container Reference
  const containerRef = useRef(null)

  // Speech-to-Text Recognition Hook
  const { isListening, toggleListening } = useSpeechRecognition({
    onTranscriptChange: (text) => setPrompt(text),
  })

  // Silky-Smooth GSAP Orchestrated Animation Sequence
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // 1. Ambient Background Glows Breathing / Floating Animation
      gsap.to('.ambient-glow-1', {
        x: '+=35',
        y: '+=30',
        scale: 1.08,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      gsap.to('.ambient-glow-2', {
        x: '-=30',
        y: '-=35',
        scale: 1.07,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5,
      })

      gsap.to('.ambient-glow-3', {
        x: '+=25',
        y: '-=25',
        scale: 1.06,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1,
      })

      // 2. Silky-Smooth Hero & Page Orchestration (Gentle, Relaxed & Cinematic)
      // Top architecture badge pill
      gsap.fromTo(
        '.hero-badge',
        { opacity: 0, y: -18 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          delay: 0.15,
          ease: 'power2.out',
        }
      )

      // Main Hero Headline: "Unified Multimodal Multi-Agent AI Platform"
      gsap.fromTo(
        '.hero-headline',
        { opacity: 0, y: 32, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.45,
          delay: 0.3,
          ease: 'power2.out',
        }
      )

      // Hero Subtitle Description
      gsap.fromTo(
        '.hero-subtext',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1.35,
          delay: 0.55,
          ease: 'power2.out',
        }
      )

      // Live Quick Metrics Strip
      gsap.fromTo(
        '.hero-metrics-strip',
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 1.15,
          delay: 0.8,
          ease: 'power2.out',
        }
      )

      // Central Omnichannel Dispatch Bar Hub
      gsap.fromTo(
        '.dispatch-bar-section',
        { opacity: 0, y: 36, scale: 0.99 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.35,
          delay: 1.0,
          ease: 'power2.out',
        }
      )

      // 4 Specialized Modality Bento Cards (Gentle cascade stagger)
      gsap.fromTo(
        '.agent-bento-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.25,
          stagger: 0.18, // Luxurious relaxed wave stagger
          delay: 1.25,
          ease: 'power2.out',
          clearProps: 'transform,opacity', // Crucial: preserves clean hover & transform states
        }
      )

      // LangGraph Multi-Agent Architecture Section
      gsap.fromTo(
        '.workflow-section-block',
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 1.25,
          delay: 1.9,
          ease: 'power2.out',
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Quick prompt suggestions with predefined routing
  const quickPrompts = [
    {
      label: 'Text: Explain Multi-Agent LangGraph',
      text: 'Explain how LangGraph supervisor patterns coordinate specialized modality agents with conditional routing.',
      modality: 'text',
      agent: 'Text Agent',
      icon: FiMessageSquare,
    },
    {
      label: 'Audio: Speech-to-Text Transcription',
      text: 'Transcribe this lecture recording and summarize the key technical takeaways with timestamps.',
      modality: 'audio',
      agent: 'Audio Agent',
      icon: FiMic,
    },
    {
      label: 'Image: Visual Inspection & Q&A',
      text: 'Analyze this uploaded diagram and identify architectural bottlenecks and interface boundaries.',
      modality: 'image',
      agent: 'Image Agent',
      icon: FiImage,
    },
    {
      label: 'Video: Keyframe Summarization',
      text: 'Sample keyframes from this video at 1.0s intervals with OpenCV and summarize scene transitions.',
      modality: 'video',
      agent: 'Video Agent',
      icon: FiVideo,
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

  const predictedAgent = getPredictedAgent()

  const handleQuickPrompt = (item) => {
    setPrompt(item.text)
    setSelectedModality(item.modality)
  }

  // Omnichannel Dispatch Handler
  const handleDispatch = (e) => {
    if (e) e.preventDefault()
    if (!prompt.trim() && !selectedFile) return

    const userPrompt = prompt.trim()
    const targetModality = predictedAgent

    // Gated Check: Image & Video Generation require user login
    if (!isAuthenticated && (targetModality === 'image' || targetModality === 'video')) {
      const featureTitle = targetModality === 'image' ? 'Image AI Generation' : 'Video AI Generation'
      setGatedFeatureName(featureTitle)
      setShowAuthModal(true)
      return
    }

    setIsProcessing(true)

    // Modality agent names
    const agentMap = {
      text: 'Text AI Agent',
      audio: 'Audio AI Agent',
      image: 'Image AI Agent',
      video: 'Video AI Agent',
    }
    const agentName = agentMap[targetModality] || 'Text AI Agent'

    // Create a new chat session in chatStore
    const newChat = createNewChat(userPrompt.slice(0, 45) || `${agentName} Session`)

    // Add user message to session
    addMessage(newChat.id, {
      id: `msg_${Date.now()}_u`,
      sender: 'user',
      text: userPrompt || (selectedFile ? `Uploaded ${selectedFile.name}` : ''),
      modality: targetModality,
      attachment: selectedFile ? { name: selectedFile.name, type: selectedFile.type, size: selectedFile.size } : null,
      timestamp: 'Just now',
    })

    // Simulate Supervisor Routing Handshake
    setTimeout(() => {
      addMessage(newChat.id, {
        id: `msg_${Date.now()}_a`,
        sender: 'assistant',
        text: `**Supervisor Decision:** Intent routed to **${agentName}** based on modal inputs.\n\nExecuting specialized pipeline: \`[SupervisorNode -> ${agentName} -> StateGraph]\`. Processing your request...`,
        agentType: targetModality,
        agentName: agentName,
        routingReason: `Supervisor analyzed user input payload and routed to ${agentName}.`,
        timestamp: 'Just now',
      })
      setIsProcessing(false)
      navigate(`/chat/${newChat.id}`)
    }, 400)
  }

  // Handle direct agent launch from cards
  const handleStartDirectAgentChat = (agent) => {
    // Gated Check: Image and Video cards require user login
    if (!isAuthenticated && (agent.id === 'image' || agent.id === 'video')) {
      setGatedFeatureName(agent.title)
      setShowAuthModal(true)
      return
    }

    const defaultPrompts = {
      text: 'Explain how LangGraph supervisor patterns coordinate specialized agents.',
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
      desc: 'Conversational chat, multi-step reasoning, contextual synthesis, document summarization, and prompt engineering.',
      icon: FiMessageSquare,
      theme: modalityThemes.text,
      tools: ['LangChain Models', 'Prompt Templates', 'Streaming Output', 'Chat Context'],
      status: 'Ready',
    },
    {
      id: 'audio',
      title: 'Audio AI Agent',
      subtitle: 'Whisper STT & Edge TTS',
      desc: 'Dual-pipeline audio intelligence: speech-to-text with Faster-Whisper, and ultra-natural voice synthesis with Edge-TTS.',
      icon: FiMic,
      theme: modalityThemes.audio,
      tools: ['Faster-Whisper STT', 'Edge-TTS Voices', 'Audio Player', 'Transcription Logs'],
      status: 'Ready',
    },
    {
      id: 'image',
      title: 'Image AI Agent',
      subtitle: 'Vision & Diffusion Models',
      desc: 'Deep visual question answering, scene understanding, object feature detection, and text-to-image synthesis.',
      icon: FiImage,
      theme: modalityThemes.image,
      tools: ['Vision Multimodal LLM', 'Image Generation APIs', 'Visual Q&A', 'HD Exports'],
      status: 'Ready',
    },
    {
      id: 'video',
      title: 'Video AI Agent',
      subtitle: 'OpenCV & VideoGen',
      desc: 'Automates keyframe extraction with OpenCV, separates audio tracks for Whisper, and summarizes dynamic scenes.',
      icon: FiVideo,
      theme: modalityThemes.video,
      tools: ['OpenCV Frame Sampler', 'Audio Separation', 'Video Summarizer', 'Text-to-Video Engine'],
      status: 'Ready',
    },
  ]

  return (
    <div
      ref={containerRef}
      className="home-container p-4 sm:p-8 lg:p-12 w-full flex flex-col gap-12"
    >
      {/* Background Ambient Glows & Gradients */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />
      <div className="ambient-glow-3" />

      {/* Hero Title & Live System Metrics Section */}
      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center pt-2">
        {/* Architecture Pill Badges */}
        <div className="hero-badge inline-flex items-center gap-2.5 mb-5 p-1 pr-3 rounded-full telemetry-chip">
          <Badge variant="supervisor" size="md" className="shadow-sm">
            Supervisor Routing Active
          </Badge>
          <span className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            LangGraph State Graph v1.4
          </span>
        </div>

        <h1
          style={{ fontSize: fontSize.hero }}
          className="hero-headline hero-gradient-text font-black tracking-tight mb-4 leading-[1.12]"
        >
          Unified Multimodal Multi-Agent AI Platform
        </h1>

        <p
          style={{ color: colors.textSecondary, fontSize: fontSize.bodyLg }}
          className="hero-subtext leading-relaxed max-w-2xl font-normal"
        >
          A single command center orchestrating <strong className="text-white">Text</strong>,{' '}
          <strong className="text-sky-300">Audio</strong>, <strong className="text-purple-300">Images</strong>, and{' '}
          <strong className="text-amber-300">Videos</strong>. The Supervisor evaluates intent and conditionally routes through compiled state graphs.
        </p>

        {/* Live Quick Metrics Strip */}
        <div className="hero-metrics-strip flex items-center justify-center flex-wrap gap-3 sm:gap-6 mt-6 pt-5 border-t border-white/5 w-full">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>4 Specialized Agents</span>
          </div>
          <span className="text-gray-700 hidden sm:inline">•</span>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <FiRadio className="w-3.5 h-3.5 text-indigo-400" />
            <span>Real-time Speech Recognition</span>
          </div>
          <span className="text-gray-700 hidden sm:inline">•</span>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <FiCpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Faster-Whisper + OpenCV Engine</span>
          </div>
        </div>
      </div>

      {/* Central Universal Dispatch Hub */}
      <div className="dispatch-bar-section relative z-10 max-w-5xl mx-auto w-full">
        <form
          onSubmit={handleDispatch}
          className="dispatch-bar-pro rounded-2xl p-4 sm:p-5 flex flex-col gap-4"
        >

          {/* Listening Live Indicator */}
          {isListening && (
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-pink-950/50 border border-pink-500/40 text-xs text-pink-200 animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping shrink-0" />
              <span className="font-semibold">Speech Recognition Active:</span>
              <span className="text-pink-300">Speak naturally and words will stream directly into the prompt...</span>
            </div>
          )}

          {/* Prompt Input Row */}
          <div className="flex items-center gap-3">
            {/* File Upload Trigger (Moved to Left Side) */}
            {/* File Upload Trigger */}
            <button
              type="button"
              onClick={() => {
                setShowUploader(!showUploader)
                setActiveTabModality(selectedModality === 'auto' ? 'all' : selectedModality)
              }}
              style={{
                backgroundColor: showUploader ? colors.primary : 'rgba(255, 255, 255, 0.06)',
                color: showUploader ? '#fff' : colors.textSecondary,
                borderRadius: radius.lg,
              }}
              className="p-2.5 transition-all hover:text-white hover:bg-white/10 shrink-0 cursor-pointer border border-white/5 active:scale-95"
              title="Attach Audio, Image, or Video file"
            >
              <FiPaperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={isListening ? 'Listening... Speak into your microphone' : 'Ask any question, transcribe audio, inspect images with vision, or sample video frames...'}
              className="w-full bg-transparent text-white placeholder-gray-500 outline-none text-base font-normal leading-relaxed"
            />

            {/* Microphone Voice-to-Text Button */}
            <button
              type="button"
              onClick={() => toggleListening(prompt)}
              style={{
                backgroundColor: isListening
                  ? colors.audioAgent
                  : 'rgba(255, 255, 255, 0.06)',
                color: isListening ? '#ffffff' : colors.textSecondary,
                borderRadius: radius.lg,
                boxShadow: isListening ? '0 0 20px rgba(236, 72, 153, 0.7)' : 'none',
              }}
              className={`p-2.5 transition-all shrink-0 cursor-pointer border border-white/5 ${
                isListening ? 'animate-pulse scale-105' : 'hover:text-white hover:bg-white/10 active:scale-95'
              }`}
              title={isListening ? 'Listening... Click to stop' : 'Click to speak (Speech-to-Text)'}
            >
              <FiMic className="w-4 h-4" />
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
              className="shrink-0 shadow-lg shadow-indigo-500/25 cursor-pointer active:scale-95"
            >
              Start Chat
            </Button>
          </div>

          {/* Collapsible File Upload Section */}
          {showUploader && (
            <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-medium">Select file modality format:</span>
                <div className="flex gap-2">
                  {['all', 'audio', 'image', 'video'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setActiveTabModality(m)}
                      className={`uppercase text-[10px] font-bold px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
                        activeTabModality === m ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
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
          )}</form>
      </div>

      {/* Modality Agent Bento Grid Section */}
      <div className="relative z-10 w-full flex flex-col gap-6 max-w-7xl mx-auto">
        {/* Section Header with Modality Category Filter */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-2">
          <div>
            <h2
              style={{ fontSize: fontSize.h2 }}
              className="text-white font-bold tracking-tight"
            >
              Specialized Modality Agents
            </h2>
            <p style={{ color: colors.textSecondary }} className="text-sm mt-0.5">
              Targeted domain agents coordinated through conditional supervisor state routing
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="success" size="md">
              4 Modalities Ready
            </Badge>
          </div>
        </div>

        {/* 4 Agent Bento Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {agentCards.map((agent) => {
            const IconComponent = agent.icon
            return (
              <div
                key={agent.id}
                className={`agent-bento-card bento-card agent-card-${agent.id} rounded-2xl p-6 flex flex-col justify-between`}
              >
                <div className="flex flex-col gap-4">
                  {/* Card Header: Icon + Modality Status */}
                  <div className="flex items-center justify-between">
                    <div
                      style={{
                        backgroundColor: agent.theme.bg,
                        borderColor: agent.theme.border,
                        boxShadow: `0 0 20px ${agent.theme.glow}`,
                      }}
                      className="w-12 h-12 rounded-xl border flex items-center justify-center"
                    >
                      <IconComponent
                        style={{ color: agent.theme.color }}
                        className="w-6 h-6 stroke-[2]"
                      />
                    </div>

                    <span
                      style={{
                        color: agent.theme.color,
                        borderColor: agent.theme.border,
                        backgroundColor: agent.theme.bg,
                      }}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border"
                    >
                      {agent.status}
                    </span>
                  </div>

                  {/* Title & Technical Subtitle */}
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {agent.title}
                    </h3>
                    <p
                      style={{ color: agent.theme.color }}
                      className="text-xs font-mono font-semibold tracking-wide uppercase mt-0.5"
                    >
                      {agent.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p
                    style={{ color: colors.textSecondary }}
                    className="text-xs leading-relaxed line-clamp-3"
                  >
                    {agent.desc}
                  </p>

                  {/* Integrated Capability Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                    {agent.tools.map((tool, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/4 text-gray-400 border border-white/5"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Action Button */}
                <div className="pt-5 mt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => handleStartDirectAgentChat(agent)}
                    style={{
                      borderColor: agent.theme.border,
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer group"
                  >
                    <span>Launch Agent</span>
                    <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Supervisor Multi-Agent LangGraph Workflow Diagram Section */}
      <div className="workflow-section-block relative z-10 max-w-7xl mx-auto w-full">
        <div className="bento-card rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FiLayers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Supervisor Multi-Agent LangGraph Workflow
                </h3>
                <p className="text-xs text-gray-400">
                  State-machine orchestration with dynamic conditional edge evaluation
                </p>
              </div>
            </div>

            <Badge variant="supervisor" size="sm">
              Compiled Graph
            </Badge>
          </div>

          {/* Interactive Pipeline Visualization Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
            <div className="p-4 rounded-xl bg-white/3 border border-white/5 flex flex-col gap-2 pipeline-connector">
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
                Node 1: Ingest
              </span>
              <h4 className="text-sm font-semibold text-white">User Request</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Prompt, Audio, Image, or Video payload entering the graph.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col gap-2 pipeline-connector">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                Node 2: Supervisor
              </span>
              <h4 className="text-sm font-semibold text-white">Intent & Modality Router</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Evaluates modality keywords, file formats, and conditionally dispatches.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 flex flex-col gap-2">
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                Node 3: Execution
              </span>
              <h4 className="text-sm font-semibold text-white">Specialized Agent</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Text, Audio, Image, or Video tool pipeline processes and logs state.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Required Modal for Gated Features (Image & Video) */}
      <AuthRequiredModal
        isOpen={showAuthModal}
        featureName={gatedFeatureName}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => {
          setShowAuthModal(false)
          navigate('/login', {
            state: {
              reason: `Sign in required to access ${gatedFeatureName}.`,
              from: '/',
            },
          })
        }}
      />
    </div>
  )
}

export default HomePage
