import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const INITIAL_DEMO_CHATS = [
  {
    id: 'chat_demo_1',
    title: 'LangGraph Multi-Agent Architecture',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    messages: [
      {
        id: 'msg_1_1',
        sender: 'user',
        text: 'How does the Supervisor Agent coordinate with the specialized agents?',
        timestamp: '2 hours ago',
      },
      {
        id: 'msg_1_2',
        sender: 'assistant',
        text: `The **Supervisor Agent** acts as the central router in our LangGraph architecture:

1. **Intent Analysis**: It parses the incoming query and inspects any attached media (audio, image, or video).
2. **Conditional Routing**: It invokes dynamic graph edges to dispatch the payload to the specialized node:
   - **Text Agent**: LangChain LLM reasoning & question answering.
   - **Audio Agent**: Whisper STT transcription & Edge-TTS synthesis.
   - **Image Agent**: Multimodal Vision Q&A & Diffusers generation.
   - **Video Agent**: OpenCV keyframe sampling & VideoGen.
3. **State Aggregation**: Returns the finalized multimodal response back to the client.`,
        agentType: 'supervisor',
        agentName: 'Supervisor Agent (LangGraph)',
        timestamp: '2 hours ago',
        routingReason: 'User inquired about multi-agent coordination; handled by the Supervisor and Text agent pipeline.',
      },
    ],
  },
  {
    id: 'chat_demo_2',
    title: 'Whisper STT Audio Analysis',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 + 1800000).toISOString(),
    messages: [
      {
        id: 'msg_2_1',
        sender: 'user',
        text: 'Transcribe this lecture recording and summarize the key technical takeaways.',
        timestamp: 'Yesterday',
        file: {
          name: 'lecture_meeting.mp3',
          size: '4.2 MB',
          type: 'audio/mp3',
        },
      },
      {
        id: 'msg_2_2',
        sender: 'assistant',
        text: `**Audio Transcription (Faster-Whisper):**
"In today's session, we reviewed the architectural decoupling of model providers, ensuring that local fallback and hosted APIs can be configured without rewriting agent routing logic."

**Key Takeaways:**
• Provider swappability maintained via uniform service interfaces.
• Celery task workers isolate long-running media synthesis jobs.`,
        agentType: 'audio',
        agentName: 'Audio AI Agent (Whisper STT)',
        timestamp: 'Yesterday',
        routingReason: 'Detected audio attachment (lecture_meeting.mp3). Supervisor routed to Audio Agent.',
      },
    ],
  },
]

export const useChatStore = create(
  persist(
    (set, get) => ({
      chats: INITIAL_DEMO_CHATS,
      activeChatId: 'chat_demo_1',

      // Select active chat
      setActiveChat: (chatId) => set({ activeChatId: chatId }),

      // Create a brand new chat
      createNewChat: (initialPrompt = '', file = null) => {
        const newChatId = `chat_${Date.now()}`
        const initialTitle = initialPrompt
          ? initialPrompt.slice(0, 32) + (initialPrompt.length > 32 ? '...' : '')
          : 'New Conversation'

        const newMessages = []
        if (initialPrompt.trim() || file) {
          newMessages.push({
            id: `msg_${Date.now()}_u`,
            sender: 'user',
            text: initialPrompt,
            file: file
              ? {
                  name: file.name,
                  size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                  type: file.type,
                }
              : null,
            timestamp: 'Just now',
          })
        }

        const newChat = {
          id: newChatId,
          title: initialTitle,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: newMessages,
        }

        set((state) => ({
          chats: [newChat, ...state.chats],
          activeChatId: newChatId,
        }))

        return newChat
      },

      // Add a message to a specific chat
      addMessage: (chatId, message) => {
        set((state) => {
          const chatIndex = state.chats.findIndex((c) => c.id === chatId)
          if (chatIndex === -1) return state

          const targetChat = { ...state.chats[chatIndex] }
          const updatedMessages = [...targetChat.messages, message]

          // Update title if it was default
          let title = targetChat.title
          if (
            (title === 'New Conversation' || title === 'Untitled Chat') &&
            message.sender === 'user' &&
            message.text
          ) {
            title = message.text.slice(0, 32) + (message.text.length > 32 ? '...' : '')
          }

          const updatedChat = {
            ...targetChat,
            title,
            updatedAt: new Date().toISOString(),
            messages: updatedMessages,
          }

          const updatedChats = [...state.chats]
          updatedChats[chatIndex] = updatedChat

          // Bring updated chat to top of list
          updatedChats.sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )

          return { chats: updatedChats }
        })
      },

      // Delete a chat
      deleteChat: (chatId, e) => {
        if (e) e.stopPropagation()
        set((state) => {
          const remaining = state.chats.filter((c) => c.id !== chatId)
          let newActive = state.activeChatId
          if (state.activeChatId === chatId) {
            newActive = remaining.length > 0 ? remaining[0].id : null
          }
          return {
            chats: remaining,
            activeChatId: newActive,
          }
        })
      },

      // Clear all
      clearAllChats: () => set({ chats: [], activeChatId: null }),
    }),
    {
      name: 'omniagent_multimodal_chats',
    }
  )
)

