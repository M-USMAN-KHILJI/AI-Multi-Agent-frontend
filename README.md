# OmniAgent AI — Multimodal Multi-Agent AI Platform

A unified, production-ready multimodal multi-agent artificial intelligence platform coordinating **4 specialized AI modalities (Text, Image, Video, and Audio)** under a centralized **Supervisor Agent** orchestrator powered by **LangGraph** and **LangChain**, backed by a high-performance **FastAPI** backend and a reactive **React 19 + Tailwind CSS** frontend.

---

## 🚀 Live System Architecture & Agent Flows

```
                          ┌─────────────────────────────┐
                          │    USER INPUT / DISPATCH    │
                          │   (Text / Audio / Media)    │
                          └──────────────┬──────────────┘
                                         │
                                         ▼
                          ┌─────────────────────────────┐
                          │   SUPERVISOR AGENT ROUTER   │
                          │     (LangGraph State)       │
                          └──────────────┬──────────────┘
                                         │
         ┌───────────────────────────────┼───────────────────────────────┐
         │                               │                               │
         ▼                               ▼                               ▼
┌──────────────────┐           ┌──────────────────┐           ┌──────────────────┐
│  TEXT AI AGENT   │           │  IMAGE AI AGENT  │           │  VIDEO AI AGENT  │
│    Groq Cloud    │           │  PaliGemma Vision│           │ Lightricks LTX   │
│ openai/gpt-oss   │           │    & FLUX 3      │           │ Video (704x512)  │
└──────────────────┘           └──────────────────┘           └──────────────────┘
         │                               │                               │
         └───────────────────────────────┼───────────────────────────────┘
                                         │
                                         ▼
                               ┌──────────────────┐
                               │  AUDIO AI AGENT  │
                               │ NVIDIA Resemble  │
                               │  Chatterbox TTS  │
                               └──────────────────┘
```

---

## 🧠 Modality Pipelines & AI Engine Breakdown

### 1. Text AI Agent
* **Engine:** Groq Cloud LPU
* **Model:** `openai/gpt-oss-120b` (Ultra-fast reasoning)
* **Framework:** LangChain Prompt Templates & Message History
* **Capabilities:** Multi-turn conversations, natural language problem-solving, structured JSON generation, and supervisor routing.

### 2. Image AI Agent
* **Visual Understanding / VQA:** Google PaliGemma (`google/paligemma` via NVIDIA NIM VLM) — sub-2s visual reasoning, object identification, and scene description.
* **Image Generation:** NVIDIA FLUX 3 Image Klein (`black-forest-labs/flux-3-image-klein`) — photorealistic high-fidelity 1024×1024 diffusion synthesis.
* **Image Editing Pipeline:** Upload an image + prompt → PaliGemma extracts composition & context → FLUX 3 renders the edited iteration preserving visual consistency.
* **Orchestration:** LangGraph state machine with conditional routing between inspection and generation nodes.

### 3. Video AI Agent
* **Engine:** Lightricks LTX-Video-0.9.1 (`Lightricks/ltx-video-distilled`)
* **Resolution:** 704×512 cinematic DiT diffusion video clips (2.0 seconds)
* **Generation Speed:** ~5.7 seconds
* **UI Features:** Live HTML5 video player in chat & studio, one-click MP4 download, and sample cinematic prompt chips.

### 4. Audio AI Agent (Speech & Voice)
* **Text-to-Speech (TTS):** NVIDIA Resemble.AI Chatterbox Multilingual TTS (`ddacc747-1269-4fab-bfd9-8f593dead106`)
* **Audio Format:** Browser-compliant 16-bit 22.05 kHz RIFF/WAVE container
* **Features:** 
  * MD5 audio caching for instantaneous (0ms) replay.
  * In-chat `<FiVolume2 /> Listen` speaker buttons under every AI response.
  * Automatic Markdown stripping for natural speech pronunciation.
* **Speech-to-Text (STT):** Web Speech API microphone dictation hook for hands-free prompt input.

---

## 🛠️ API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/chat/text` | Multi-turn conversational chat via Groq `gpt-oss-120b` |
| `POST` | `/api/v1/images/generate` | Text-to-Image generation via NVIDIA FLUX 3 Klein |
| `POST` | `/api/v1/images/analyze` | Visual Q&A & image analysis via Google PaliGemma |
| `POST` | `/api/v1/images/edit` | Multimodal image modification via Vision + FLUX 3 |
| `POST` | `/api/v1/videos/generate` | Text-to-Video generation via Lightricks LTX-Video |
| `POST` | `/api/v1/audio/tts` | Text-to-Speech synthesis via NVIDIA Chatterbox TTS |
| `GET` | `/api/v1/health` | Comprehensive health telemetry for all agents |

---

## 💻 Quick Start & Running Locally

### 1. Backend Setup (FastAPI + LangGraph)
```powershell
cd "c:\Users\16gb\Desktop\multimodal multi-agent\AI-Multi-Agent-Backend"
.\.venv\Scripts\Activate
uvicorn app.main:app --reload --reload-dir app
```
* Backend API Documentation: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup (React 19 + Vite)
```powershell
cd "c:\Users\16gb\Desktop\multimodal multi-agent\AI-Multi-Agent-frontend"
npm install
npm run dev
```
* Web Application: `http://localhost:5173`

---

## 🧪 Unit Testing

Run automated modality tests from the backend directory:
```powershell
# Text AI Agent Test
python tests/test_text_agent.py

# Image AI Agent Test (FLUX 3 & PaliGemma)
python tests/test_image_agent.py

# Video AI Agent Test (LTX-Video)
python tests/test_video_agent.py

# Audio AI Agent Test (NVIDIA Chatterbox TTS)
python tests/test_audio_agent.py
```
