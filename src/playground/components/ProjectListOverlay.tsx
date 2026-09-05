import type { PointerEvent as ReactPointerEvent } from 'react'
import { playgroundConfig } from '../data/config'
import type { PlaygroundProject } from '../data/projects'
import { resolveTools } from '../data/tools'
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

function SkillIcon({ skill }: { skill: string }) {
  const common = {
    width: 12,
    height: 12,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }

  switch (skill) {
    case 'Design systems':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    case 'Web':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a15 15 0 0 1 0 18" />
          <path d="M12 3a15 15 0 0 0 0 18" />
        </svg>
      )
    case 'Product UI':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 9v11" />
        </svg>
      )
    case 'Editorial':
      return (
        <svg {...common}>
          <path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2Z" />
          <path d="M8 7h8" />
          <path d="M8 11h8" />
          <path d="M8 15h5" />
        </svg>
      )
    case 'Illustration':
      return (
        <svg {...common}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      )
    case '3D':
      return (
        <svg {...common}>
          <path d="M12 3 4 7.5v9L12 21l8-4.5v-9Z" />
          <path d="M12 12 4 7.5" />
          <path d="M12 12v9" />
          <path d="m12 12 8-4.5" />
        </svg>
      )
    case 'Research':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      )
    case 'Motion':
      return (
        <svg {...common}>
          <path d="M5 5v14l12-7Z" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      )
  }
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

          {projects.map((project) => {
            const tools = resolveTools(project.tools)

            return (
              <div className="project-list-overlay__row" role="row" key={project.id}>
                <div className="project-list-overlay__project" role="cell">
                  <p className="project-list-overlay__name">{project.title}</p>
                  <p className="project-list-overlay__desc">{project.description}</p>
                </div>
                <div className="project-list-overlay__skill" role="cell">
                  <span className="project-list-overlay__chip project-list-overlay__chip--skill">
                    <span className="project-list-overlay__chip-icon" aria-hidden="true">
                      <SkillIcon skill={project.skill} />
                    </span>
                    {project.skill}
                  </span>
                </div>
                <div className="project-list-overlay__tool" role="cell">
                  <div className="project-list-overlay__tool-list">
                    {tools.map((tool) => (
                      <span
                        key={tool.id}
                        className="project-list-overlay__chip project-list-overlay__chip--tool"
                        title={tool.label}
                      >
                        <img
                          className="project-list-overlay__tool-icon"
                          src={tool.icon}
                          alt=""
                          width={14}
                          height={14}
                        />
                        <span className="project-list-overlay__tool-label">{tool.label}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="project-list-overlay__actions" role="cell">
                  <button
                    type="button"
                    className="project-list-overlay__button"
                    onClick={() => onSelect(project.id)}
                  >
                    Locate
                  </button>
                  <a
                    className="project-list-overlay__button project-list-overlay__button--primary"
                    href={project.href}
                    target={linkTarget}
                    rel={linkRel}
                  >
                    View
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
