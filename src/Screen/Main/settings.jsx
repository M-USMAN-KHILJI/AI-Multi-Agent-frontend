import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from 'react-avatar'
import { getFirstAndLastInitials } from '../../utils/avatarUtils'
import {
  colors,
  fontSize,
  radius,
  shadows,
  gradients,
  modalityThemes,
} from '../../Const/display'
import { useAuthStore } from '../../store/authStore'
import { useChatStore } from '../../store/chatStore'
import '../../Style/settings.css'

import {
  FiSliders,
  FiKey,
  FiUser,
  FiDatabase,
  FiCpu,
  FiCheck,
  FiSave,
  FiRefreshCw,
  FiTrash2,
  FiDownload,
  FiExternalLink,
  FiEye,
  FiEyeOff,
  FiShield,
  FiVolume2,
  FiImage,
  FiFilm,
  FiMessageSquare,
  FiArrowLeft,
  FiAlertTriangle,
  FiLogOut,
  FiMail,
} from 'react-icons/fi'

/**
 * Settings Screen - OmniAgent AI Platform
 * Powered by UI/UX Pro Max Glassmorphism & Cyberpunk Bento Architecture
 * 
 * Central Control Center for:
 * 1. Modality Agents & StateGraph Configuration
 * 2. Bring-Your-Own-Key (BYOK) API Management
 * 3. User Profile & Verified Session Controls
 * 4. PostgreSQL Database & Chat History Operations
 */
export const Settings = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { chats, clearAllChats } = useChatStore()

  // Active Tab: 'agents' | 'keys' | 'profile' | 'database'
  const [activeTab, setActiveTab] = useState('agents')
  const [hasChanges, setHasChanges] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // 1. Modality Agent Preferences
  const [textModel, setTextModel] = useState('openai/gpt-oss-120b')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1024)
  const [imageRatio, setImageRatio] = useState('1:1')
  const [promptEnhance, setPromptEnhance] = useState(true)
  const [ttsVoice, setTtsVoice] = useState('EXAVITQu4vr4xnSDxMaL') // Sarah
  const [sttLanguage, setSttLanguage] = useState('en-US')
  const [keyframeFreq, setKeyframeFreq] = useState(1.0)

  // 2. Custom API Keys (BYOK)
  const [groqKey, setGroqKey] = useState('')
  const [nvidiaKey, setNvidiaKey] = useState('')
  const [elevenKey, setElevenKey] = useState('')
  const [hfKey, setHfKey] = useState('')

  // Show/Hide Key visibility
  const [visibleKeys, setVisibleKeys] = useState({
    groq: false,
    nvidia: false,
    eleven: false,
    hf: false,
  })

  // Load saved preferences on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('omniagent_custom_settings')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.textModel) setTextModel(parsed.textModel)
        if (parsed.temperature !== undefined) setTemperature(parsed.temperature)
        if (parsed.maxTokens) setMaxTokens(parsed.maxTokens)
        if (parsed.imageRatio) setImageRatio(parsed.imageRatio)
        if (parsed.promptEnhance !== undefined) setPromptEnhance(parsed.promptEnhance)
        if (parsed.ttsVoice) setTtsVoice(parsed.ttsVoice)
        if (parsed.sttLanguage) setSttLanguage(parsed.sttLanguage)
        if (parsed.keyframeFreq) setKeyframeFreq(parsed.keyframeFreq)
        if (parsed.groqKey) setGroqKey(parsed.groqKey)
        if (parsed.nvidiaKey) setNvidiaKey(parsed.nvidiaKey)
        if (parsed.elevenKey) setElevenKey(parsed.elevenKey)
        if (parsed.hfKey) setHfKey(parsed.hfKey)
      }
    } catch (e) {
      console.warn('Failed to load settings from storage:', e)
    }
  }, [])

  // Mark changes dirty
  const handleConfigChange = (setter) => (val) => {
    setter(val)
    setHasChanges(true)
    setSaveSuccess(false)
  }

  // Save to localStorage
  const handleSavePreferences = () => {
    const payload = {
      textModel,
      temperature,
      maxTokens,
      imageRatio,
      promptEnhance,
      ttsVoice,
      sttLanguage,
      keyframeFreq,
      groqKey,
      nvidiaKey,
      elevenKey,
      hfKey,
    }
    localStorage.setItem('omniagent_custom_settings', JSON.stringify(payload))
    setHasChanges(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  // Export Chat History as JSON
  const handleExportChats = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(chats, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `omniagent_chat_history_${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  // Total messages count
  const totalMessagesCount = chats.reduce((acc, c) => acc + (c.messages?.length || 0), 0)

  return (
    <div className="settings-page-wrapper w-full p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Dynamic Background Ambient Glow Orbs */}
      <div className="settings-glow-1" />
      <div className="settings-glow-2" />

      {/* Top Header & Breadcrumb */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <FiArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <h1
            style={{ fontSize: fontSize.h1 }}
            className="text-white font-extrabold tracking-tight"
          >
            Settings & System Preferences
          </h1>
          <p style={{ color: colors.textSecondary }} className="text-sm mt-0.5">
            Configure agent models, multimodal parameters, API credentials, and database history.
          </p>
        </div>

        {/* Global Supervisor Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-xs shrink-0 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-gray-300 font-medium">Compiled LangGraph State Graph</span>
        </div>
      </div>

      {/* Main Settings Grid Layout (Left Tabs + Right Config Panel) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Navigation Tabs */}
        <div className="lg:col-span-4 flex flex-col gap-2 p-2 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setActiveTab('agents')}
            className={`settings-tab-btn ${activeTab === 'agents' ? 'active' : ''}`}
          >
            <FiSliders className="settings-tab-icon" />
            <div className="flex flex-col">
              <span>Modality Agents</span>
              <span className="text-[11px] font-normal text-gray-400">Models, tokens & sampling</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('keys')}
            className={`settings-tab-btn ${activeTab === 'keys' ? 'active' : ''}`}
          >
            <FiKey className="settings-tab-icon" />
            <div className="flex flex-col">
              <span>API Credentials (BYOK)</span>
              <span className="text-[11px] font-normal text-gray-400">Groq, NVIDIA, ElevenLabs & HF</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <FiUser className="settings-tab-icon" />
            <div className="flex flex-col">
              <span>Account & Profile</span>
              <span className="text-[11px] font-normal text-gray-400">Google Auth & sessions</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('database')}
            className={`settings-tab-btn ${activeTab === 'database' ? 'active' : ''}`}
          >
            <FiDatabase className="settings-tab-icon" />
            <div className="flex flex-col">
              <span>Database & Storage</span>
              <span className="text-[11px] font-normal text-gray-400">PostgreSQL modeldb & export</span>
            </div>
          </button>
        </div>

        {/* Right Side: Active Tab Configuration Panel */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* TAB 1: MODALITY AGENTS CONFIGURATION */}
          {activeTab === 'agents' && (
            <div className="settings-glass-card flex flex-col gap-6">
              <div className="settings-section-header">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <FiSliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      Modality Agent Parameters
                    </h2>
                    <p className="text-xs text-gray-400">
                      Customize how each specialized agent processes inputs in the LangGraph state machine.
                    </p>
                  </div>
                </div>
              </div>

              {/* Text Agent Sub-Section */}
              <div className="flex flex-col gap-4 pb-5 border-b border-white/5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                  <FiMessageSquare className="w-3.5 h-3.5" />
                  <span>Text AI Agent (Groq / LangChain)</span>
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">
                    <span>Default LLM Model</span>
                    <span className="text-gray-500 text-[11px] font-mono">Hosted on Groq LPUs</span>
                  </label>
                  <select
                    value={textModel}
                    onChange={(e) => handleConfigChange(setTextModel)(e.target.value)}
                    className="settings-select"
                  >
                    <option value="openai/gpt-oss-120b">openai/gpt-oss-120b (Ultra Reasoning - Default)</option>
                    <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Meta LLaMA 3.3)</option>
                    <option value="mixtral-8x7b-32768">mixtral-8x7b-32768 (MoE Architecture)</option>
                    <option value="gemma2-9b-it">gemma2-9b-it (Google Gemma 2)</option>
                  </select>
                </div>

                {/* Temperature Slider */}
                <div className="settings-form-group">
                  <div className="settings-label">
                    <span>Temperature: {temperature}</span>
                    <span className="text-gray-400 text-xs">
                      {temperature <= 0.3 ? 'Deterministic / Precise' : temperature <= 0.7 ? 'Balanced (Recommended)' : 'Creative & Expressive'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => handleConfigChange(setTemperature)(parseFloat(e.target.value))}
                    className="settings-range-slider"
                  />
                </div>

                {/* Max Tokens */}
                <div className="settings-form-group">
                  <div className="settings-label">
                    <span>Max Output Tokens: {maxTokens}</span>
                    <span className="text-gray-500 text-[11px] font-mono">1024 Default</span>
                  </div>
                  <input
                    type="range"
                    min="256"
                    max="4096"
                    step="128"
                    value={maxTokens}
                    onChange={(e) => handleConfigChange(setMaxTokens)(parseInt(e.target.value))}
                    className="settings-range-slider"
                  />
                </div>
              </div>

              {/* Image Agent Sub-Section */}
              <div className="flex flex-col gap-4 pb-5 border-b border-white/5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                  <FiImage className="w-3.5 h-3.5" />
                  <span>Image AI Agent (FLUX 3 Klein & PaliGemma)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="settings-form-group">
                    <label className="settings-label">
                      <span>Default Resolution Aspect Ratio</span>
                    </label>
                    <select
                      value={imageRatio}
                      onChange={(e) => handleConfigChange(setImageRatio)(e.target.value)}
                      className="settings-select"
                    >
                      <option value="1:1">1:1 Square (1024 x 1024)</option>
                      <option value="16:9">16:9 Landscape (1344 x 768)</option>
                      <option value="9:16">9:16 Portrait (768 x 1344)</option>
                    </select>
                  </div>

                  <div className="settings-form-group flex flex-col justify-between">
                    <label className="settings-label">
                      <span>Automatic Prompt Expansion</span>
                    </label>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-white/5">
                      <span className="text-xs text-gray-300">Enhance quality with LLM</span>
                      <label className="settings-toggle-switch">
                        <input
                          type="checkbox"
                          checked={promptEnhance}
                          onChange={(e) => handleConfigChange(setPromptEnhance)(e.target.checked)}
                        />
                        <span className="settings-toggle-slider" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Audio Agent Sub-Section */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-pink-400 uppercase tracking-wider">
                  <FiVolume2 className="w-3.5 h-3.5" />
                  <span>Audio AI Agent (ElevenLabs & Whisper)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="settings-form-group">
                    <label className="settings-label">
                      <span>ElevenLabs Voice Persona</span>
                    </label>
                    <select
                      value={ttsVoice}
                      onChange={(e) => handleConfigChange(setTtsVoice)(e.target.value)}
                      className="settings-select"
                    >
                      <option value="EXAVITQu4vr4xnSDxMaL">Sarah (Confident, Mature - Default)</option>
                      <option value="21m00Tcm4TlvDq8ikWAM">Rachel (Calm & Natural)</option>
                      <option value="pNInz6obpgDQGcFmaJgB">Adam (Deep & Narrator)</option>
                      <option value="ErXwobaYiN019PkySvjV">Antoni (Engaging & Clear)</option>
                    </select>
                  </div>

                  <div className="settings-form-group">
                    <label className="settings-label">
                      <span>Speech Recognition Default Language</span>
                    </label>
                    <select
                      value={sttLanguage}
                      onChange={(e) => handleConfigChange(setSttLanguage)(e.target.value)}
                      className="settings-select"
                    >
                      <option value="en-US">English (United States)</option>
                      <option value="en-GB">English (United Kingdom)</option>
                      <option value="ur-PK">Urdu (Pakistan)</option>
                      <option value="auto">Auto Detect</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: API CREDENTIALS (BYOK) */}
          {activeTab === 'keys' && (
            <div className="settings-glass-card flex flex-col gap-6">
              <div className="settings-section-header">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <FiKey className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      Bring Your Own Keys (BYOK)
                    </h2>
                    <p className="text-xs text-gray-400">
                      Override server keys with your personal developer credentials. Keys remain saved in your local browser.
                    </p>
                  </div>
                </div>
              </div>

              {/* Key 1: Groq Cloud */}
              <div className="settings-form-group">
                <div className="settings-label">
                  <span>Groq Cloud API Key</span>
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
                  >
                    <span>Get Key</span>
                    <FiExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative flex items-center">
                  <input
                    type={visibleKeys.groq ? 'text' : 'password'}
                    placeholder="gsk_..."
                    value={groqKey}
                    onChange={(e) => handleConfigChange(setGroqKey)(e.target.value)}
                    className="settings-input pr-10 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setVisibleKeys((p) => ({ ...p, groq: !p.groq }))}
                    className="absolute right-3 text-gray-400 hover:text-white"
                  >
                    {visibleKeys.groq ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Key 2: NVIDIA GenAI / Vision */}
              <div className="settings-form-group">
                <div className="settings-label">
                  <span>NVIDIA NIM / GenAI Key</span>
                  <a
                    href="https://build.nvidia.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
                  >
                    <span>Get Key</span>
                    <FiExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative flex items-center">
                  <input
                    type={visibleKeys.nvidia ? 'text' : 'password'}
                    placeholder="nvapi-..."
                    value={nvidiaKey}
                    onChange={(e) => handleConfigChange(setNvidiaKey)(e.target.value)}
                    className="settings-input pr-10 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setVisibleKeys((p) => ({ ...p, nvidia: !p.nvidia }))}
                    className="absolute right-3 text-gray-400 hover:text-white"
                  >
                    {visibleKeys.nvidia ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Key 3: ElevenLabs TTS */}
              <div className="settings-form-group">
                <div className="settings-label">
                  <span>ElevenLabs API Key</span>
                  <a
                    href="https://elevenlabs.io"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
                  >
                    <span>Get Key</span>
                    <FiExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative flex items-center">
                  <input
                    type={visibleKeys.eleven ? 'text' : 'password'}
                    placeholder="sk_..."
                    value={elevenKey}
                    onChange={(e) => handleConfigChange(setElevenKey)(e.target.value)}
                    className="settings-input pr-10 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setVisibleKeys((p) => ({ ...p, eleven: !p.eleven }))}
                    className="absolute right-3 text-gray-400 hover:text-white"
                  >
                    {visibleKeys.eleven ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Key 4: Hugging Face Token */}
              <div className="settings-form-group">
                <div className="settings-label">
                  <span>Hugging Face Access Token</span>
                  <a
                    href="https://huggingface.co/settings/tokens"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
                  >
                    <span>Get Token</span>
                    <FiExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative flex items-center">
                  <input
                    type={visibleKeys.hf ? 'text' : 'password'}
                    placeholder="hf_..."
                    value={hfKey}
                    onChange={(e) => handleConfigChange(setHfKey)(e.target.value)}
                    className="settings-input pr-10 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setVisibleKeys((p) => ({ ...p, hf: !p.hf }))}
                    className="absolute right-3 text-gray-400 hover:text-white"
                  >
                    {visibleKeys.hf ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: USER PROFILE & SESSIONS */}
          {activeTab === 'profile' && (
            <div className="settings-glass-card flex flex-col gap-6">
              <div className="settings-section-header">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      Account & Identity
                    </h2>
                    <p className="text-xs text-gray-400">
                      Manage your profile information and active authentication state.
                    </p>
                  </div>
                </div>
              </div>

              {isAuthenticated && user ? (
                <div className="flex flex-col gap-5">
                  {/* User Profile Card */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/40 border border-white/5">
                    <div className="shrink-0 flex items-center justify-center">
                      <Avatar
                        name={user.name || 'User'}
                        value={getFirstAndLastInitials(user.name)}
                        size="64"
                        round="16px"
                        className="border-2 border-indigo-500/60 object-cover shadow-lg shadow-indigo-500/20"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{user.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          VERIFIED
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                        <FiMail className="w-3.5 h-3.5" />
                        <span>{user.email}</span>
                      </span>
                      <span className="text-[11px] text-gray-500 mt-1">
                        Stored securely in PostgreSQL database (`modeldb`)
                      </span>
                    </div>
                  </div>

                  {/* Sign Out Card */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Sign Out from Session</h4>
                      <p className="text-xs text-gray-400">Disconnect this browser session.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        logout()
                        navigate('/')
                      }}
                      className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold border border-red-500/30 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <FiLogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <FiShield className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">Guest Mode Active</h3>
                  <p className="text-xs text-gray-400 max-w-sm">
                    You are exploring in guest mode. Sign in to unlock GPU image/video generation and save your preferences to PostgreSQL.
                  </p>
                  <Link
                    to="/login"
                    className="mt-2 px-5 py-2.5 rounded-xl text-white text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 hover:brightness-110"
                  >
                    Sign In or Create Account
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DATABASE & STORAGE MANAGEMENT */}
          {activeTab === 'database' && (
            <div className="settings-glass-card flex flex-col gap-6">
              <div className="settings-section-header">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                    <FiDatabase className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      Database & History Management
                    </h2>
                    <p className="text-xs text-gray-400">
                      Manage stored multimodal chats, export conversations, and inspect database state.
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistics Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 flex flex-col gap-1">
                  <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                    Total Conversations
                  </span>
                  <span className="text-2xl font-black text-white">{chats.length}</span>
                  <span className="text-[11px] text-gray-500">Threads recorded in session</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 flex flex-col gap-1">
                  <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                    Total Messages Logged
                  </span>
                  <span className="text-2xl font-black text-indigo-400">{totalMessagesCount}</span>
                  <span className="text-[11px] text-gray-500">Stored in PostgreSQL `chat_messages`</span>
                </div>
              </div>

              {/* Export Chat History */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-white/5">
                <div>
                  <h4 className="text-sm font-semibold text-white">Export Conversations</h4>
                  <p className="text-xs text-gray-400">Download all session histories and prompts as a JSON file.</p>
                </div>
                <button
                  type="button"
                  onClick={handleExportChats}
                  disabled={chats.length === 0}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <FiDownload className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
              </div>

              {/* Danger Zone: Clear History */}
              <div className="settings-danger-card flex flex-col gap-3">
                <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider font-mono">
                  <FiAlertTriangle className="w-4 h-4" />
                  <span>Danger Zone</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Clear All Local Conversations</h4>
                    <p className="text-xs text-gray-400">
                      Permanently wipes all conversation tabs from this browser instance.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete all chat history? This cannot be undone.')) {
                        clearAllChats()
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold border border-red-500/30 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                    <span>Purge Chats</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Save Action Bar (Appears when changes are made) */}
      {(hasChanges || saveSuccess) && (
        <div className="settings-save-bar">
          <div className="flex items-center gap-2">
            {saveSuccess ? (
              <>
                <FiCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-300 font-semibold">Preferences saved successfully!</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-xs text-gray-300 font-medium">You have unsaved changes</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasChanges && (
              <button
                type="button"
                onClick={handleSavePreferences}
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                }}
                className="px-4 py-2 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-500/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <FiSave className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings

