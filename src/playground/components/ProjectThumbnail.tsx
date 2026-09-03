import {
  memo,
  useCallback,
  useRef,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
} from 'react'
import { playgroundConfig, type LayoutMode } from '../data/config'
import type { PlaygroundProject } from '../data/projects'
import './ProjectThumbnail.css'

type ProjectThumbnailProps = {
  project: PlaygroundProject
  isActive: boolean
  reducedMotion: boolean
  layoutMode: LayoutMode
  touchMode: boolean
  onActivate: (id: string | null) => void
  shouldSuppressClick: () => boolean
  registerNode: (id: string, node: HTMLAnchorElement | null) => void
}

function ProjectThumbnailComponent({
  project,
  isActive,
  reducedMotion,
  layoutMode,
  touchMode,
  onActivate,
  shouldSuppressClick,
  registerNode,
}: ProjectThumbnailProps) {
  const lastTapRef = useRef<{ id: string; time: number } | null>(null)

  const style = {
    '--thumb-x': `${project.x}px`,
    '--thumb-y': `${project.y}px`,
    '--thumb-w': `${project.width}px`,
    '--thumb-h': `${project.height}px`,
    '--thumb-scale': '1',
  } as CSSProperties

  const setRef = useCallback(
    (node: HTMLAnchorElement | null) => {
      registerNode(project.id, node)
    },
    [project.id, registerNode],
  )

  const handleEnter = useCallback(() => {
    if (touchMode) return
    onActivate(project.id)
  }, [onActivate, project.id, touchMode])

  const handleLeave = useCallback(() => {
    if (touchMode) return
    onActivate(null)
  }, [onActivate, touchMode])

  const handleFocus = useCallback(
    (_event: FocusEvent<HTMLAnchorElement>) => {
      onActivate(project.id)
    },
    [onActivate, project.id],
  )

  const handleBlur = useCallback(
    (_event: FocusEvent<HTMLAnchorElement>) => {
      if (touchMode) return
      onActivate(null)
    },
    [onActivate, touchMode],
  )

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (shouldSuppressClick()) {
        event.preventDefault()
        event.stopPropagation()
        return
      }

      if (!touchMode) return

      const now = performance.now()
      const last = lastTapRef.current
      const isDoubleTap =
        last !== null &&
        last.id === project.id &&
        now - last.time <= playgroundConfig.doubleTapMs

      if (isDoubleTap) {
        // Second tap opens the project URL (placeholder # for now)
        lastTapRef.current = null
        return
      }

      event.preventDefault()
      event.stopPropagation()
      onActivate(project.id)
      lastTapRef.current = { id: project.id, time: now }
    },
    [onActivate, project.id, shouldSuppressClick, touchMode],
  )

  const linkTarget = playgroundConfig.openLinksInNewTab ? '_blank' : undefined
  const linkRel = playgroundConfig.openLinksInNewTab ? 'noopener noreferrer' : undefined
  const initiallyDistant = project.x > 1400 || project.y > 1100

  return (
    <a
      ref={setRef}
      className={[
        'project-thumbnail',
        isActive ? 'is-active' : '',
        reducedMotion ? 'is-reduced-motion' : '',
        `is-layout-${layoutMode}`,
      ]
        .filter(Boolean)
        .join(' ')}
      href={project.href}
      target={linkTarget}
      rel={linkRel}
      style={style}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      aria-label={project.title}
      data-project-id={project.id}
    >
      <img
        src={project.image}
        alt={project.alt}
        width={project.width}
        height={project.height}
        draggable={false}
        loading={initiallyDistant ? 'lazy' : 'eager'}
        decoding="async"
      />
    </a>
  )
}

export const ProjectThumbnail = memo(ProjectThumbnailComponent)
