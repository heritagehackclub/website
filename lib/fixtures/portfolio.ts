export type ProjectContributor = {
  memberSlug?: string;
  name: string;
  initials: string;
  role: string;
  contribution: string;
};

export type PortfolioProject = {
  slug: string;
  title: string;
  type: string;
  status: "Building" | "Testing" | "Pitching";
  year: string;
  summary: string;
  problem: string;
  story: string;
  outcome: string;
  accent: string;
  visual: "map" | "bot" | "film";
  image?: string;
  tags: string[];
  tools: string[];
  contributors: ProjectContributor[];
  links: Array<{ label: string; href: string }>;
};

export type PortfolioMember = {
  slug: string;
  name: string;
  initials: string;
  headline: string;
  introduction: string;
  location: string;
  classYear: string;
  interests: string[];
  skills: string[];
  learning: string[];
  links: Array<{
    label: string;
    href: string;
    kind: "github" | "website" | "email";
  }>;
  projectSlugs: string[];
  avatarTone?: string;
  banner?: "map-lines" | "signal";
};

// Every visible name and title is intentionally generic so these examples
// cannot be mistaken for claims about real students or completed club work.
export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "sample-project-01",
    title: "Sample project 01",
    type: "Sample · Web app",
    status: "Building",
    year: "Year",
    summary:
      "A short project summary will explain what the team is making and why it matters.",
    problem:
      "This section will describe the real problem, question, or opportunity that started the project.",
    story:
      "This section will document the process: research, rough ideas, tests, decisions, setbacks, and changes made along the way.",
    outcome:
      "This section will show the current result, what the team learned, and what should happen next.",
    accent: "#338eda",
    visual: "map",
    image: "/images/home/campus-wing.png",
    tags: ["Topic", "Audience", "Method"],
    tools: ["Tool or material", "Research method", "Testing method"],
    contributors: [
      {
        memberSlug: "sample-member-01",
        name: "Sample member 01",
        initials: "01",
        role: "Role or responsibility",
        contribution: "A specific description of what this person contributed.",
      },
      {
        memberSlug: "sample-member-02",
        name: "Sample member 02",
        initials: "02",
        role: "Role or responsibility",
        contribution: "A specific description of what this person contributed.",
      },
      {
        name: "Unlinked contributor",
        initials: "--",
        role: "Role or responsibility",
        contribution:
          "Contributors can receive credit even without a public profile.",
      },
    ],
    links: [],
  },
  {
    slug: "sample-project-02",
    title: "Sample project 02",
    type: "Sample · Bot or tool",
    status: "Testing",
    year: "Year",
    summary:
      "Project descriptions can cover software, hardware, design, research, film, or any useful thing.",
    problem:
      "Use this space to state who needs the project and what is difficult today.",
    story:
      "Use this space to show the work honestly, including experiments that did not make the final version.",
    outcome:
      "Use this space for evidence: a demo, test result, artifact, reflection, or next milestone.",
    accent: "#ec3750",
    visual: "bot",
    image: "/images/home/campus-entrance.png",
    tags: ["Topic", "Testing", "Documentation"],
    tools: ["Tool or material", "Design process", "Feedback"],
    contributors: [
      {
        memberSlug: "sample-member-02",
        name: "Sample member 02",
        initials: "02",
        role: "Role or responsibility",
        contribution: "A specific description of what this person contributed.",
      },
      {
        memberSlug: "sample-member-03",
        name: "Sample member 03",
        initials: "03",
        role: "Role or responsibility",
        contribution: "A specific description of what this person contributed.",
      },
    ],
    links: [],
  },
  {
    slug: "sample-project-03",
    title: "Sample project 03",
    type: "Sample · Media project",
    status: "Pitching",
    year: "Year",
    summary:
      "The same portfolio structure works for films, designs, events, pitch decks, and physical builds.",
    problem:
      "Use this space to explain the reason the project deserves to exist.",
    story:
      "Use this space to credit planning, drawing, writing, filming, presenting, organizing, and testing—not only coding.",
    outcome:
      "Use this space to show what was made and what the team wants to improve.",
    accent: "#a633d6",
    visual: "film",
    image: "/images/home/campus-theater.png",
    tags: ["Story", "Presentation", "Teamwork"],
    tools: ["Creative tool", "Production method", "Presentation"],
    contributors: [
      {
        memberSlug: "sample-member-03",
        name: "Sample member 03",
        initials: "03",
        role: "Role or responsibility",
        contribution: "A specific description of what this person contributed.",
      },
      {
        memberSlug: "sample-member-01",
        name: "Sample member 01",
        initials: "01",
        role: "Role or responsibility",
        contribution: "A specific description of what this person contributed.",
      },
    ],
    links: [],
  },
];

export const portfolioMembers: PortfolioMember[] = [
  {
    slug: "sample-member-01",
    name: "Sample member 01",
    initials: "01",
    headline:
      "A member headline will summarize interests, strengths, and the kinds of work they want to make.",
    introduction:
      "This is placeholder profile copy. A member can introduce what they care about, how they like to contribute, and what they hope to learn without turning the page into a social network.",
    location: "Heritage High School",
    classYear: "Class year",
    interests: ["Interest", "Interest", "Interest"],
    skills: [
      "Skill or contribution",
      "Skill or contribution",
      "Skill or contribution",
    ],
    learning: ["Learning goal", "Learning goal", "Learning goal"],
    links: [{ label: "Portfolio link", href: "/#projects", kind: "website" }],
    projectSlugs: ["sample-project-01", "sample-project-03"],
  },
  {
    slug: "sample-member-02",
    name: "Sample member 02",
    initials: "02",
    headline:
      "Profiles can represent builders, designers, researchers, organizers, presenters, and testers.",
    introduction:
      "This is placeholder profile copy. The finished profile will focus on useful work and clear contribution credit rather than popularity or follower counts.",
    location: "Heritage High School",
    classYear: "Class year",
    interests: ["Interest", "Interest", "Interest"],
    skills: [
      "Skill or contribution",
      "Skill or contribution",
      "Skill or contribution",
    ],
    learning: ["Learning goal", "Learning goal", "Learning goal"],
    links: [{ label: "Portfolio link", href: "/#projects", kind: "website" }],
    projectSlugs: ["sample-project-01", "sample-project-02"],
    avatarTone: "#1768a8",
    banner: "signal",
  },
  {
    slug: "sample-member-03",
    name: "Sample member 03",
    initials: "03",
    headline:
      "Every member page will connect personal interests to specific work the student helped complete.",
    introduction:
      "This is placeholder profile copy. Students will choose what to publish, and each credited project will explain the exact role they played.",
    location: "Heritage High School",
    classYear: "Class year",
    interests: ["Interest", "Interest", "Interest"],
    skills: [
      "Skill or contribution",
      "Skill or contribution",
      "Skill or contribution",
    ],
    learning: ["Learning goal", "Learning goal", "Learning goal"],
    links: [{ label: "Portfolio link", href: "/#projects", kind: "website" }],
    projectSlugs: ["sample-project-02", "sample-project-03"],
    banner: "map-lines",
  },
];

export function getProject(slug: string) {
  return portfolioProjects.find((project) => project.slug === slug);
}

export function getMember(slug: string) {
  return portfolioMembers.find((member) => member.slug === slug);
}

export function getMemberContribution(
  project: PortfolioProject,
  memberSlug: string,
) {
  return project.contributors.find(
    (contributor) => contributor.memberSlug === memberSlug,
  );
}
