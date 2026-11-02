import React, { useState } from 'react'
import { colors, fontSize, radius, modalityThemes } from '../../Const/display'
import { Button, Badge, Card, FileUpload, Textarea, Input } from '../../customComp'
import { FiVideo, FiFilm, FiDownload, FiPlayCircle, FiSliders } from 'react-icons/fi'

export const VideoScreen = () => {
  const [activeTab, setActiveTab] = useState('analyze') // 'analyze' | 'generate'
  const [videoFile, setVideoFile] = useState(null)
  const [frameInterval, setFrameInterval] = useState('1.0')
  const [analysisOutput, setAnalysisOutput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Video Generation
  const [videoPrompt, setVideoPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState(null)

  const handleProcessVideo = (e) => {
    e.preventDefault()
    if (!videoFile) return
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setAnalysisOutput(
        `[OpenCV & Multimodal Video Agent]:\n• Sampled 12 representative keyframes at ${frameInterval}s intervals.\n• Audio track separated for speech transcription.\n• Scene Summary: High-motion outdoor transition sequence with shifting dynamic lighting and active camera tracking.`
      )
    }, 1500)
  }

  const handleGenerateVideo = (e) => {
    e.preventDefault()
    if (!videoPrompt.trim()) return
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setGeneratedVideoUrl('mock-video.mp4')
    }, 1800)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            style={{
              backgroundColor: modalityThemes.video.bg,
              color: modalityThemes.video.color,
              border: `1px solid ${modalityThemes.video.border}`,
              borderRadius: radius.md,
            }}
            className="p-2.5"
          >
            <FiVideo className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h2 style={{ color: colors.textPrimary, fontSize: fontSize.h3 }} className="font-bold">
              Video AI Agent
            </h2>
            <p style={{ color: colors.textMuted, fontSize: fontSize.caption }}>
              OpenCV Keyframe Analysis & Hosted Video Generation
            </p>
          </div>
        </div>
        <Badge variant="video">OpenCV + VideoGen</Badge>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-white/10 pb-4">
        <Button
          variant={activeTab === 'analyze' ? 'video' : 'ghost'}
          onClick={() => setActiveTab('analyze')}
          icon={FiFilm}
        >
          Video Understanding & Summarization
        </Button>
        <Button
          variant={activeTab === 'generate' ? 'video' : 'ghost'}
          onClick={() => setActiveTab('generate')}
          icon={FiPlayCircle}
        >
          Video Generation (Text-to-Video)
        </Button>
      </div>

      {/* Video Analysis Mode */}
      {activeTab === 'analyze' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card header={<span className="font-semibold text-white">Video Upload & Sampling</span>}>
            <form onSubmit={handleProcessVideo} className="flex flex-col gap-4">
              <FileUpload
                modality="video"
                selectedFile={videoFile}
                onFileSelect={(file) => setVideoFile(file)}
                onClear={() => {
                  setVideoFile(null)
                  setAnalysisOutput('')
                }}
              />

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                  <FiSliders className="w-3.5 h-3.5 text-amber-400" />
                  Keyframe Extraction Rate (seconds per frame)
                </label>
                <select
                  value={frameInterval}
                  onChange={(e) => setFrameInterval(e.target.value)}
                  style={{
                    backgroundColor: colors.bgDark,
                    color: colors.textPrimary,
                    borderColor: colors.borderGlass,
                    borderRadius: radius.md,
                  }}
                  className="p-2.5 border text-sm outline-none"
                >
                  <option value="0.5">Every 0.5s (High density)</option>
                  <option value="1.0">Every 1.0s (Recommended)</option>
                  <option value="2.0">Every 2.0s (Fast preview)</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="video"
                size="md"
                disabled={!videoFile}
                isLoading={isProcessing}
                fullWidth
              >
                Analyze Video with OpenCV
              </Button>
            </form>
          </Card>

          <Card header={<span className="font-semibold text-white">Analysis & Frame Summary</span>}>
            <div className="flex flex-col gap-3 min-h-[240px] justify-between">
              {analysisOutput ? (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 text-sm text-gray-200 leading-relaxed text-left whitespace-pre-line font-mono">
                  {analysisOutput}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-gray-500 text-sm">
                  <FiFilm className="w-8 h-8 mb-2 opacity-40" />
                  <span>Upload a video to extract keyframes and generate summaries</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      ) : (
        /* Video Generation Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card header={<span className="font-semibold text-white">Video Generation Studio</span>}>
            <form onSubmit={handleGenerateVideo} className="flex flex-col gap-4">
              <Textarea
                label="Video Prompt"
                placeholder="Cinematic drone shot soaring over misty Nordic mountains during golden hour..."
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                rows={4}
              />
              <Button
                type="submit"
                variant="video"
                size="md"
                disabled={!videoPrompt.trim()}
                isLoading={isGenerating}
                fullWidth
              >
                Synthesize Video
              </Button>
            </form>
          </Card>

          <Card header={<span className="font-semibold text-white">Video Output Preview</span>}>
            <div className="flex flex-col items-center justify-center min-h-[240px] text-center">
              {generatedVideoUrl ? (
                <div className="flex flex-col items-center gap-3 w-full">
                  <div className="w-full h-44 bg-slate-900 rounded-xl flex items-center justify-center border border-white/10 text-amber-400">
                    <FiPlayCircle className="w-12 h-12" />
                  </div>
                  <Button variant="secondary" size="sm" icon={FiDownload}>
                    Download MP4
                  </Button>
                </div>
              ) : (
                <div className="text-gray-500 text-sm">
                  <FiVideo className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <span>Generated video preview will appear here</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default VideoScreen
