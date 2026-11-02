import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { colors, radius, fontSize, transitions } from '../Const/display'
import { FiUploadCloud, FiFile, FiX, FiCheckCircle } from 'react-icons/fi'

/**
 * Reusable Drag and Drop File Upload Component
 * Supports modalities: 'audio', 'image', 'video', 'all'
 */
export const FileUpload = ({
  modality = 'all', // 'audio' | 'image' | 'video' | 'all'
  selectedFile,
  onFileSelect,
  onClear,
  maxSizeMB = 50,
  className = '',
  disabled = false,
}) => {
  // Determine accepted file types based on modality
  const getAcceptedTypes = () => {
    switch (modality) {
      case 'audio':
        return {
          'audio/*': ['.mp3', '.wav', '.m4a', '.ogg', '.flac', '.aac'],
        }
      case 'image':
        return {
          'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'],
        }
      case 'video':
        return {
          'video/*': ['.mp4', '.mov', '.avi', '.webm', '.mkv'],
        }
      case 'all':
      default:
        return {
          'audio/*': ['.mp3', '.wav', '.m4a'],
          'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
          'video/*': ['.mp4', '.mov', '.webm'],
        }
    }
  }

  const getModalityLabel = () => {
    switch (modality) {
      case 'audio':
        return 'audio file (MP3, WAV, M4A)'
      case 'image':
        return 'image file (PNG, JPG, WebP)'
      case 'video':
        return 'video file (MP4, MOV, WebM)'
      default:
        return 'file (Audio, Image, or Video)'
    }
  }

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileSelect?.(acceptedFiles[0])
      }
    },
    [onFileSelect],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getAcceptedTypes(),
    maxFiles: 1,
    maxSize: maxSizeMB * 1024 * 1024,
    disabled,
  })

  return (
    <div className={`w-full ${className}`}>
      {selectedFile ? (
        // File Preview Card
        <div
          style={{
            backgroundColor: colors.bgDark,
            border: `1px solid ${colors.supervisor}`,
            borderRadius: radius.md,
            padding: '14px 18px',
          }}
          className="flex items-center justify-between gap-4 transition-all"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div
              style={{
                backgroundColor: colors.supervisorBg,
                color: colors.supervisor,
              }}
              className="p-2.5 rounded-lg shrink-0"
            >
              <FiCheckCircle className="w-5 h-5" />
            </div>
            <div className="overflow-hidden text-left">
              <p
                style={{
                  color: colors.textPrimary,
                  fontSize: fontSize.bodySm,
                }}
                className="font-medium truncate"
              >
                {selectedFile.name}
              </p>
              <p
                style={{
                  color: colors.textMuted,
                  fontSize: fontSize.caption,
                }}
              >
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for agent processing
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClear}
            style={{ color: colors.textMuted }}
            className="p-1.5 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
            title="Remove file"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      ) : (
        // Dropzone Area
        <div
          {...getRootProps()}
          style={{
            backgroundColor: isDragActive ? 'rgba(99, 102, 241, 0.08)' : colors.bgDark,
            border: `2px dashed ${isDragActive ? colors.primary : colors.borderGlass}`,
            borderRadius: radius.lg,
            transition: transitions.default,
            padding: '28px 20px',
          }}
          className="flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500/50 hover:bg-slate-900/50 group select-none"
        >
          <input {...getInputProps()} />
          <div
            style={{
              backgroundColor: isDragActive ? colors.primary : colors.bgCard,
              color: isDragActive ? '#fff' : colors.primaryLight,
            }}
            className="p-3.5 rounded-xl mb-3 group-hover:scale-110 transition-transform shadow-inner"
          >
            <FiUploadCloud className="w-6 h-6" />
          </div>

          <p
            style={{ color: colors.textPrimary, fontSize: fontSize.bodySm }}
            className="font-medium mb-1"
          >
            {isDragActive
              ? 'Drop your file here...'
              : `Click or drag & drop ${getModalityLabel()}`}
          </p>

          <p
            style={{ color: colors.textMuted, fontSize: fontSize.caption }}
          >
            Max file size: {maxSizeMB}MB
          </p>
        </div>
      )}
    </div>
  )
}

export default FileUpload
