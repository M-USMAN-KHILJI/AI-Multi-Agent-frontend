/**
 * Global Design System Tokens & Display Constants
 * Multimodal Multi-Agent AI Application
 * 
 * Centralized source of truth for:
 * - Colors (Theme, Accents, Modalities, Statuses, Gradients)
 * - Typography (Font Sizes, Font Weights, Line Heights, Families)
 * - Dimensions & Radii (Border Radii, Heights, Widths, Spacing)
 * - Shadows, Transitions, and Modality Themes
 */

export const colors = {
  // Theme Backgrounds
  bgMain: '#0a0d14',
  bgDark: '#0e131f',
  bgCard: '#131926',
  bgCardHover: '#1c2436',
  bgCardElevated: '#1a2233',
  bgGlass: 'rgba(19, 25, 38, 0.75)',
  bgGlassLight: 'rgba(255, 255, 255, 0.03)',
  borderGlass: 'rgba(255, 255, 255, 0.08)',
  borderGlassHover: 'rgba(255, 255, 255, 0.16)',

  // Primary Accent
  primary: '#6366f1',
  primaryHover: '#4f46e5',
  primaryActive: '#4338ca',
  primaryLight: '#818cf8',
  primaryGlow: 'rgba(99, 102, 241, 0.35)',

  // Modality Agent Accents
  supervisor: '#10b981',       // Emerald - Orchestrator & Supervisor
  supervisorGlow: 'rgba(16, 185, 129, 0.35)',
  supervisorBg: 'rgba(16, 185, 129, 0.1)',
  supervisorBorder: 'rgba(16, 185, 129, 0.3)',

  textAgent: '#38bdf8',        // Sky Blue - Text & Chat & NLP
  textAgentGlow: 'rgba(56, 189, 248, 0.35)',
  textAgentBg: 'rgba(56, 189, 248, 0.1)',
  textAgentBorder: 'rgba(56, 189, 248, 0.3)',

  audioAgent: '#ec4899',       // Pink / Rose - Speech-to-Text & Text-to-Speech
  audioAgentGlow: 'rgba(236, 72, 153, 0.35)',
  audioAgentBg: 'rgba(236, 72, 153, 0.1)',
  audioAgentBorder: 'rgba(236, 72, 153, 0.3)',

  imageAgent: '#a855f7',       // Purple / Violet - Vision & Image Gen
  imageAgentGlow: 'rgba(168, 85, 247, 0.35)',
  imageAgentBg: 'rgba(168, 85, 247, 0.1)',
  imageAgentBorder: 'rgba(168, 85, 247, 0.3)',

  videoAgent: '#f59e0b',       // Amber / Gold - Video Analysis & Video Gen
  videoAgentGlow: 'rgba(245, 158, 11, 0.35)',
  videoAgentBg: 'rgba(245, 158, 11, 0.1)',
  videoAgentBorder: 'rgba(245, 158, 11, 0.3)',

  // Text Hierarchy
  textPrimary: '#f9fafb',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',
  textDisabled: '#4b5563',
  textWhite: '#ffffff',

  // Status & Feedback
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Borders
  borderLight: '#1f2937',
  borderDefault: '#283347',
  borderAccent: 'rgba(99, 102, 241, 0.4)',
}

export const gradients = {
  primary: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  primaryHover: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
  supervisor: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
  text: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
  audio: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
  image: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
  video: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  card: 'linear-gradient(180deg, rgba(26, 34, 51, 0.6) 0%, rgba(15, 21, 33, 0.8) 100%)',
  darkMesh: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 45%)',
  glowTop: 'linear-gradient(180deg, rgba(99, 102, 241, 0.15) 0%, transparent 100%)',
}

export const fontSize = {
  display: '3.5rem',    // 56px
  hero: '2.75rem',       // 44px
  h1: '2.25rem',         // 36px
  h2: '1.75rem',         // 28px
  h3: '1.35rem',         // 21.6px
  h4: '1.15rem',         // 18.4px
  bodyLg: '1.0625rem',   // 17px
  body: '0.9375rem',     // 15px
  bodySm: '0.875rem',    // 14px
  caption: '0.75rem',    // 12px
  tiny: '0.6875rem',     // 11px
}

export const fontWeight = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
}

export const lineHeight = {
  tight: '1.15',
  heading: '1.25',
  body: '1.6',
  loose: '1.75',
}

export const fontFamily = {
  sans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  heading: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
}

export const radius = {
  none: '0px',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  full: '9999px',
}

export const height = {
  navbar: '72px',
  footer: '52px',
  sidebarHeader: '72px',
  buttonSm: '34px',
  buttonMd: '42px',
  buttonLg: '50px',
  inputSm: '36px',
  inputMd: '44px',
  inputLg: '52px',
  badge: '24px',
  heroBanner: '320px',
  chatInputMax: '160px',
  waveform: '64px',
}

export const width = {
  sidebarExpanded: '270px',
  sidebarCollapsed: '78px',
  containerMax: '1440px',
  containerMd: '1100px',
  containerSm: '780px',
  modalSm: '420px',
  modalMd: '580px',
  modalLg: '860px',
}

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
}

export const shadows = {
  sm: '0 2px 8px rgba(0, 0, 0, 0.25)',
  card: '0 8px 24px -4px rgba(0, 0, 0, 0.45)',
  cardElevated: '0 16px 36px -6px rgba(0, 0, 0, 0.65)',
  glowPrimary: '0 0 25px rgba(99, 102, 241, 0.35)',
  glowSupervisor: '0 0 25px rgba(16, 185, 129, 0.35)',
  glowText: '0 0 25px rgba(56, 189, 248, 0.35)',
  glowAudio: '0 0 25px rgba(236, 72, 153, 0.35)',
  glowImage: '0 0 25px rgba(168, 85, 247, 0.35)',
  glowVideo: '0 0 25px rgba(245, 158, 11, 0.35)',
  innerGlow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
}

export const transitions = {
  fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  default: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
}

export const modalityThemes = {
  supervisor: {
    name: 'Supervisor Agent',
    color: colors.supervisor,
    glow: colors.supervisorGlow,
    bg: colors.supervisorBg,
    border: colors.supervisorBorder,
    gradient: gradients.supervisor,
    shadow: shadows.glowSupervisor,
  },
  text: {
    name: 'Text Agent',
    color: colors.textAgent,
    glow: colors.textAgentGlow,
    bg: colors.textAgentBg,
    border: colors.textAgentBorder,
    gradient: gradients.text,
    shadow: shadows.glowText,
  },
  audio: {
    name: 'Audio Agent',
    color: colors.audioAgent,
    glow: colors.audioAgentGlow,
    bg: colors.audioAgentBg,
    border: colors.audioAgentBorder,
    gradient: gradients.audio,
    shadow: shadows.glowAudio,
  },
  image: {
    name: 'Image Agent',
    color: colors.imageAgent,
    glow: colors.imageAgentGlow,
    bg: colors.imageAgentBg,
    border: colors.imageAgentBorder,
    gradient: gradients.image,
    shadow: shadows.glowImage,
  },
  video: {
    name: 'Video Agent',
    color: colors.videoAgent,
    glow: colors.videoAgentGlow,
    bg: colors.videoAgentBg,
    border: colors.videoAgentBorder,
    gradient: gradients.video,
    shadow: shadows.glowVideo,
  },
}

const display = {
  colors,
  gradients,
  fontSize,
  fontWeight,
  lineHeight,
  fontFamily,
  radius,
  height,
  width,
  spacing,
  shadows,
  transitions,
  modalityThemes,
}

export default display
