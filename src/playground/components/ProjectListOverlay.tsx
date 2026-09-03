import type { PointerEvent as ReactPointerEvent } from 'react'
import { playgroundConfig } from '../data/config'
import type { PlaygroundProject } from '../data/projects'
import './ProjectListOverlay.css'

type ProjectListOverlayProps = {
  projects: PlaygroundProject[]
  open: boolean
  onClose: () => void
  onSelect: (id: string) => void
}

function stopDrag(event: ReactPointerEvent) {
  event.stopPropagation()
}

export function ProjectListOverlay({
  projects,
  open,
  onClose,
  onSelect,
}: ProjectListOverlayProps) {
  if (!open) return null

  const linkTarget = playgroundConfig.openLinksInNewTab ? '_blank' : undefined
  const linkRel = playgroundConfig.openLinksInNewTab ? 'noopener noreferrer' : undefined

  return (
    <div
      className="project-list-overlay"
      onPointerDown={stopDrag}
      onPointerMove={stopDrag}
      onPointerUp={stopDrag}
      role="dialog"
      aria-modal="true"
      aria-label="Playground projects"
    >
      <div className="project-list-overlay__panel">
        <header className="project-list-overlay__header">
          <div>
            <p className="project-list-overlay__eyebrow">Index</p>
            <h2 className="project-list-overlay__title">All projects</h2>
          </div>
          <button
            type="button"
            className="project-list-overlay__close"
            onClick={onClose}
            aria-label="Close project list"
          >
            Close
          </button>
        </header>

        <div className="project-list-overlay__table" role="table">
          <div className="project-list-overlay__row is-head" role="row">
            <span role="columnheader">Project</span>
            <span role="columnheader">Skill</span>
            <span role="columnheader">Tool</span>
            <span role="columnheader" className="project-list-overlay__actions-head">
              Actions
            </span>
          </div>

          {projects.map((project) => (
            <div className="project-list-overlay__row" role="row" key={project.id}>
              <div className="project-list-overlay__project" role="cell">
                <p className="project-list-overlay__name">{project.title}</p>
                <p className="project-list-overlay__desc">{project.description}</p>
              </div>
              <div className="project-list-overlay__skill" role="cell">
                <span>{project.skill}</span>
              </div>
              <div className="project-list-overlay__tool" role="cell">
                <span>{project.tool}</span>
              </div>
              <div className="project-list-overlay__actions" role="cell">
                <button
                  type="button"
                  className="project-list-overlay__action"
                  onClick={() => onSelect(project.id)}
                >
                  Locate
                </button>
                <a
                  className="project-list-overlay__action is-primary"
                  href={project.href}
                  target={linkTarget}
                  rel={linkRel}
                >
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
