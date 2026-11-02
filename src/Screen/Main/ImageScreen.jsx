import React, { useState } from 'react'
import { colors, fontSize, radius, modalityThemes } from '../../Const/display'
import { Button, Badge, Card, FileUpload, Textarea, Input } from '../../customComp'
import { FiImage, FiEye, FiDownload, FiMaximize2, FiStar } from 'react-icons/fi'

export const ImageScreen = () => {
  const [activeTab, setActiveTab] = useState('vision') // 'vision' | 'generate'
  const [imageFile, setImageFile] = useState(null)
  const [visionPrompt, setVisionPrompt] = useState('')
  const [visionAnalysis, setVisionAnalysis] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Generation state
  const [genPrompt, setGenPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImg, setGeneratedImg] = useState(null)

  const handleAnalyze = (e) => {
    e.preventDefault()
    if (!imageFile) return
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setVisionAnalysis(
        `[Vision Model Output]: The image features high-contrast visual elements analyzed by the multimodal agent. Detected objects, lighting conditions, and compositional structure align with the user prompt: "${visionPrompt || 'Describe contents'}"`
      )
    }, 1200)
  }

  const handleGenerate = (e) => {
    e.preventDefault()
    if (!genPrompt.trim()) return
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setGeneratedImg('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80')
    }, 1500)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            style={{
              backgroundColor: modalityThemes.image.bg,
              color: modalityThemes.image.color,
              border: `1px solid ${modalityThemes.image.border}`,
              borderRadius: radius.md,
            }}
            className="p-2.5"
          >
            <FiImage className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h2 style={{ color: colors.textPrimary, fontSize: fontSize.h3 }} className="font-bold">
              Image AI Agent
            </h2>
            <p style={{ color: colors.textMuted, fontSize: fontSize.caption }}>
              Multimodal Vision Understanding & AI Image Generation
            </p>
          </div>
        </div>
        <Badge variant="image">Vision + Diffusers</Badge>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-white/10 pb-4">
        <Button
          variant={activeTab === 'vision' ? 'image' : 'ghost'}
          onClick={() => setActiveTab('vision')}
          icon={FiEye}
        >
          Image Understanding (Vision)
        </Button>
        <Button
          variant={activeTab === 'generate' ? 'image' : 'ghost'}
          onClick={() => setActiveTab('generate')}
          icon={FiSparkles}
        >
          Image Generation (Text-to-Image)
        </Button>
      </div>

      {/* Vision Mode */}
      {activeTab === 'vision' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card header={<span className="font-semibold text-white">Upload & Prompt</span>}>
            <form onSubmit={handleAnalyze} className="flex flex-col gap-4">
              <FileUpload
                modality="image"
                selectedFile={imageFile}
                onFileSelect={(file) => setImageFile(file)}
                onClear={() => {
                  setImageFile(null)
                  setVisionAnalysis('')
                }}
              />
              <Input
                label="Question / Instruction about image"
                placeholder="What is happening in this image? Describe key features..."
                value={visionPrompt}
                onChange={(e) => setVisionPrompt(e.target.value)}
              />
              <Button
                type="submit"
                variant="image"
                size="md"
                disabled={!imageFile}
                isLoading={isAnalyzing}
                fullWidth
              >
                Analyze with Vision Agent
              </Button>
            </form>
          </Card>

          <Card header={<span className="font-semibold text-white">Visual Analysis Result</span>}>
            <div className="flex flex-col gap-3 min-h-[220px] justify-between">
              {visionAnalysis ? (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 text-sm text-gray-200 leading-relaxed text-left">
                  {visionAnalysis}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-gray-500 text-sm">
                  <FiEye className="w-8 h-8 mb-2 opacity-40" />
                  <span>Upload an image and run analysis to inspect details</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      ) : (
        /* Generation Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card header={<span className="font-semibold text-white">Image Generation Studio</span>}>
            <form onSubmit={handleGenerate} className="flex flex-col gap-4">
              <Textarea
                label="Prompt"
                placeholder="A futuristic cybernetic metropolis bathed in neon purple and cyan, cinematic lighting, 8k resolution..."
                value={genPrompt}
                onChange={(e) => setGenPrompt(e.target.value)}
                rows={4}
              />
              <Button
                type="submit"
                variant="image"
                size="md"
                disabled={!genPrompt.trim()}
                isLoading={isGenerating}
                fullWidth
              >
                Generate Image
              </Button>
            </form>
          </Card>

          <Card header={<span className="font-semibold text-white">Generated Output</span>}>
            <div className="flex flex-col items-center justify-center min-h-[260px] text-center">
              {generatedImg ? (
                <div className="flex flex-col items-center gap-3 w-full">
                  <img
                    src={generatedImg}
                    alt="Generated output"
                    className="w-full max-h-64 object-cover rounded-xl border border-white/10"
                  />
                  <Button variant="secondary" size="sm" icon={FiDownload}>
                    Download Image
                  </Button>
                </div>
              ) : (
                <div className="text-gray-500 text-sm">
                  <FiStar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <span>Generated image will be displayed here</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default ImageScreen
