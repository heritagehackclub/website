import type { CSSProperties } from "react";
import Image from "next/image";
import { HackIcon } from "@/components/ui/hack-icon";
import type { PortfolioProject } from "@/lib/fixtures/portfolio";

export function ProjectVisual({
  project,
  compact = false,
}: {
  project: PortfolioProject;
  compact?: boolean;
}) {
  return (
    <div
      className="portfolio-project-visual"
      data-variant={project.visual}
      data-compact={compact}
      style={{ "--project-accent": project.accent } as CSSProperties}
      aria-hidden="true"
    >
      {project.image ? (
        <>
          <Image
            className="project-sample-photo"
            src={project.image}
            alt=""
            fill
            sizes={compact ? "(max-width: 760px) 100vw, 33vw" : "50vw"}
          />
          <span className="project-sample-media-label">
            Temporary sample media
          </span>
        </>
      ) : (
        <span className="visual-grid" />
      )}
      {!project.image && project.visual === "map" ? (
        <>
          <span className="map-route map-route--one" />
          <span className="map-route map-route--two" />
          <span className="map-pin map-pin--one" />
          <span className="map-pin map-pin--two" />
          <span className="map-card">
            <strong>Library → Gym</strong>
            <i />
            <i />
          </span>
        </>
      ) : null}
      {!project.image && project.visual === "bot" ? (
        <span className="bot-window">
          <span className="bot-window-bar" />
          <strong>What can you study today?</strong>
          <i>45 minutes</i>
          <i>Biology first</i>
          <b>Build my plan</b>
        </span>
      ) : null}
      {!project.image && project.visual === "film" ? (
        <>
          <span className="film-frame film-frame--one">
            <HackIcon name="play-circle" size={38} />
          </span>
          <span className="film-frame film-frame--two" />
          <span className="film-timecode">00:01:42:08</span>
        </>
      ) : null}
    </div>
  );
}
