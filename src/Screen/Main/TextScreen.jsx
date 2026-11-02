import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { colors, fontSize, radius, modalityThemes } from '../../Const/display'
import { Button, Badge, Card, Textarea } from '../../customComp'
import { FiMessageSquare, FiSend, FiUser, FiCpu, FiCopy, FiCheck } from 'react-icons/fi'

export const TextScreen = () => {
  const location = useLocation()
  const initialPrompt = location.state?.prompt || ''
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'assistant',
      text: 'Hello! I am the **Text AI Agent**. I specialize in conversational chat, question answering, summarization, and content generation powered by LangChain. How can I assist you today?',
      time: 'Just now',
    },
  ])
  const [input, setInput] = useState(initialPrompt)
  const [copiedId, setCopiedId] = useState(null)

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      time: 'Just now',
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')

    // Simulated responsive feedback until backend connected
    setTimeout(() => {
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `Received: "${userMsg.text}". The LangChain LLM pipeline is ready to generate structured, context-aware answers.`,
        time: 'Just now',
      }
      setMessages((prev) => [...prev, botMsg])
    }, 600)
  }

  const copyToClipboard = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Screen Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <div
            style={{
              backgroundColor: modalityThemes.text.bg,
              color: modalityThemes.text.color,
              border: `1px solid ${modalityThemes.text.border}`,
              borderRadius: radius.md,
            }}
            className="p-2.5"
          >
            <FiMessageSquare className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h2 style={{ color: colors.textPrimary, fontSize: fontSize.h3 }} className="font-bold">
              Text AI Agent
            </h2>
            <p style={{ color: colors.textMuted, fontSize: fontSize.caption }}>
              LangChain Conversational Pipeline & Prompt Engine
            </p>
          </div>
        </div>
        <Badge variant="text">LangChain Connected</Badge>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user'
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                style={{
                  backgroundColor: isUser ? colors.primary : colors.bgCard,
                  color: '#fff',
                  border: `1px solid ${colors.borderGlass}`,
                  borderRadius: radius.full,
                }}
                className="w-9 h-9 flex items-center justify-center shrink-0 shadow-sm"
              >
                {isUser ? <FiUser className="w-4 h-4" /> : <FiCpu className="w-4 h-4 text-sky-400" />}
              </div>

              <div
                style={{
                  backgroundColor: isUser ? 'rgba(99, 102, 241, 0.15)' : colors.bgCard,
                  border: `1px solid ${isUser ? 'rgba(99, 102, 241, 0.35)' : colors.borderGlass}`,
                  borderRadius: radius.lg,
                }}
                className="p-4 relative group"
              >
                <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap text-left">
                  {msg.text}
                </p>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5 text-xs text-gray-500">
                  <span>{msg.time}</span>
                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-white"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <FiCheck className="w-3.5 h-3.5 text-emerald-400" /> : <FiCopy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Chat Input Bar */}
      <form onSubmit={handleSend} className="shrink-0 flex gap-2">
        <Textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message or prompt here... (Press Enter to send)"
          className="flex-1"
        />
        <Button
          type="submit"
          variant="primary"
          size="lg"
          icon={FiSend}
          className="self-end"
        >
          Send
        </Button>
      </form>
    </div>
  )
}

export default TextScreen
