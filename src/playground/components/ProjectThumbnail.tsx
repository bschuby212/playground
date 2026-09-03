import {
  memo,
  useCallback,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react'
import { playgroundConfig } from '../data/config'
import type { PlaygroundProject } from '../data/projects'
import './ProjectThumbnail.css'

type ProjectThumbnailProps = {
  project: PlaygroundProject
  isActive: boolean
  reducedMotion: boolean
  onActivate: (id: string | null) => void
  shouldSuppressClick: () => boolean
  registerNode: (id: string, node: HTMLAnchorElement | null) => void
}

function ProjectThumbnailComponent({
  project,
  isActive,
  reducedMotion,
  onActivate,
  shouldSuppressClick,
  registerNode,
}: ProjectThumbnailProps) {
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
    onActivate(project.id)
  }, [onActivate, project.id])

  const handleLeave = useCallback(() => {
    onActivate(null)
  }, [onActivate])

  const handleFocus = useCallback(
    (_event: FocusEvent<HTMLAnchorElement>) => {
      onActivate(project.id)
    },
    [onActivate, project.id],
  )

  const handleBlur = useCallback(
    (_event: FocusEvent<HTMLAnchorElement>) => {
      onActivate(null)
    },
    [onActivate],
  )

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (shouldSuppressClick()) {
        event.preventDefault()
        event.stopPropagation()
      }
    },
    [shouldSuppressClick],
  )

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLAnchorElement>) => {
      if (event.pointerType === 'touch') {
        onActivate(project.id)
      }
    },
    [onActivate, project.id],
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
      onPointerDown={handlePointerDown}
      aria-label={project.title}
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
