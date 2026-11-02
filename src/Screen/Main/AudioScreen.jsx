import React, { useState } from 'react'
import { colors, fontSize, radius, modalityThemes } from '../../Const/display'
import { Button, Badge, Card, FileUpload, Textarea, Input } from '../../customComp'
import { FiMic, FiPlay, FiVolume2, FiFileText, FiCheck, FiDownload } from 'react-icons/fi'

export const AudioScreen = () => {
  const [activeTab, setActiveTab] = useState('stt') // 'stt' | 'tts'
  const [audioFile, setAudioFile] = useState(null)
  const [transcription, setTranscription] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)

  // TTS State
  const [ttsText, setTtsText] = useState('')
  const [ttsVoice, setTtsVoice] = useState('en-US-JennyNeural')
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState(null)

  const handleTranscribe = () => {
    if (!audioFile) return
    setIsTranscribing(true)
    setTimeout(() => {
      setIsTranscribing(false)
      setTranscription(
        `[Transcription Result via Whisper STT]: "The multi-agent architecture successfully routes user input across specialized modalities, maintaining workflow state in LangGraph."`
      )
    }, 1200)
  }

  const handleSynthesize = (e) => {
    e.preventDefault()
    if (!ttsText.trim()) return
    setIsSynthesizing(true)
    setTimeout(() => {
      setIsSynthesizing(false)
      setGeneratedAudioUrl('mock-audio.mp3')
    }, 1200)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col gap-6">
      {/* Screen Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            style={{
              backgroundColor: modalityThemes.audio.bg,
              color: modalityThemes.audio.color,
              border: `1px solid ${modalityThemes.audio.border}`,
              borderRadius: radius.md,
            }}
            className="p-2.5"
          >
            <FiMic className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h2 style={{ color: colors.textPrimary, fontSize: fontSize.h3 }} className="font-bold">
              Audio AI Agent
            </h2>
            <p style={{ color: colors.textMuted, fontSize: fontSize.caption }}>
              Speech-to-Text (Faster-Whisper) & Text-to-Speech (Edge-TTS)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="audio">Whisper + Edge-TTS</Badge>
        </div>
      </div>

      {/* Mode Switch Tabs */}
      <div className="flex gap-3 border-b border-white/10 pb-4">
        <Button
          variant={activeTab === 'stt' ? 'audio' : 'ghost'}
          onClick={() => setActiveTab('stt')}
          icon={FiFileText}
        >
          Speech-to-Text (Transcribe)
        </Button>
        <Button
          variant={activeTab === 'tts' ? 'audio' : 'ghost'}
          onClick={() => setActiveTab('tts')}
          icon={FiVolume2}
        >
          Text-to-Speech (Synthesize)
        </Button>
      </div>

      {/* Content Area */}
      {activeTab === 'stt' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card header={<span className="font-semibold text-white">Upload Audio</span>}>
            <div className="flex flex-col gap-4">
              <FileUpload
                modality="audio"
                selectedFile={audioFile}
                onFileSelect={(file) => setAudioFile(file)}
                onClear={() => {
                  setAudioFile(null)
                  setTranscription('')
                }}
              />
              <Button
                variant="audio"
                size="md"
                disabled={!audioFile}
                isLoading={isTranscribing}
                onClick={handleTranscribe}
                fullWidth
              >
                Transcribe with Whisper
              </Button>
            </div>
          </Card>

          <Card header={<span className="font-semibold text-white">Transcription Output</span>}>
            <div className="flex flex-col gap-3 min-h-[200px] justify-between">
              {transcription ? (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 text-sm text-gray-200 leading-relaxed text-left">
                  {transcription}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-gray-500 text-sm">
                  <FiMic className="w-8 h-8 mb-2 opacity-40" />
                  <span>Upload audio and click transcribe to view results</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card header={<span className="font-semibold text-white">Speech Synthesis Studio</span>}>
            <form onSubmit={handleSynthesize} className="flex flex-col gap-4">
              <Textarea
                label="Text to Convert to Speech"
                placeholder="Enter text here to generate natural audio..."
                value={ttsText}
                onChange={(e) => setTtsText(e.target.value)}
                rows={4}
              />

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs text-gray-400 font-medium">Select Voice Model</label>
                <select
                  value={ttsVoice}
                  onChange={(e) => setTtsVoice(e.target.value)}
                  style={{
                    backgroundColor: colors.bgDark,
                    color: colors.textPrimary,
                    borderColor: colors.borderGlass,
                    borderRadius: radius.md,
                  }}
                  className="p-2.5 border text-sm outline-none"
                >
                  <option value="en-US-JennyNeural">Jenny (en-US Natural Female)</option>
                  <option value="en-US-GuyNeural">Guy (en-US Natural Male)</option>
                  <option value="en-GB-SoniaNeural">Sonia (en-GB British Female)</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="audio"
                size="md"
                disabled={!ttsText.trim()}
                isLoading={isSynthesizing}
                fullWidth
              >
                Generate Speech Audio
              </Button>
            </form>
          </Card>

          <Card header={<span className="font-semibold text-white">Audio Player & Result</span>}>
            <div className="flex flex-col items-center justify-center min-h-[220px] text-center gap-4">
              {generatedAudioUrl ? (
                <div className="w-full flex flex-col gap-4 items-center">
                  <div className="w-16 h-16 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center">
                    <FiPlay className="w-8 h-8 ml-1" />
                  </div>
                  <span className="text-sm font-medium text-gray-200">
                    Audio Generated Successfully ({ttsVoice})
                  </span>
                  <div className="flex gap-3">
                    <Button variant="audio" size="sm" icon={FiPlay}>
                      Play Preview
                    </Button>
                    <Button variant="secondary" size="sm" icon={FiDownload}>
                      Download MP3
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-sm">
                  <FiVolume2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <span>Generated audio preview will appear here</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default AudioScreen
