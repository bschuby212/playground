export type ToolId =
  | 'figma'
  | 'openai'
  | 'gemini'
  | 'cursor'
  | 'spline'
  | 'midjourney'

export type ToolMeta = {
  id: ToolId
  label: string
  icon: string
}

export const toolCatalog: Record<ToolId, ToolMeta> = {
  figma: {
    id: 'figma',
    label: 'Figma',
    icon: '/tools/figma.png',
  },
  openai: {
    id: 'openai',
    label: 'ChatGPT',
    icon: '/tools/openai.png',
  },
  gemini: {
    id: 'gemini',
    label: 'Gemini',
    icon: '/tools/gemini.png',
  },
  cursor: {
    id: 'cursor',
    label: 'Cursor',
    icon: '/tools/cursor.png',
  },
  spline: {
    id: 'spline',
    label: 'Spline',
    icon: '/tools/spline.png',
  },
  midjourney: {
    id: 'midjourney',
    label: 'Midjourney',
    icon: '/tools/midjourney.png',
  },
}

export function resolveTools(ids: ToolId[]): ToolMeta[] {
  return ids.map((id) => toolCatalog[id])
}
