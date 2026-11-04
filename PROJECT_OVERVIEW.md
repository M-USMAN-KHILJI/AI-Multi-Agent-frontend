# Multimodal Multi-Agent AI Platform — Project Overview

A production-grade, enterprise-ready full-stack application that coordinates **4 specialized AI modalities (Text, Audio, Image, and Video)** under a centralized **Supervisor Agent** orchestrator powered by **LangGraph** and **LangChain**, backed by **FastAPI** (Python) and a cutting-edge **React 19 + Tailwind CSS** frontend.

---

## 1. What Are We Building?

A unified intelligent multi-agent platform where a user can enter queries or upload assets across multiple formats (text, voice audio, pictures, or videos). The **Supervisor Agent** automatically analyzes user intent, decides the optimal domain agent, and coordinates stateful workflows:

1. **Supervisor Agent (Orchestrator)**: Evaluates user prompts and attached file types, executing conditional routing logic across the LangGraph workflow.
2. **Text AI Agent (Groq Cloud LPU)**: Handles fast reasoning and conversational streaming using `openai/gpt-oss-120b`.
3. **Image AI Agent (Google PaliGemma & NVIDIA FLUX 3 Klein)**:
   - Visual Understanding: Google PaliGemma VLM for fast visual inspection.
   - Image Synthesis: NVIDIA FLUX 3 Klein for photorealistic 1024×1024 generation.
   - Image Editing: Multi-step pipeline describing input images and synthesizing user-instructed edits.
4. **Video AI Agent (Lightricks LTX-Video-0.9.1)**:
   - Diffusion Transformer (DiT) text-to-video generating 704×512 cinematic clips in ~5.7s.
   - Video upload and OpenCV keyframe extraction.
5. **Audio AI Agent (NVIDIA Resemble.AI Chatterbox TTS & Speech-to-Text)**:
   - High-fidelity natural speech synthesis packaged into 22.05 kHz RIFF/WAVE containers.
   - MD5 audio content caching for 0ms instant replay on repeated clicks.
   - Web Speech API microphone dictation hook for hands-free speech input.

---

## 2. Implemented Architecture & Completed Milestones

### 🎨 Frontend Architecture (`AI-Multi-Agent-frontend/`)
- **Centralized Design Tokens (`src/Const/display.js`)**: Single source of truth for colors, agent modality themes, shadows, and radii.
- **`Sidebar.jsx`**: Collapsible/expandable navigation sidebar with chat history and new chat trigger.
- **`Navbar.jsx`**: Glassmorphic header with live Supervisor status indicators.
- **`ChatScreen.jsx`**:
   - Omnichannel chat with automatic supervisor routing based on user prompt and file attachment type.
   - Interactive speaker icon (`<FiVolume2 /> Listen`) under every AI reply to trigger NVIDIA Chatterbox TTS.
   - Inline image and video players with direct download capabilities.
- **Dedicated Studios**:
   - `ImageScreen.jsx`: 3 tabs (Generate, Analyze with PaliGemma, Edit Image with Vision + FLUX 3).
   - `VideoScreen.jsx`: 2 tabs (Text-to-Video with LTX-Video, OpenCV Video Sampling).

### ⚙️ Backend Architecture (`AI-Multi-Agent-Backend/`)
- **LangGraph Workflows (`app/workflows/`)**:
   - Stateful graphs routing between understanding and generation nodes with error-recovery edges.
- **Service Layer (`app/services/`)**:
   - `llm_service.py`: Groq Cloud client.
   - `image_service.py`: PaliGemma VLM & FLUX 3 diffusion client.
   - `video_service.py`: Lightricks LTX-Video via Gradio API client.
   - `audio_service.py`: NVIDIA Riva gRPC client for Chatterbox Multilingual TTS with RIFF/WAVE audio packaging.
- **REST API Endpoints (`app/api/`)**:
   - `/api/v1/chat/text`: Multi-turn conversational chat.
   - `/api/v1/images/generate`: Text-to-Image synthesis.
   - `/api/v1/images/analyze`: Image understanding & VQA.
   - `/api/v1/images/edit`: Image modification pipeline.
   - `/api/v1/videos/generate`: Text-to-Video generation.
   - `/api/v1/audio/tts`: Text-to-Speech synthesis.
   - `/api/v1/health`: System telemetry.

---

## 3. Directory & File Structure Reference

```
multimodal multi-agent/
├── AI-Multi-Agent-Backend/            # FastAPI + LangGraph Python server
│   ├── requirements.txt               # Locked Python dependencies (gradio-client, nvidia-riva-client, etc.)
│   ├── .env                           # Environment keys (Groq, NVIDIA, HuggingFace)
│   ├── tests/                         # Unit tests for Text, Image, Video, and Audio agents
│   └── app/                           # Application source code
│       ├── agents/                    # Agent orchestrators (Text, Image, Video)
│       ├── api/                       # FastAPI route routers (chat, images, videos, audio, health)
│       ├── core/                      # Global settings & configurations (config.py)
│       ├── generated/                 # Generated images, videos, and audio storage
│       ├── prompts/                   # System prompt templates
│       ├── schemas/                   # Pydantic request/response models
│       ├── services/                  # External service clients (Groq, NVIDIA, HF, Riva)
│       └── workflows/                 # LangGraph state machine definitions & compiled graphs
│
└── AI-Multi-Agent-frontend/           # React 19 + Vite Frontend Application
    ├── README.md                      # Complete system guide & setup instructions
    ├── PROJECT_OVERVIEW.md            # Comprehensive architecture documentation
    ├── package.json                   # Node.js dependencies
    └── src/
        ├── Api/Api.js                 # Unified Axios client with generateImage, analyzeImage, editImage, generateVideo, synthesizeSpeech
        ├── Const/display.js           # Design system tokens and modality themes
        ├── customComp/                # Reusable UI component library (Buttons, Badges, Cards, etc.)
        ├── Screen/Main/               # Master workflow screens (homepage, ChatScreen, ImageScreen, VideoScreen)
        └── store/chatStore.js         # Zustand persistent chat storage
```

---

## 4. Testing & Verification

All automated tests in `tests/` pass with 100% success:
- `test_text_agent.py` — Verifies multi-turn Groq LLM responses.
- `test_image_agent.py` — Verifies FLUX 3 generation and PaliGemma analysis.
- `test_video_agent.py` — Verifies LTX-Video synthesis (704×512 MP4).
- `test_audio_agent.py` — Verifies NVIDIA Chatterbox TTS and RIFF/WAVE header integrity.
