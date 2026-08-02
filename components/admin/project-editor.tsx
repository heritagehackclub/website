"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import {
  type ChangeEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AdminStatusIndicator,
  BlockGutter,
  CompactMetadataRow,
  ContributorCreditCard,
  InspectorSection,
  MediaMockup,
  MediaTile,
  ProjectOutline,
  SaveState,
  WorkbenchButton,
} from "@/components/admin/admin-primitives";
import { HackIcon } from "@/components/ui/hack-icon";
import {
  addBlockOptions,
  campusCompassFixture,
  type ProjectBlock,
  type ProjectCredit,
  type ProjectMedia,
} from "@/lib/fixtures/campus-compass";

type SaveStateValue = "saved" | "unsaved" | "published";

const searchCandidates: ProjectCredit[] = [];

function ModalDialog({
  className,
  labelledBy,
  onClose,
  children,
}: {
  className: string;
  labelledBy: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog?.open) dialog?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className={`admin-modal ${className}`}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      {children}
    </dialog>
  );
}

function SortableProjectBlock({
  block,
  index,
  total,
  onMove,
  onToggleCollapse,
  onToggleVisibility,
  onDuplicate,
  onDelete,
  onInsert,
  children,
}: {
  block: ProjectBlock;
  index: number;
  total: number;
  onMove: (delta: number) => void;
  onToggleCollapse: () => void;
  onToggleVisibility: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onInsert: () => void;
  children: ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  return (
    <section
      id={`block-${block.id}`}
      ref={setNodeRef}
      className="project-document-block"
      data-type={block.type}
      data-collapsed={block.collapsed}
      data-hidden={!block.visible}
      data-dragging={isDragging}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      aria-labelledby={`block-title-${block.id}`}
    >
      <BlockGutter
        index={index}
        onInsert={onInsert}
        dragRef={setActivatorNodeRef}
        dragButtonProps={{
          ...attributes,
          ...listeners,
        }}
      />
      <div className="document-block-main">
        <header className="document-block-toolbar">
          <div>
            <span className="block-type">{block.type}</span>
            <h2 id={`block-title-${block.id}`}>{block.label}</h2>
            {!block.visible ? (
              <span className="block-hidden-label">Hidden in preview</span>
            ) : null}
          </div>
          <div className="block-actions">
            <button
              type="button"
              onClick={() => onMove(-1)}
              disabled={index === 0}
              aria-label={`Move ${block.label} up`}
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => onMove(1)}
              disabled={index === total - 1}
              aria-label={`Move ${block.label} down`}
            >
              ↓
            </button>
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-expanded={!block.collapsed}
              aria-label={`${block.collapsed ? "Expand" : "Collapse"} ${block.label}`}
            >
              <HackIcon name="expand" size={16} />
            </button>
            <button
              type="button"
              onClick={onToggleVisibility}
              aria-pressed={block.visible}
            >
              {block.visible ? "Visible" : "Hidden"}
            </button>
            <button
              type="button"
              onClick={onDuplicate}
              aria-label={`Duplicate ${block.label}`}
            >
              <HackIcon name="copy" size={15} />
            </button>
            <button
              type="button"
              className="danger-action"
              onClick={onDelete}
              aria-label={`Delete ${block.label}`}
            >
              <HackIcon name="delete" size={15} />
            </button>
          </div>
        </header>
        {block.collapsed ? null : (
          <div className="document-block-body">{children}</div>
        )}
      </div>
    </section>
  );
}

function ProjectPreview({
  title,
  summary,
  story,
  blocks,
  media,
  credits,
}: {
  title: string;
  summary: string;
  story: string;
  blocks: ProjectBlock[];
  media: ProjectMedia[];
  credits: ProjectCredit[];
}) {
  return (
    <article className="project-live-preview" aria-label="Project page preview">
      <div className="preview-cover">
        <MediaMockup
          variant={media.find((item) => item.cover)?.variant ?? "map"}
        />
      </div>
      <header>
        <span>Heritage Hack Club project</span>
        <h1>{title}</h1>
        <p>{summary}</p>
        <div>
          <strong>Web app</strong>
          <span>Building</span>
          <span>2026</span>
        </div>
      </header>
      {blocks
        .filter((block) => block.visible)
        .map((block) => {
          if (block.type === "story") {
            return (
              <section key={block.id}>
                <span className="preview-section-label">Story</span>
                <h2>Built around how students really move.</h2>
                <p>{story}</p>
              </section>
            );
          }
          if (block.type === "media") {
            return (
              <section key={block.id}>
                <span className="preview-section-label">Gallery</span>
                <div className="preview-media-grid">
                  {media.map((item) => (
                    <figure key={item.id}>
                      <MediaMockup variant={item.variant} />
                      <figcaption>{item.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            );
          }
          if (block.type === "contributors") {
            return (
              <section key={block.id}>
                <span className="preview-section-label">Credits</span>
                <h2>Made by a team.</h2>
                <div className="preview-credit-grid">
                  {credits.map((credit) => (
                    <article key={credit.id}>
                      <span>{credit.initials}</span>
                      <div>
                        <strong>{credit.name}</strong>
                        <small>{credit.role}</small>
                        <p>{credit.contribution}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          }
          if (block.type === "links") {
            return (
              <section key={block.id}>
                <span className="preview-section-label">Try it</span>
                <div className="preview-link-list">
                  {campusCompassFixture.links.map((link) => (
                    <a href={`https://${link.url}`} key={link.id}>
                      {link.label} <span>↗</span>
                    </a>
                  ))}
                </div>
              </section>
            );
          }
          return (
            <section key={block.id}>
              <span className="preview-section-label">{block.label}</span>
              <h2>{block.label}</h2>
              <p>This new section is ready for the team to shape.</p>
            </section>
          );
        })}
    </article>
  );
}

export function ProjectEditor() {
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [title, setTitle] = useState(campusCompassFixture.title);
  const [summary, setSummary] = useState(campusCompassFixture.summary);
  const [story, setStory] = useState(campusCompassFixture.story);
  const [blocks, setBlocks] = useState<ProjectBlock[]>(
    campusCompassFixture.blocks,
  );
  const [media, setMedia] = useState<ProjectMedia[]>(
    campusCompassFixture.media,
  );
  const [credits, setCredits] = useState<ProjectCredit[]>(
    campusCompassFixture.credits,
  );
  const [saveState, setSaveState] = useState<SaveStateValue>("saved");
  const [selectedMediaId, setSelectedMediaId] = useState(media[0].id);
  const [draggedMediaId, setDraggedMediaId] = useState<string | null>(null);
  const [profileCredit, setProfileCredit] = useState<ProjectCredit | null>(
    null,
  );
  const [addMenuAfter, setAddMenuAfter] = useState<number | null | "end">(null);
  const [deleteBlock, setDeleteBlock] = useState<ProjectBlock | null>(null);
  const [addContributorOpen, setAddContributorOpen] = useState(false);
  const [contributorQuery, setContributorQuery] = useState("");
  const [candidate, setCandidate] = useState<ProjectCredit | null>(null);
  const [candidateRole, setCandidateRole] = useState("");
  const [candidateContribution, setCandidateContribution] = useState("");
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishNotice, setPublishNotice] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const inspectorButtonRef = useRef<HTMLButtonElement>(null);
  const prototypeId = useRef(0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const markDirty = () => setSaveState("unsaved");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1180px)");
    const update = () => {
      setIsCompact(mediaQuery.matches);
      setInspectorOpen(!mediaQuery.matches);
    };
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const handleShortcuts = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const editingText =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        setSaveState("saved");
      } else if (event.key === "/" && !editingText && mode === "edit") {
        event.preventDefault();
        setAddMenuAfter("end");
      } else if (event.key === "Escape" && inspectorOpen && isCompact) {
        setInspectorOpen(false);
        inspectorButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleShortcuts);
    return () => document.removeEventListener("keydown", handleShortcuts);
  }, [inspectorOpen, isCompact, mode]);

  const selectedMedia = media.find((item) => item.id === selectedMediaId);
  const readyCount = [
    title.trim() && title !== "Untitled project",
    summary.trim() && summary !== "Add a one-sentence project summary.",
    credits.length > 0,
    media.some((item) => item.alt.trim()),
    campusCompassFixture.links.some((link) => link.url.trim()),
  ].filter(Boolean).length;

  const moveItem = <T,>(items: T[], index: number, delta: number) => {
    const nextIndex = index + delta;
    if (nextIndex < 0 || nextIndex >= items.length) return items;
    return arrayMove(items, index, nextIndex);
  };

  const moveBlock = (id: string, delta: number) => {
    setBlocks((current) => {
      const index = current.findIndex((block) => block.id === id);
      return moveItem(current, index, delta);
    });
    markDirty();
  };

  const handleBlockDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    setBlocks((current) => {
      const oldIndex = current.findIndex((block) => block.id === active.id);
      const newIndex = current.findIndex((block) => block.id === over.id);
      return arrayMove(current, oldIndex, newIndex);
    });
    markDirty();
  };

  const updateBlock = (id: string, patch: Partial<ProjectBlock>) => {
    setBlocks((current) =>
      current.map((block) =>
        block.id === id ? { ...block, ...patch } : block,
      ),
    );
    markDirty();
  };

  const duplicateBlock = (block: ProjectBlock, index: number) => {
    const copy = {
      ...block,
      id: `${block.type}-prototype-${++prototypeId.current}`,
      label: `${block.label} copy`,
      collapsed: false,
    };
    setBlocks((current) => [
      ...current.slice(0, index + 1),
      copy,
      ...current.slice(index + 1),
    ]);
    markDirty();
  };

  const addBlock = (option: (typeof addBlockOptions)[number]) => {
    const block: ProjectBlock = {
      id: `${option.type}-prototype-${++prototypeId.current}`,
      type: option.type,
      label: option.label,
      visible: true,
      collapsed: false,
    };
    setBlocks((current) => {
      const index =
        addMenuAfter === "end" || addMenuAfter === null
          ? current.length
          : addMenuAfter + 1;
      return [...current.slice(0, index), block, ...current.slice(index)];
    });
    setAddMenuAfter(null);
    markDirty();
    requestAnimationFrame(() =>
      document
        .getElementById(`block-${block.id}`)
        ?.scrollIntoView({ behavior: "smooth" }),
    );
  };

  const moveMedia = (id: string, delta: number) => {
    setMedia((current) => {
      const index = current.findIndex((item) => item.id === id);
      return moveItem(current, index, delta);
    });
    markDirty();
  };

  const makeCover = (id: string) => {
    setMedia((current) =>
      current.map((item) => ({ ...item, cover: item.id === id })),
    );
    markDirty();
  };

  const dropMedia = (targetId: string) => {
    if (!draggedMediaId || draggedMediaId === targetId) return;
    setMedia((current) => {
      const from = current.findIndex((item) => item.id === draggedMediaId);
      const to = current.findIndex((item) => item.id === targetId);
      return arrayMove(current, from, to);
    });
    setDraggedMediaId(null);
    markDirty();
  };

  const moveCredit = (id: string, delta: number) => {
    setCredits((current) => {
      const index = current.findIndex((credit) => credit.id === id);
      return moveItem(current, index, delta);
    });
    markDirty();
  };

  const openContributor = () => {
    setContributorQuery("");
    setCandidate(null);
    setCandidateRole("");
    setCandidateContribution("");
    setAddContributorOpen(true);
  };

  const addCredit = () => {
    if (!candidate || !candidateRole.trim() || !candidateContribution.trim())
      return;
    setCredits((current) => [
      ...current,
      {
        ...candidate,
        id: `credit-prototype-${++prototypeId.current}`,
        role: candidateRole,
        contribution: candidateContribution,
      },
    ]);
    setAddContributorOpen(false);
    markDirty();
  };

  const addUnlinkedCredit = () => {
    setCandidate({
      id: "unlinked-new",
      initials: "--",
      name: "Contributor name",
      role: "",
      contribution: "",
      linked: false,
    });
    setCandidateRole("");
    setCandidateContribution("");
  };

  const filteredCandidates = useMemo(() => {
    const query = contributorQuery.trim().toLowerCase();
    return searchCandidates.filter(
      (person) =>
        !query ||
        person.name.toLowerCase().includes(query) ||
        person.role.toLowerCase().includes(query),
    );
  }, [contributorQuery]);

  const scrollToBlock = (block: ProjectBlock) => {
    document.getElementById(`block-${block.id}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    if (isCompact) setInspectorOpen(false);
  };

  const renderBlockContent = (block: ProjectBlock) => {
    if (block.type === "story") {
      return (
        <div className="story-editor">
          <label htmlFor={`story-${block.id}`}>Project story</label>
          <textarea
            id={`story-${block.id}`}
            value={story}
            onChange={(event) => {
              setStory(event.target.value);
              markDirty();
            }}
            rows={7}
          />
          <span>No editing history yet</span>
        </div>
      );
    }

    if (block.type === "media") {
      return (
        <>
          <div className="media-workbench">
            {media.map((item) => (
              <MediaTile
                key={item.id}
                media={item}
                selected={selectedMediaId === item.id}
                onSelect={() => setSelectedMediaId(item.id)}
                onMove={(delta) => moveMedia(item.id, delta)}
                onMakeCover={() => makeCover(item.id)}
                dragHandlers={{
                  draggable: true,
                  onDragStart: () => setDraggedMediaId(item.id),
                  onDragOver: (event) => event.preventDefault(),
                  onDrop: () => dropMedia(item.id),
                }}
              />
            ))}
          </div>
          <button className="inline-add-control" type="button">
            <HackIcon name="plus" size={16} /> Add image
          </button>
          <p className="block-helper">
            Drag tiles or use the arrow controls. Select a tile to edit its
            caption and alt text in the inspector.
          </p>
        </>
      );
    }

    if (block.type === "contributors") {
      return (
        <>
          <div className="credit-list">
            {credits.map((credit, creditIndex) => (
              <ContributorCreditCard
                key={credit.id}
                credit={credit}
                index={creditIndex}
                onOpen={() => credit.linked && setProfileCredit(credit)}
                onMove={(delta) => moveCredit(credit.id, delta)}
              />
            ))}
          </div>
          <button
            className="inline-add-control"
            type="button"
            onClick={openContributor}
          >
            <HackIcon name="plus" size={16} /> Add contributor credit
          </button>
          <p className="credit-model-note">
            <HackIcon name="person-badge" size={16} />
            The project owns each credit. A credit can link to a profile, but
            never needs one.
          </p>
        </>
      );
    }

    if (block.type === "links") {
      return (
        <div className="link-editor-list">
          {campusCompassFixture.links.map((link) => (
            <div key={link.id}>
              <label htmlFor={`link-${link.id}`}>{link.label}</label>
              <input
                id={`link-${link.id}`}
                defaultValue={link.url}
                onChange={markDirty}
              />
              <span>↗</span>
            </div>
          ))}
          <button className="inline-add-control" type="button">
            <HackIcon name="plus" size={16} /> Add link
          </button>
        </div>
      );
    }

    if (block.type === "tools") {
      return (
        <div className="tool-chip-editor">
          {["Next.js", "Mapbox", "Figma", "Playwright"].map((tool) => (
            <button type="button" key={tool}>
              {tool} <span>×</span>
            </button>
          ))}
          <button type="button">+ Add tool</button>
        </div>
      );
    }

    if (block.type === "timeline") {
      return (
        <ol className="timeline-editor">
          <li>
            <span>May 12</span>
            <input
              defaultValue="Interviewed new students"
              onChange={markDirty}
            />
          </li>
          <li>
            <span>Jun 03</span>
            <input defaultValue="First route prototype" onChange={markDirty} />
          </li>
        </ol>
      );
    }

    if (block.type === "callout") {
      return (
        <div className="callout-editor">
          <span>DEV NOTE</span>
          <textarea
            rows={3}
            defaultValue="Test the route labels outdoors before the next demo."
            onChange={markDirty}
          />
        </div>
      );
    }

    return (
      <div className="generic-text-editor">
        <textarea
          rows={5}
          defaultValue="Start writing this part of the project page…"
          onChange={markDirty}
        />
      </div>
    );
  };

  return (
    <div className="admin-workbench" data-mode={mode}>
      <header className="project-editor-toolbar">
        <div className="editor-breadcrumb-row">
          <p>
            <Link href="/#projects">Projects</Link>
            <span>/</span>
            <strong>{title}</strong>
          </p>
          <AdminStatusIndicator label="Draft" tone="yellow" />
          <span className="prototype-boundary">
            Fixture prototype · nothing persists
          </span>
        </div>
        <div className="editor-command-row">
          <div className="editor-document-name">
            <span>Project page</span>
            <h1>{title}</h1>
          </div>
          <SaveState state={saveState} />
          <div className="mode-switch" aria-label="Editor mode">
            <button
              type="button"
              aria-pressed={mode === "edit"}
              onClick={() => setMode("edit")}
            >
              Edit
            </button>
            <button
              type="button"
              aria-pressed={mode === "preview"}
              onClick={() => setMode("preview")}
            >
              Preview
            </button>
          </div>
          <WorkbenchButton
            onClick={() => setSaveState("saved")}
            aria-label="Save prototype changes"
          >
            Save <kbd>⌘S</kbd>
          </WorkbenchButton>
          <WorkbenchButton
            ref={inspectorButtonRef}
            className="inspector-toggle"
            aria-expanded={inspectorOpen}
            onClick={() => setInspectorOpen(true)}
          >
            <HackIcon name="controls" size={16} /> Inspector
          </WorkbenchButton>
          <WorkbenchButton
            className="publish-button"
            onClick={() => setPublishOpen(true)}
          >
            Publish
          </WorkbenchButton>
          <WorkbenchButton aria-label="More project actions">
            <span aria-hidden="true">•••</span>
          </WorkbenchButton>
        </div>
      </header>

      {publishNotice ? (
        <div className="prototype-toast" role="status">
          <HackIcon name="check-circle" size={17} />
          Prototype publish complete. No public content changed.
          <button
            type="button"
            onClick={() => setPublishNotice(false)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ) : null}

      <div className="admin-workspace-layout">
        <div className="project-workspace">
          {mode === "preview" ? (
            <ProjectPreview
              title={title}
              summary={summary}
              story={story}
              blocks={blocks}
              media={media}
              credits={credits}
            />
          ) : (
            <div
              className="project-document"
              aria-label="Editable project document"
            >
              <section className="document-cover-section" id="project-cover">
                <div className="cover-edit-label">
                  <span>Cover media</span>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedMediaId(
                        media.find((item) => item.cover)?.id ?? media[0].id,
                      )
                    }
                  >
                    Edit cover
                  </button>
                </div>
                <MediaMockup
                  variant={media.find((item) => item.cover)?.variant ?? "map"}
                />
                <div className="document-identity">
                  <label htmlFor="inline-project-title">Project title</label>
                  <textarea
                    id="inline-project-title"
                    className="inline-title"
                    rows={2}
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                      markDirty();
                    }}
                  />
                  <label htmlFor="inline-project-summary">
                    Project summary
                  </label>
                  <textarea
                    id="inline-project-summary"
                    className="inline-summary"
                    rows={2}
                    value={summary}
                    onChange={(event) => {
                      setSummary(event.target.value);
                      markDirty();
                    }}
                  />
                  <div className="document-meta-strip">
                    <span>Web app</span>
                    <span>Building</span>
                    <span>2026</span>
                    <code>{campusCompassFixture.id}</code>
                  </div>
                </div>
              </section>

              <DndContext
                id="project-document-blocks"
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleBlockDragEnd}
              >
                <SortableContext
                  items={blocks.map((block) => block.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="document-block-list">
                    {blocks.map((block, index) => (
                      <SortableProjectBlock
                        key={block.id}
                        block={block}
                        index={index}
                        total={blocks.length}
                        onMove={(delta) => moveBlock(block.id, delta)}
                        onToggleCollapse={() =>
                          updateBlock(block.id, { collapsed: !block.collapsed })
                        }
                        onToggleVisibility={() =>
                          updateBlock(block.id, { visible: !block.visible })
                        }
                        onDuplicate={() => duplicateBlock(block, index)}
                        onDelete={() => setDeleteBlock(block)}
                        onInsert={() => setAddMenuAfter(index)}
                      >
                        {renderBlockContent(block)}
                      </SortableProjectBlock>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <button
                className="add-section-button"
                type="button"
                onClick={() => setAddMenuAfter("end")}
              >
                <HackIcon name="plus" size={18} />
                Add section
                <kbd>/</kbd>
              </button>
            </div>
          )}
        </div>

        {isCompact && inspectorOpen ? (
          <button
            className="inspector-scrim"
            type="button"
            aria-label="Close project inspector"
            onClick={() => {
              setInspectorOpen(false);
              inspectorButtonRef.current?.focus();
            }}
          />
        ) : null}

        <aside
          className="project-inspector"
          aria-label="Project inspector"
          aria-hidden={isCompact && !inspectorOpen}
          data-open={inspectorOpen}
          inert={isCompact && !inspectorOpen ? true : undefined}
        >
          <header className="inspector-heading">
            <div>
              <span>Project inspector</span>
              <strong>{title}</strong>
            </div>
            <button
              type="button"
              className="inspector-close"
              aria-label="Close project inspector"
              onClick={() => {
                setInspectorOpen(false);
                inspectorButtonRef.current?.focus();
              }}
            >
              ×
            </button>
          </header>

          <InspectorSection title="Project">
            <dl className="inspector-metadata">
              <CompactMetadataRow label="State">
                <AdminStatusIndicator label="Draft" tone="yellow" />
              </CompactMetadataRow>
              <CompactMetadataRow label="Type">Web app</CompactMetadataRow>
              <CompactMetadataRow label="Year">2026</CompactMetadataRow>
              <CompactMetadataRow label="Tags">
                <span className="inspector-tags">
                  {campusCompassFixture.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                  <button type="button" aria-label="Add project tag">
                    +
                  </button>
                </span>
              </CompactMetadataRow>
              <CompactMetadataRow label="Slug" mono>
                {campusCompassFixture.slug}
              </CompactMetadataRow>
              <CompactMetadataRow label="project_id" mono>
                {campusCompassFixture.id}
              </CompactMetadataRow>
            </dl>
          </InspectorSection>

          {selectedMedia ? (
            <InspectorSection title="Selected media">
              <div className="selected-media-inspector">
                <MediaMockup variant={selectedMedia.variant} />
                <label htmlFor="media-caption">Caption</label>
                <input
                  id="media-caption"
                  value={selectedMedia.caption}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setMedia((current) =>
                      current.map((item) =>
                        item.id === selectedMedia.id
                          ? { ...item, caption: event.target.value }
                          : item,
                      ),
                    );
                    markDirty();
                  }}
                />
                <label htmlFor="media-alt">Alt text</label>
                <textarea
                  id="media-alt"
                  rows={3}
                  value={selectedMedia.alt}
                  onChange={(event) => {
                    setMedia((current) =>
                      current.map((item) =>
                        item.id === selectedMedia.id
                          ? { ...item, alt: event.target.value }
                          : item,
                      ),
                    );
                    markDirty();
                  }}
                />
                <code>
                  {selectedMedia.dimensions} · {selectedMedia.format}
                  {selectedMedia.cover ? " · COVER" : ""}
                </code>
              </div>
            </InspectorSection>
          ) : null}

          <InspectorSection
            title="People"
            action={
              <button type="button" onClick={openContributor}>
                + Add
              </button>
            }
          >
            <div className="inspector-people">
              {credits.map((credit) => (
                <button
                  type="button"
                  key={credit.id}
                  onClick={() => credit.linked && setProfileCredit(credit)}
                  disabled={!credit.linked}
                >
                  <span>{credit.initials}</span>
                  <span>
                    <strong>{credit.name}</strong>
                    <small>{credit.role}</small>
                    <em>
                      {credit.linked ? "Linked profile ↗" : "Unlinked credit"}
                    </em>
                  </span>
                </button>
              ))}
            </div>
          </InspectorSection>

          <InspectorSection title="Page outline">
            <ProjectOutline blocks={blocks} onSelect={scrollToBlock} />
          </InspectorSection>

          <InspectorSection title="Publish">
            <ul className="inspector-checklist">
              <li data-done="true">Title</li>
              <li data-done="true">Summary</li>
              <li data-done="true">Contributor</li>
              <li>Cover alt text reviewed</li>
              <li>Primary link checked</li>
            </ul>
            <div className="readiness-meter">
              <span style={{ width: `${(readyCount / 5) * 100}%` }} />
            </div>
            <p>{readyCount} / 5 ready</p>
          </InspectorSection>

          <InspectorSection title="History">
            <ol className="activity-list">
              {campusCompassFixture.activity.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </InspectorSection>
        </aside>
      </div>

      {addMenuAfter !== null ? (
        <ModalDialog
          className="add-section-modal"
          labelledBy="add-section-title"
          onClose={() => setAddMenuAfter(null)}
        >
          <header>
            <div>
              <span>Insert block</span>
              <h2 id="add-section-title">Add to project</h2>
            </div>
            <button
              type="button"
              onClick={() => setAddMenuAfter(null)}
              aria-label="Close"
            >
              ×
            </button>
          </header>
          <div className="add-section-grid">
            {addBlockOptions.map((option) => (
              <button
                type="button"
                key={option.type}
                onClick={() => addBlock(option)}
              >
                <HackIcon name={option.icon} size={19} />
                <span>
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </span>
                <code>/{option.type}</code>
              </button>
            ))}
          </div>
        </ModalDialog>
      ) : null}

      {deleteBlock ? (
        <ModalDialog
          className="confirm-modal"
          labelledBy="delete-block-title"
          onClose={() => setDeleteBlock(null)}
        >
          <span className="confirm-icon">
            <HackIcon name="delete" size={20} />
          </span>
          <h2 id="delete-block-title">Delete “{deleteBlock.label}”?</h2>
          <p>
            This removes the section from this prototype document. Other project
            data stays put.
          </p>
          <div>
            <WorkbenchButton onClick={() => setDeleteBlock(null)}>
              Cancel
            </WorkbenchButton>
            <WorkbenchButton
              className="danger-button"
              onClick={() => {
                setBlocks((current) =>
                  current.filter((block) => block.id !== deleteBlock.id),
                );
                setDeleteBlock(null);
                markDirty();
              }}
            >
              Delete section
            </WorkbenchButton>
          </div>
        </ModalDialog>
      ) : null}

      {profileCredit ? (
        <ModalDialog
          className="profile-peek-modal"
          labelledBy="profile-peek-title"
          onClose={() => setProfileCredit(null)}
        >
          <header>
            <span className="profile-peek-avatar">
              {profileCredit.initials}
            </span>
            <button
              type="button"
              onClick={() => setProfileCredit(null)}
              aria-label="Close profile peek"
            >
              ×
            </button>
          </header>
          <span className="profile-peek-kicker">Linked member profile</span>
          <h2 id="profile-peek-title">{profileCredit.name}</h2>
          <p>{profileCredit.bio}</p>
          <Link href="/#people">View full profile →</Link>
          <section>
            <h3>Credited on</h3>
            <ul>
              {profileCredit.projects?.map((project) => (
                <li key={project}>
                  <span>{project}</span>
                  <small>
                    {project === title ? "This project" : "Project credit"}
                  </small>
                </li>
              ))}
            </ul>
          </section>
        </ModalDialog>
      ) : null}

      {addContributorOpen ? (
        <ModalDialog
          className="add-contributor-modal"
          labelledBy="add-contributor-title"
          onClose={() => setAddContributorOpen(false)}
        >
          <header>
            <div>
              <span>Project credit</span>
              <h2 id="add-contributor-title">Add contributor</h2>
            </div>
            <button
              type="button"
              onClick={() => setAddContributorOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
          </header>
          {!candidate ? (
            <>
              <label htmlFor="person-search">Search people</label>
              <div className="person-search-field">
                <HackIcon name="search" size={17} />
                <input
                  id="person-search"
                  autoFocus
                  value={contributorQuery}
                  placeholder="Try “ave”"
                  onChange={(event) => setContributorQuery(event.target.value)}
                />
              </div>
              <div className="person-search-results">
                {filteredCandidates.map((person) => {
                  const alreadyCredited = credits.some(
                    (credit) => credit.name === person.name,
                  );
                  return (
                    <button
                      type="button"
                      key={person.id}
                      disabled={alreadyCredited}
                      onClick={() => {
                        setCandidate(person);
                        setCandidateRole(person.role);
                      }}
                    >
                      <span>{person.initials}</span>
                      <span>
                        <strong>{person.name}</strong>
                        <small>{person.role}</small>
                      </span>
                      <em>
                        {alreadyCredited
                          ? "Already credited"
                          : `${person.creditCount} existing credits`}
                      </em>
                    </button>
                  );
                })}
              </div>
              <button
                className="unlinked-person-button"
                type="button"
                onClick={addUnlinkedCredit}
              >
                <HackIcon name="plus" size={16} /> Add unlinked person
              </button>
            </>
          ) : (
            <div className="contribution-editor">
              <div className="selected-candidate">
                <span>{candidate.initials}</span>
                <div>
                  <strong>{candidate.name}</strong>
                  <small>
                    {candidate.linked
                      ? "Linked profile"
                      : "No profile attached"}
                  </small>
                </div>
                <button type="button" onClick={() => setCandidate(null)}>
                  Change
                </button>
              </div>
              <label htmlFor="credit-role">Role</label>
              <input
                id="credit-role"
                value={candidateRole}
                placeholder="Product designer"
                onChange={(event) => setCandidateRole(event.target.value)}
              />
              <label htmlFor="credit-contribution">Contribution</label>
              <textarea
                id="credit-contribution"
                rows={4}
                value={candidateContribution}
                placeholder="What did this person actually do?"
                onChange={(event) =>
                  setCandidateContribution(event.target.value)
                }
              />
              <WorkbenchButton
                className="publish-button"
                disabled={
                  !candidateRole.trim() || !candidateContribution.trim()
                }
                onClick={addCredit}
              >
                Add credit
              </WorkbenchButton>
            </div>
          )}
        </ModalDialog>
      ) : null}

      {publishOpen ? (
        <ModalDialog
          className="publish-modal"
          labelledBy="publish-title"
          onClose={() => setPublishOpen(false)}
        >
          <AdminStatusIndicator label="Prototype action" tone="blue" />
          <h2 id="publish-title">Publish {title}?</h2>
          <p>
            Preview and publishing are deliberately separate. This demo will
            only update the on-screen state; it cannot change the public site.
          </p>
          <div className="publish-summary">
            <span>{readyCount} / 5 checks ready</span>
            <strong>Draft → Prototype published</strong>
          </div>
          <div className="publish-modal-actions">
            <WorkbenchButton onClick={() => setPublishOpen(false)}>
              Keep editing
            </WorkbenchButton>
            <WorkbenchButton
              className="publish-button"
              onClick={() => {
                setSaveState("published");
                setPublishOpen(false);
                setPublishNotice(true);
              }}
            >
              Publish prototype
            </WorkbenchButton>
          </div>
        </ModalDialog>
      ) : null}
    </div>
  );
}
