import React, { useState } from 'react'
import { colors, fontSize, radius, modalityThemes } from '../../Const/display'
import { Button, Badge, Card, FileUpload, Textarea, Input } from '../../customComp'
import { FiImage, FiEye, FiDownload, FiMaximize2, FiStar, FiZap, FiAlertCircle, FiCheck } from 'react-icons/fi'
import { generateImage } from '../../Api/Api'

export const ImageScreen = () => {
  const [activeTab, setActiveTab] = useState('generate') // Default to generation tab
  const [imageFile, setImageFile] = useState(null)
  const [visionPrompt, setVisionPrompt] = useState('')
  const [visionAnalysis, setVisionAnalysis] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Generation state
  const [genPrompt, setGenPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImg, setGeneratedImg] = useState(null)
  const [generationMeta, setGenerationMeta] = useState(null)
  const [genError, setGenError] = useState(null)

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

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!genPrompt.trim()) return
    setIsGenerating(true)
    setGenError(null)

    try {
      const data = await generateImage(genPrompt.trim())
      setGeneratedImg(data.full_image_url)
      setGenerationMeta({
        filename: data.filename,
        sizeBytes: data.size_bytes,
        originalPrompt: data.original_prompt,
      })
    } catch (err) {
      console.error('Image generation error:', err)
      setGenError(err.message || 'Image generation failed.')
    } finally {
      setIsGenerating(false)
    }
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
              Powered by NVIDIA FLUX 3 Image Klein • Fast High-Resolution Generation
            </p>
          </div>
        </div>
        <Badge variant="image">NVIDIA FLUX 3 Live</Badge>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-white/10 pb-4">
        <Button
          variant={activeTab === 'generate' ? 'image' : 'ghost'}
          onClick={() => setActiveTab('generate')}
          icon={FiZap}
        >
          Image Generation (NVIDIA FLUX 3)
        </Button>
        <Button
          variant={activeTab === 'vision' ? 'image' : 'ghost'}
          onClick={() => setActiveTab('vision')}
          icon={FiEye}
        >
          Image Understanding (Vision)
        </Button>
      </div>

      {/* Generation Mode */}
      {activeTab === 'generate' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <Card header={<span className="font-semibold text-white">NVIDIA FLUX 3 Generation Studio</span>}>
            <form onSubmit={handleGenerate} className="flex flex-col gap-4">
              <Textarea
                label="Prompt"
                placeholder="A high-tech quantum computing core glowing neon blue in an empty server room..."
                value={genPrompt}
                onChange={(e) => setGenPrompt(e.target.value)}
                rows={4}
              />

              {/* Sample Prompt Chips */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-gray-400">Try sample prompt:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'A sleek cybernetic sports car in Tokyo rain, neon reflections',
                    'A ceramic coffee mug on a wooden desk next to a notebook',
                    'A majestic castle perched on a floating island among clouds',
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setGenPrompt(p)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-left transition-colors cursor-pointer"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {genError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-xs text-red-300">
                  <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{genError}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="image"
                size="md"
                disabled={!genPrompt.trim()}
                isLoading={isGenerating}
                fullWidth
              >
                {isGenerating ? 'Generating with FLUX 3...' : 'Generate Image'}
              </Button>
            </form>
          </Card>

          <Card header={<span className="font-semibold text-white">Generated Output</span>}>
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-3 py-10">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center animate-spin">
                    <FiImage className="w-5 h-5 text-indigo-400" />
                  </div>
                  <p className="text-xs font-medium text-white">NVIDIA FLUX 3 is rendering your image...</p>
                  <p className="text-[11px] text-gray-400">Diffusion calculation in progress (~10-15s)</p>
                </div>
              ) : generatedImg ? (
                <div className="flex flex-col items-center gap-3 w-full">
                  <div className="relative group w-full overflow-hidden rounded-xl border border-white/10 shadow-xl">
                    <img
                      src={generatedImg}
                      alt="Generated output"
                      className="w-full max-h-80 object-cover rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>

                  {generationMeta && (
                    <div className="w-full p-2.5 rounded-lg bg-white/5 border border-white/5 text-[11px] text-gray-400 flex justify-between items-center">
                      <span className="font-mono truncate">{generationMeta.filename}</span>
                      <span className="font-mono text-emerald-400 font-semibold shrink-0">
                        {(generationMeta.sizeBytes / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 w-full">
                    <a
                      href={generatedImg}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs text-white font-medium transition-colors cursor-pointer"
                    >
                      <FiMaximize2 className="w-3.5 h-3.5" />
                      View Full Size
                    </a>
                    <a
                      href={generatedImg}
                      download={generationMeta?.filename || 'generated.jpg'}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-medium transition-colors cursor-pointer"
                    >
                      <FiDownload className="w-3.5 h-3.5" />
                      Download
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-sm py-12">
                  <FiStar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <span>Enter a prompt on the left and click "Generate Image"</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      ) : (
        /* Vision Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
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
                <div className="flex flex-col items-center justify-center flex-1 text-gray-500 text-sm py-10">
                  <FiEye className="w-8 h-8 mb-2 opacity-40" />
                  <span>Upload an image and run analysis to inspect details</span>
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
