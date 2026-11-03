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
  FiShield,
  FiRadio,
  FiSliders,
} from 'react-icons/fi'

/**
 * HomePage - Master Multimodal Multi-Agent Command Dashboard
 * Powered by UI/UX Pro Max Design Intelligence & Silky-Smooth GSAP Animations (power3.out, 1.1s duration)
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

  // GSAP Scope Container Reference
  const containerRef = useRef(null)

  // Speech-to-Text Recognition Hook
  const { isListening, toggleListening } = useSpeechRecognition({
    onTranscriptChange: (text) => setPrompt(text),
  })

  // Silky-Smooth GSAP Animation Sequence
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

      // 2. Silky-Smooth Orchestrated Entry Sequence (Longer 1.1s curves with gentle power3.out decelerations)
      gsap.fromTo(
        '.hero-content-block',
        { opacity: 0, y: -24 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
        }
      )

      gsap.fromTo(
        '.dispatch-bar-section',
        { opacity: 0, y: 32, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.15,
          delay: 0.22,
          ease: 'power3.out',
        }
      )

      gsap.fromTo(
        '.agent-bento-card',
        { opacity: 0, y: 36, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.05,
          stagger: 0.14, // Relaxed natural wave stagger
          delay: 0.38,
          ease: 'power3.out',
          clearProps: 'transform,opacity', // Preserves clean hover states
        }
      )

      gsap.fromTo(
        '.workflow-section-block',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          delay: 0.72,
          ease: 'power3.out',
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

    setIsProcessing(true)

    const userPrompt = prompt.trim()
    const attachedFile = selectedFile
    const chosenModality = predictedAgent

    // 1. Create a fresh conversation in Zustand
    const newChat = createNewChat(userPrompt.slice(0, 36) || `${chosenModality.toUpperCase()} Query`)

    // 2. Append user message into the newly created chat
    addMessage(newChat.id, {
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
      timestamp: 'Just now',
    })

    // 3. Immediately open that conversation page
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
      <div className="hero-content-block relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center pt-2">
        {/* Architecture Pill Badges */}
        <div className="inline-flex items-center gap-2.5 mb-5 p-1 pr-3 rounded-full telemetry-chip">
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
          className="hero-gradient-text font-black tracking-tight mb-4 leading-[1.12]"
        >
          Unified Multimodal Multi-Agent AI Platform
        </h1>

        <p
          style={{ color: colors.textSecondary, fontSize: fontSize.bodyLg }}
          className="leading-relaxed max-w-2xl font-normal"
        >
          A single command center orchestrating <strong className="text-white">Text</strong>,{' '}
          <strong className="text-sky-300">Audio</strong>, <strong className="text-purple-300">Images</strong>, and{' '}
          <strong className="text-amber-300">Videos</strong>. The Supervisor evaluates intent and conditionally routes through compiled state graphs.
        </p>

        {/* Live Quick Metrics Strip */}
        <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-6 mt-6 pt-5 border-t border-white/5 w-full">
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
          {/* Modality Selector Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/8">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mr-1.5">
                Target Modality:
              </span>
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
                      backgroundColor: isActive ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      color: isActive ? '#ffffff' : colors.textSecondary,
                      borderRadius: radius.md,
                      borderColor: isActive ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.06)',
                    }}
                    className="px-3 py-1.5 text-xs font-semibold border transition-all hover:text-white hover:bg-white/10 cursor-pointer active:scale-95"
                  >
                    <span style={{ color: tab.color }} className="mr-1">●</span> {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Live Predicted Route Indicator */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="text-[11px] font-mono uppercase text-gray-400">Evaluated Route:</span>
              <Badge variant={predictedAgent} size="sm">
                {predictedAgent.toUpperCase()} AGENT
              </Badge>
            </div>
          </div>

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
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <FiZap className="w-4 h-4" />
            </div>
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
          )}

          {/* Quick Prompt Starters (Interactive Chips) */}
          <div className="flex items-center gap-2 pt-1 overflow-x-auto text-xs pb-1 custom-scroll">
            <span className="text-gray-400 font-semibold text-[11px] uppercase tracking-wide shrink-0 mr-1">
              Suggestions:
            </span>
            {quickPrompts.map((item, idx) => {
              const PromptIcon = item.icon
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickPrompt(item)}
                  className="px-3 py-1.5 rounded-lg bg-white/4 hover:bg-white/8 border border-white/6 hover:border-indigo-500/30 text-gray-300 hover:text-white transition-all truncate text-left shrink-0 max-w-[240px] cursor-pointer flex items-center gap-2 active:scale-98"
                >
                  <PromptIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              )
            })}
          </div>
        </form>
      </div>

      {/* Specialized Modality Agents Bento Grid */}
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2
              style={{ color: colors.textPrimary, fontSize: fontSize.h2 }}
              className="font-bold tracking-tight"
            >
              Specialized Modality Agents
            </h2>
            <p style={{ color: colors.textMuted, fontSize: fontSize.bodySm }} className="mt-0.5">
              Targeted domain agents coordinated through conditional supervisor state routing
            </p>
          </div>
          <Badge variant="supervisor" size="md">
            4 Modalities Ready
          </Badge>
        </div>

        {/* 4-Column Bento Card Layout - 100% explicitly styled & rendered */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {agentCards.map((agent) => {
            const Icon = agent.icon
            return (
              <div
                key={agent.id}
                style={{
                  borderRadius: radius.xl,
                }}
                className={`agent-bento-card bento-card agent-card-${agent.id} p-6 flex flex-col justify-between`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      style={{
                        backgroundColor: agent.theme.bg,
                        color: agent.theme.color,
                        border: `1px solid ${agent.theme.border}`,
                        borderRadius: radius.lg,
                      }}
                      className="p-3 shadow-md"
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
                    className="font-bold mb-1.5"
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
                  <div className="flex flex-col gap-2 mb-5 pt-3.5 border-t border-white/6">
                    {agent.tools.map((tool, idx) => (
                      <span
                        key={idx}
                        style={{ color: colors.textMuted, fontSize: fontSize.tiny }}
                        className="flex items-center gap-2 font-mono"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/80" />
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
                    borderRadius: radius.lg,
                    fontSize: fontSize.caption,
                  }}
                  className="w-full py-2.5 font-semibold border flex items-center justify-center gap-2 hover:brightness-125 transition-all cursor-pointer shadow-sm active:scale-98 group"
                >
                  <span>Chat with {agent.title.split(' ')[0]}</span>
                  <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* LangGraph Supervisor Workflow Visualizer Card */}
      <div className="workflow-section-block">
        <Card
          header={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <FiLayers className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white text-base block leading-none">
                    Supervisor Multi-Agent LangGraph Workflow
                  </span>
                  <span className="text-[11px] text-gray-400 font-normal">
                    State-machine orchestration with dynamic conditional edge evaluation
                  </span>
                </div>
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
            <div className="p-4 rounded-xl bg-slate-900/70 border border-white/8 text-left shadow-sm">
              <span className="text-[10px] text-indigo-400 font-mono uppercase font-bold">Node 1: Ingest</span>
              <p className="font-bold text-white mt-1 text-sm">User Request</p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Prompt, Audio, Image, or Video payload entering the graph.
              </p>
            </div>

            <div className="hidden md:flex justify-center text-gray-500">
              <FiArrowRight className="w-5 h-5 text-indigo-400" />
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-left shadow-sm">
              <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold">Node 2: Supervisor</span>
              <p className="font-bold text-emerald-300 mt-1 text-sm">Intent & Modality Router</p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Evaluates modality keywords, file formats, and conditionally dispatches.
              </p>
            </div>

            <div className="hidden md:flex justify-center text-gray-500">
              <FiArrowRight className="w-5 h-5 text-indigo-400" />
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-left shadow-sm">
              <span className="text-[10px] text-indigo-400 font-mono uppercase font-bold">Node 3: Execution</span>
              <p className="font-bold text-indigo-300 mt-1 text-sm">Specialized Agent</p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Text, Audio, Image, or Video tool pipeline processes and logs state.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default HomePage
