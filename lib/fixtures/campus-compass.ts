export type ProjectBlockType =
  | "story"
  | "media"
  | "contributors"
  | "links"
  | "text"
  | "tools"
  | "timeline"
  | "callout";

export type ProjectBlock = {
  id: string;
  type: ProjectBlockType;
  label: string;
  visible: boolean;
  collapsed: boolean;
};

export type ProjectCredit = {
  id: string;
  initials: string;
  name: string;
  role: string;
  contribution: string;
  linked: boolean;
  creditCount?: number;
  bio?: string;
  projects?: string[];
};

export type ProjectMedia = {
  id: string;
  label: string;
  caption: string;
  alt: string;
  dimensions: string;
  format: string;
  cover: boolean;
  variant: "map" | "route" | "places";
};

export const campusCompassFixture = {
  id: "draft_new",
  slug: "untitled-project",
  title: "Untitled project",
  summary: "Add a one-sentence project summary.",
  type: "Not set",
  state: "Draft",
  year: "Not set",
  tags: [],
  story: "",
  blocks: [
    {
      id: "story",
      type: "story",
      label: "Story",
      visible: true,
      collapsed: false,
    },
    {
      id: "media",
      type: "media",
      label: "Media",
      visible: true,
      collapsed: false,
    },
    {
      id: "contributors",
      type: "contributors",
      label: "Contributors",
      visible: true,
      collapsed: false,
    },
    {
      id: "links",
      type: "links",
      label: "Links",
      visible: true,
      collapsed: false,
    },
  ] satisfies ProjectBlock[],
  media: [
    {
      id: "media-placeholder",
      label: "Temporary cover",
      caption: "Replace this temporary campus image with real project media.",
      alt: "Temporary Heritage High School campus placeholder.",
      dimensions: "1920 × 1080",
      format: "WEBP",
      cover: true,
      variant: "map",
    },
  ] satisfies ProjectMedia[],
  credits: [] satisfies ProjectCredit[],
  links: [] as Array<{ id: string; label: string; url: string }>,
  activity: ["Draft created · no edits yet"],
};

export const addBlockOptions: Array<{
  type: ProjectBlockType;
  label: string;
  description: string;
  icon: "edit" | "grid" | "person" | "link" | "controls" | "history" | "quote";
}> = [
  {
    type: "text",
    label: "Text",
    description: "A flexible paragraph block",
    icon: "edit",
  },
  {
    type: "story",
    label: "Story section",
    description: "Problem, process, and outcome",
    icon: "edit",
  },
  {
    type: "media",
    label: "Media gallery",
    description: "Images with captions and alt text",
    icon: "grid",
  },
  {
    type: "contributors",
    label: "Contributors",
    description: "Project credits and roles",
    icon: "person",
  },
  {
    type: "links",
    label: "Links",
    description: "Demo, source, deck, and more",
    icon: "link",
  },
  {
    type: "tools",
    label: "Tools & technology",
    description: "What the team used",
    icon: "controls",
  },
  {
    type: "timeline",
    label: "Timeline",
    description: "Milestones and progress",
    icon: "history",
  },
  {
    type: "callout",
    label: "Quote / callout",
    description: "Highlight a useful note",
    icon: "quote",
  },
];
