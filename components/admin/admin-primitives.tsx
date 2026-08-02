"use client";

import type {
  ButtonHTMLAttributes,
  CSSProperties,
  DragEvent,
  ReactNode,
} from "react";
import { forwardRef } from "react";
import { HackIcon } from "@/components/ui/hack-icon";
import type {
  ProjectBlock,
  ProjectCredit,
  ProjectMedia,
} from "@/lib/fixtures/campus-compass";

export function AdminStatusIndicator({
  label,
  tone = "yellow",
}: {
  label: string;
  tone?: "yellow" | "green" | "red" | "blue";
}) {
  return (
    <span className="admin-status" data-tone={tone}>
      <span aria-hidden="true" />
      {label}
    </span>
  );
}

export function SaveState({
  state,
}: {
  state: "saved" | "unsaved" | "published";
}) {
  const content = {
    saved: ["Saved in this preview", "green"],
    unsaved: ["Unsaved changes", "yellow"],
    published: ["Prototype published", "blue"],
  } as const;
  const [label, tone] = content[state];

  return (
    <span className="save-state" data-tone={tone} aria-live="polite">
      <HackIcon name={state === "saved" ? "check-circle" : "edit"} size={15} />
      {label}
    </span>
  );
}

export function CompactMetadataRow({
  label,
  children,
  mono = false,
}: {
  label: string;
  children: ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="compact-metadata-row">
      <dt>{label}</dt>
      <dd data-mono={mono}>{children}</dd>
    </div>
  );
}

export function InspectorSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="inspector-section">
      <header>
        <h2>{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}

export function BlockGutter({
  index,
  dragButtonProps,
  dragRef,
  onInsert,
}: {
  index: number;
  dragButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  dragRef?: (node: HTMLButtonElement | null) => void;
  onInsert?: () => void;
}) {
  return (
    <div className="block-gutter" aria-label={`Section ${index + 1} controls`}>
      <button
        type="button"
        className="gutter-drag"
        aria-label={`Drag section ${index + 1}`}
        ref={dragRef}
        {...dragButtonProps}
      >
        <HackIcon name="move" size={17} />
      </button>
      {onInsert ? (
        <button
          type="button"
          className="gutter-insert"
          aria-label={`Insert section after ${index + 1}`}
          onClick={onInsert}
        >
          +
        </button>
      ) : null}
      <span>{String(index + 1).padStart(2, "0")}</span>
    </div>
  );
}

export function MediaMockup({ variant }: { variant: ProjectMedia["variant"] }) {
  return (
    <div className="media-mockup" data-variant={variant} aria-hidden="true">
      <div className="mock-browser-bar">
        <span />
        <span />
        <span />
        <b>campus compass</b>
      </div>
      <div className="mock-screen">
        <div className="mock-map-grid" />
        <span className="mock-route route-a" />
        <span className="mock-route route-b" />
        <span className="mock-pin pin-a" />
        <span className="mock-pin pin-b" />
        <span className="mock-pin pin-c" />
        <div className="mock-panel">
          <strong>
            {variant === "map"
              ? "Library → Gym"
              : variant === "route"
                ? "8 min walk"
                : "Saved places"}
          </strong>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

export function MediaTile({
  media,
  selected = false,
  onSelect,
  onMove,
  onMakeCover,
  dragHandlers,
}: {
  media: ProjectMedia;
  selected?: boolean;
  onSelect?: () => void;
  onMove?: (delta: number) => void;
  onMakeCover?: () => void;
  dragHandlers?: {
    draggable?: boolean;
    onDragStart?: () => void;
    onDragOver?: (event: DragEvent) => void;
    onDrop?: () => void;
  };
}) {
  return (
    <article
      className="admin-media-tile"
      data-selected={selected}
      {...dragHandlers}
    >
      <button
        type="button"
        className="media-select"
        onClick={onSelect}
        aria-label={`Edit ${media.label}`}
      >
        <MediaMockup variant={media.variant} />
      </button>
      <div className="media-tile-copy">
        <div>
          <strong>{media.label}</strong>
          <span>
            {media.dimensions} · {media.format}
          </span>
        </div>
        {media.cover ? (
          <span className="media-cover-label">Cover</span>
        ) : (
          <button type="button" onClick={onMakeCover}>
            Make cover
          </button>
        )}
      </div>
      <div className="media-order-controls" aria-label="Media order">
        <button
          type="button"
          onClick={() => onMove?.(-1)}
          aria-label="Move media left"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => onMove?.(1)}
          aria-label="Move media right"
        >
          →
        </button>
        <span title="Drag to reorder">
          <HackIcon name="move" size={15} />
        </span>
      </div>
    </article>
  );
}

export function ContributorCreditCard({
  credit,
  index,
  onOpen,
  onMove,
}: {
  credit: ProjectCredit;
  index: number;
  onOpen?: () => void;
  onMove?: (delta: number) => void;
}) {
  return (
    <article className="credit-card" data-linked={credit.linked}>
      <span className="credit-index">{String(index + 1).padStart(2, "0")}</span>
      <span className="credit-avatar">{credit.initials}</span>
      <div className="credit-main">
        <div className="credit-name-row">
          <strong>{credit.name}</strong>
          <span>
            {credit.linked ? "Linked profile" : "No profile attached"}
          </span>
        </div>
        <p className="credit-role">{credit.role}</p>
        <p>{credit.contribution}</p>
        {credit.linked ? (
          <button type="button" onClick={onOpen}>
            Profile peek <span aria-hidden="true">↗</span>
          </button>
        ) : (
          <div className="unlinked-credit-actions">
            <button type="button">Find profile</button>
            <span>or attach later</span>
          </div>
        )}
      </div>
      <div className="credit-order">
        <button
          type="button"
          onClick={() => onMove?.(-1)}
          aria-label={`Move ${credit.name} up`}
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => onMove?.(1)}
          aria-label={`Move ${credit.name} down`}
        >
          ↓
        </button>
      </div>
    </article>
  );
}

export function ProjectOutline({
  blocks,
  onSelect,
}: {
  blocks: ProjectBlock[];
  onSelect?: (block: ProjectBlock) => void;
}) {
  return (
    <ol className="project-outline">
      <li>
        <button
          type="button"
          onClick={() =>
            document.getElementById("project-cover")?.scrollIntoView()
          }
        >
          <span>00</span> Cover
        </button>
      </li>
      {blocks.map((block, index) => (
        <li key={block.id} data-hidden={!block.visible}>
          <button type="button" onClick={() => onSelect?.(block)}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {block.label}
          </button>
        </li>
      ))}
    </ol>
  );
}

export const WorkbenchButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(function WorkbenchButton({ className = "", children, ...props }, ref) {
  return (
    <button
      ref={ref}
      className={`workbench-button ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
});

export function SortableStyle({
  transform,
  transition,
  dragging,
}: {
  transform?: string;
  transition?: string;
  dragging?: boolean;
}): CSSProperties {
  return {
    transform,
    transition,
    opacity: dragging ? 0.62 : 1,
    position: "relative",
    zIndex: dragging ? 4 : undefined,
  };
}
