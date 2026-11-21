import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiHelpCircle,
  FiCpu,
  FiMessageSquare,
  FiMic,
  FiImage,
  FiFilm,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
  FiArrowLeft,
  FiZap,
  FiShield,
} from 'react-icons/fi'
import '../../Style/help.css'

/**
 * Help & Documentation Screen - OmniAgent AI Platform
 * Built with UI/UX Pro Max Glassmorphism
 */
export const Help = () => {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(0)

  const faqs = [
    {
      q: 'How does the Supervisor Agent route my prompts?',
      a: 'The Supervisor Agent evaluates your multimodal inputs (prompts, audio recordings, uploaded images, and video requests) using a compiled LangGraph state workflow. It automatically determines whether to dispatch your prompt to the Text AI Agent, Audio AI Agent, Image AI Agent, or Video AI Agent.',
    },
    {
      q: 'Can I bring my own API keys (BYOK)?',
      a: 'Yes. Navigate to the Model & API Settings page from your sidebar or profile dropdown. In the "API Credentials (BYOK)" tab, you can input your personal Groq, Google Gemini, NVIDIA, ElevenLabs, and Hugging Face API keys which are stored securely in your browser.',
    },
    {
      q: 'How do I change my account password?',
      a: 'Go to your Profile page. If you signed up with Email and Password, you will find the "Change Account Password" section where you can enter your current password and your new password. If you signed up using Google, password management is handled directly through your Google Account.',
    },
    {
      q: 'What media formats are supported for vision and analysis?',
      a: 'The Vision agent supports JPEG, PNG, and WebP images up to 20MB. Audio recording supports real-time streaming speech recognition directly in modern browsers through the Web Speech API and ElevenLabs neural TTS.',
    },
    {
      q: 'Is my chat history saved?',
      a: 'Yes. All conversation history is automatically persisted locally and synchronized to the PostgreSQL database for authenticated sessions, allowing you to seamlessly revisit and continue previous conversations from the left sidebar.',
    },
  ]

  const agentDocs = [
    {
      name: 'Supervisor Agent',
      color: '#10b981',
      icon: FiCpu,
      desc: 'LangGraph orchestration engine performing real-time intent analysis and state dispatching.',
    },
    {
      name: 'Text AI Agent',
      color: '#38bdf8',
      icon: FiMessageSquare,
      desc: 'Powered by Groq Llama 3.3 70B & DeepSeek R1 for lightning-fast complex reasoning and NLP.',
    },
    {
      name: 'Audio AI Agent',
      color: '#ec4899',
      icon: FiMic,
      desc: 'ElevenLabs Neural Multilingual TTS and browser-native speech-to-text recognition.',
    },
    {
      name: 'Image AI Agent',
      color: '#a855f7',
      icon: FiImage,
      desc: 'NVIDIA Google PaliGemma visual QA understanding + FLUX.1 generative image synthesis.',
    },
    {
      name: 'Video AI Agent',
      color: '#f59e0b',
      icon: FiFilm,
      desc: 'LTX-Video high-resolution video generation framework with OpenCV frame sampling.',
    },
  ]

  return (
    <div className="help-page-container">
      {/* Top Left Navigation Back Button */}
      <div className="mb-4 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer flex items-center gap-2 text-xs font-medium"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Top Banner */}
      <div className="help-hero-banner">
        <div className="flex items-center gap-2.5 mb-2">
          <FiHelpCircle className="w-6 h-6 text-indigo-400" />
          <span className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
            Support & Documentation
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          How can we help you today?
        </h1>
        <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
          Learn how to orchestrate multimodal AI agents, manage your API credentials, and get the most out
          of the OmniAgent AI Platform.
        </p>
      </div>

      {/* Agents Overview */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FiZap className="w-4 h-4 text-indigo-400" />
          <span>Multimodal Architecture</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {agentDocs.map((agent, i) => {
            const Icon = agent.icon
            return (
              <div key={i} className="help-agent-card">
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    style={{ background: `${agent.color}20`, color: agent.color }}
                    className="p-2 rounded-lg"
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm text-white">{agent.name}</h3>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{agent.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FiHelpCircle className="w-4 h-4 text-sky-400" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div>
          {faqs.map((faq, idx) => (
            <div key={idx} className="help-faq-card">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="help-faq-header"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <FiChevronUp className="w-4 h-4 text-indigo-400 shrink-0 ml-2" />
                ) : (
                  <FiChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
                )}
              </button>
              {openFaq === idx && <div className="help-faq-body">{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Help

