# Multimodal Multi-Agent AI Platform

A production-grade, enterprise-ready full-stack application that coordinates **4 specialized AI modalities (Text, Audio, Image, and Video)** under a centralized **Supervisor Agent** orchestrator powered by **LangGraph** and **LangChain**, backed by **FastAPI** (Python) and a cutting-edge **React 19 + Tailwind CSS** frontend.

---

## 1. What Are We Building?

We are building a unified intelligent multi-agent platform where a user can enter queries or upload assets across multiple formats (text, voice audio, pictures, or videos). Instead of interacting with isolated tools, the **Supervisor Agent** automatically analyzes user intent, decides the optimal domain agent, and coordinates stateful workflows:

1. **Supervisor Agent (Orchestrator)**: Evaluates user prompts and attached file types, executing conditional routing logic across the LangGraph workflow.
2. **Text AI Agent (LangChain Core)**: Handles NLP reasoning, contextual question answering, prompt engineering, and conversational streaming.
3. **Audio AI Agent (Whisper STT & Edge-TTS)**: Transcribes speech from uploaded audio files in real time and synthesizes natural audio output.
4. **Image AI Agent (Vision & Diffusers)**: Conducts visual question answering, image inspection, feature detection, and text-to-image generation.
5. **Video AI Agent (OpenCV & VideoGen)**: Ingests video payloads, samples keyframes using OpenCV, extracts audio tracks, and generates structured summarizations.

---

## 2. What Have We Built So Far?

### 🎨 Design System & Styling Architecture
- **Centralized Design Tokens (`src/Const/display.js`)**: All project colors, gradients, font scales, border radii, heights, widths, shadows, and agent modality themes are centralized and imported everywhere.
- **Deep Slate & Radiant Linear Gradient Palette**: Configured a modern dark-mode aesthetic with ambient indigo, violet, and emerald glows across all pages.
- **Tailwind CSS v4 Integration**: Lightning-fast compilation through the `@tailwindcss/vite` plugin.

### 🧩 Reusable Atomic Components (`src/customComp/`)
- **`Sidebar.jsx`**: Collapsible/expandable navigation sidebar with smooth cubic-bezier transitions, "+ New Chat" creator, historical conversation drawer with live deletion, and Supervisor telemetry.
- **`Navbar.jsx`**: Glassmorphic header containing brand telemetry, dynamic breadcrumbs, live Supervisor status indicator, LangGraph/LangChain runtime badges, and new conversation shortcuts.
- **`Button.jsx`**: High-performance button supporting 9 themed agent variants, icon slots, and active loading spinners.
- **`Badge.jsx`**: Agent modality indicator tags with pulsing status dots.
- **`Input.jsx` & `Textarea.jsx`**: Accessible inputs with prefix icon slots and automated resize behavior.
- **`FileUpload.jsx`**: Drag-and-drop file upload zone configured for audio, image, and video MIME types.
- **`Card.jsx`**: Glassmorphic backdrop cards with slots for header, body, and footer actions.
- **`Footer.jsx`**: Telemetry and framework credit bar pinned strictly to the end of scrollable pages.

### 🖥️ Master Screens (`src/Screen/Main/`)
- **`homepage.jsx` (Home Command Center)**:
  - 100% full-width immersive layout.
  - Omnichannel Dispatch Bar with real-time Speech-to-Text microphone recording, modality selector tabs, and file drag-and-drop.
  - Interactive Specialized Modality Cards (Text, Audio, Image, Video) with single-click agent chat launch.
  - LangGraph Supervisor workflow node visualizer.
- **`ChatScreen.jsx` (Omnimodal Conversation Hub)**:
  - Full-screen conversational UI with distraction-free layout (Navbar and Footer removed).
  - Centered half-width elevated glassmorphic text input field.
  - Real-time Speech-to-Text conversion via the Web Speech API directly next to the Send button.
  - Supervisor Decision Insight cards rendering the routing logic and agent justifications.
  - Starter prompt cards spanning 100% width on fresh chats.
- **Modality Specific Screens**:
  - `TextScreen.jsx`, `AudioScreen.jsx`, `ImageScreen.jsx`, and `VideoScreen.jsx` scaffolded for dedicated agent studios.

### 💾 State Management & Real-Time Utilities
- **`chatStore.js` (Zustand + LocalStorage Persistence)**: Manages chat histories, active conversation pointers, dynamic message logs, agent routing tags, and timestamps.
- **`useSpeechRecognition.js`**: Custom React hook wrapping the Web Speech API for real-time microphone dictation on both Home and Chat screens.

### ⚙️ Backend Foundation (`backend/`)
- Dedicated Python 3.12 virtual environment created.
- `requirements.txt` locked with all 121 enterprise dependencies including FastAPI, LangChain, LangGraph, Faster-Whisper, Edge-TTS, Diffusers, Transformers, OpenCV, Celery, Redis, and SQLAlchemy.

---

## 3. Directory & File Structure Reference

```
multimodal multi-agent/
├── README.md                      # Primary project overview and documentation
├── backend/                       # FastAPI + LangGraph Python server
│   ├── requirements.txt           # Python dependency specifications
│   ├── tests/                     # Unit and integration test suites
│   └── app/                       # Application source code
│       ├── agents/                # Agent definitions (Supervisor, Text, Audio, Image, Video)
│       ├── api/                   # FastAPI route controllers and endpoints
│       ├── core/                  # Global app config, logging, and security settings
│       ├── database/              # PostgreSQL models, connection pool, and migrations
│       ├── generated/             # Artifact storage for AI generated assets (images, audio)
│       ├── prompts/               # Prompt templates and system prompts for LLM agents
│       ├── schemas/               # Pydantic schemas for request/response validation
│       ├── services/              # External integrations (OpenAI, HuggingFace, Whisper)
│       ├── tools/                 # Domain tools invoked by LangChain / LangGraph agents
│       ├── uploads/               # Temporary storage for ingested audio, images, videos
│       ├── workers/               # Celery background queue workers for heavy inference
│       └── workflows/             # LangGraph state machine, graph compilation, routing
│
└── frontend/                      # React 19 + Vite Frontend Application
    ├── package.json               # Node.js dependencies and run scripts
    ├── vite.config.js             # Vite bundler configuration with Tailwind plugin
    ├── public/                    # Static public assets (icons, SVGs, favicon)
    └── src/
        ├── App.jsx                # Root React component mounting the Navigation router
        ├── App.css                # Root level resets
        ├── index.css              # Global Tailwind CSS directives and custom scrollbars
        ├── main.jsx               # Application entry point rendering into DOM
        │
        ├── Api/                   # Client-side API connectors
        │   ├── Api.js             # Axios / Fetch client for FastAPI communication
        │   └── Index.js           # Barrel export for API endpoints
        │
        ├── Const/                 # Design System & Application Constants
        │   └── display.js         # Single source of truth for colors, fonts, radii, heights
        │
        ├── customComp/            # Reusable UI component library
        │   ├── Badge.jsx          # Status and agent modality tags
        │   ├── Button.jsx         # Themed buttons with loading and icon states
        │   ├── Card.jsx           # Glassmorphic elevated container
        │   ├── FileUpload.jsx     # Multimodal drag-and-drop dropzone
        │   ├── Footer.jsx         # Bottom system telemetry bar
        │   ├── Input.jsx          # Text inputs with icon slots
        │   ├── Navbar.jsx         # Top navigation header with Supervisor telemetry
        │   ├── Sidebar.jsx        # Animated collapsible navigation sidebar with chat history
        │   ├── Textarea.jsx       # Auto-resizing input textarea
        │   └── index.js           # Clean barrel exports for all custom components
        │
        ├── Routes/                # Routing and Application Shell
        │   └── Navigation.jsx     # Layout router controlling Navbar/Footer conditional displays
        │
        ├── Screen/                # Application Page Views
        │   ├── Auth/              # Authentication screens (Login, Signup)
        │   └── Main/              # Core product workflows
        │       ├── homepage.jsx   # Master dashboard & omnichannel dispatch hub
        │       ├── ChatScreen.jsx # Full-screen conversational AI workspace
        │       ├── TextScreen.jsx # Specialized Text AI studio
        │       ├── AudioScreen.jsx# Specialized Audio / Transcription studio
        │       ├── ImageScreen.jsx# Specialized Vision & Generation studio
        │       └── VideoScreen.jsx# Specialized Video analysis studio
        │
        ├── store/                 # Client State Management
        │   └── chatStore.js       # Zustand persistent store for active chats & message logs
        │
        ├── Style/                 # Page-specific stylesheets
        │   └── Home.css           # Radiant glow effects, animations, and pipeline styles
        │
        └── utils/                 # Browser API Wrappers & Custom Hooks
            └── useSpeechRecognition.js # Speech-to-Text hook using Web Speech API
```

---

## 4. Summary of Every Folder & File

### Root Directory
- **`README.md`**: Master documentation of project architecture, folder definitions, and milestones.
- **`backend/`**: Hosts the Python FastAPI server, LangChain agents, LangGraph workflows, and model pipelines.
- **`frontend/`**: Hosts the React Vite frontend application with Tailwind CSS and the complete design system.

---

### Backend Files (`backend/app/`)
| Folder / File | Purpose |
|---|---|
| **`app/agents/`** | Contains code for the 5 agents: Supervisor Agent, Text Agent, Audio Agent, Image Agent, and Video Agent. |
| **`app/api/`** | Houses FastAPI REST routes for dispatching chats, processing files, and streaming LLM responses. |
| **`app/core/`** | Stores project configuration (`config.py`), environment variables, and CORS definitions. |
| **`app/database/`** | Stores PostgreSQL database connections, SQLAlchemy tables, and chat history repositories. |
| **`app/generated/`** | Local cache folder for assets generated by AI (synthesized Edge-TTS audio, diffusers images). |
| **`app/prompts/`** | Prompt templates that guide LLM reasoning and agent tool selection. |
| **`app/schemas/`** | Pydantic data schemas validating incoming chat requests and outgoing model payloads. |
| **`app/services/`** | Wrappers for third-party SDKs and local models (Faster-Whisper, Edge-TTS, OpenCV, HuggingFace). |
| **`app/tools/`** | Functions that agents can call (e.g. video frame extractor, audio separator). |
| **`app/uploads/`** | Temporary directory where user-uploaded files are staged for agent inspection. |
| **`app/workers/`** | Celery worker tasks for executing long-running asynchronous video/audio processing. |
| **`app/workflows/`** | LangGraph compiled state graphs defining conditional routing logic between agents. |

---

### Frontend Files (`frontend/src/`)
| Folder / File | Purpose |
|---|---|
| **`Const/display.js`** | **Central Design System**: Holds all color codes, font sizes, border radii, heights, widths, and modality themes. |
| **`customComp/`** | **Component Library**: Independent, reusable building blocks (`Button`, `Badge`, `Navbar`, `Sidebar`, `FileUpload`, `Card`, `Footer`). |
| **`customComp/Sidebar.jsx`** | Left navigation bar featuring minimize/maximize controls, "+ New Chat", and previous chat history. |
| **`customComp/Navbar.jsx`** | Header housing runtime telemetry (`Supervisor Online`, `LangGraph: Active`), quick navigation, and new chat triggers. |
| **`customComp/Footer.jsx`** | Footer showing framework versions, displayed only when scrolled to the end of the homepage. |
| **`Routes/Navigation.jsx`** | React Router shell that manages layouts, hiding the Navbar and Footer on the `/chat` route. |
| **`Screen/Main/homepage.jsx`** | Main dashboard with the multimodal dispatch hub, microphone recording, agent cards, and workflow visualization. |
| **`Screen/Main/ChatScreen.jsx`**| Omnichannel conversational view with a centered half-width input bar, Speech-to-Text button, and supervisor routing insights. |
| **`store/chatStore.js`** | Zustand store with local storage persistence to retain conversations, titles, and agent messages. |
| **`Style/Home.css`** | Dedicated styles for multi-layered radial ambient glows, card hover effects, and dispatch bar focus shadows. |
| **`utils/useSpeechRecognition.js`** | React hook integrating browser Speech-to-Text to translate microphone voice input into text live. |
| **`Api/Api.js` & `Api/Index.js`** | Ready-to-connect API service layer for communicating with the backend FastAPI endpoints. |

---

## 5. Development Roadmap & Next Steps

1. **Frontend Polish** *(Completed)*:
   - Full 100% wide responsive home screen with radiant glow background.
   - Smooth collapsible/expandable sidebar with persistent chat drawer.
   - Omnichannel chat screen with centered half-width input and Speech-to-Text.
   - Telemetry moved to Navbar, Footer pinned to home page bottom.
2. **Backend Phase 1 (Core FastAPI)**:
   - Create `backend/app/main.py`, setup CORS, health checks, and config loaders.
3. **Backend Phase 2 (LangGraph Multi-Agent Workflows)**:
   - Implement `workflows/state.py` and `workflows/graph.py` with the Supervisor routing node.
4. **Backend Phase 3 (Modality Pipelines)**:
   - Wire Whisper audio transcription, OpenCV video sampling, and vision models.
5. **Full Integration**:
   - Connect frontend `Api.js` to backend FastAPI streaming endpoints.

