import Link from "next/link";
import localFont from "next/font/local";
import { HomeStoryCarousel } from "@/components/public/home-story-carousel";
import { ProjectVisual } from "@/components/public/project-visual";
import { SiteShell } from "@/components/shell/site-shell";
import { HackIcon } from "@/components/ui/hack-icon";
import { StatusPill } from "@/components/ui/primitives";
import { portfolioMembers, portfolioProjects } from "@/lib/fixtures/portfolio";

const reservoirGrunge = localFont({
  src: "./fonts/reservoir-grunge.woff2",
  variable: "--font-reservoir-grunge",
  display: "swap",
  preload: false,
  weight: "400",
});

const participationPaths = [
  {
    number: "01",
    title: "Bring the question",
    copy: "Start with a problem, a curiosity, a rough sketch, or a pitch deck.",
    icon: "idea" as const,
  },
  {
    number: "02",
    title: "Choose your part",
    copy: "Code, draw, film, test, research, solder, write, or organize the work.",
    icon: "controls" as const,
  },
  {
    number: "03",
    title: "Show what happened",
    copy: "Publish the result, explain the process, and credit every contribution.",
    icon: "announcement" as const,
  },
];

const statusTones = {
  Building: "blue",
  Testing: "green",
  Pitching: "yellow",
} as const;

const homeShortcuts = [
  {
    href: "#projects",
    label: "Current projects",
    icon: "grid" as const,
  },
  {
    href: "#people",
    label: "Meet the team",
    icon: "profile" as const,
  },
  {
    href: "/how-it-works",
    label: "How it works",
    icon: "idea" as const,
  },
  {
    href: "#about",
    label: "About the club",
    icon: "info" as const,
  },
];

export default function Home() {
  return (
    <SiteShell>
      <div className={`${reservoirGrunge.variable} page-wrap home-page`}>
        <HomeStoryCarousel />

        <nav className="home-shortcuts" aria-label="Explore Heritage Hack Club">
          {homeShortcuts.map((shortcut) => (
            <a href={shortcut.href} key={shortcut.href}>
              <HackIcon name={shortcut.icon} size={25} />
              <span>
                <strong>{shortcut.label}</strong>
              </span>
            </a>
          ))}
        </nav>

        <section className="section-block home-projects" id="projects">
          <div className="section-heading">
            <div>
              <h2>Our projects</h2>
              <p>Every project we made, respectively credited!</p>
            </div>
            <a className="text-link" href="#people">
              Meet the makers <HackIcon name="profile" size={17} />
            </a>
          </div>

          <div className="project-grid">
            {portfolioProjects.map((project) => (
              <Link
                className="project-card"
                href={`/projects/${project.slug}`}
                key={project.slug}
              >
                <ProjectVisual project={project} compact />
                <div className="project-copy">
                  <div className="project-title-row">
                    <div>
                      <span className="project-type">{project.type}</span>
                      <h3>{project.title}</h3>
                    </div>
                    <StatusPill tone={statusTones[project.status]}>
                      {project.status}
                    </StatusPill>
                  </div>
                  <p>{project.summary}</p>
                  <div className="project-meta">
                    <div
                      className="avatar-stack"
                      aria-label={`${project.contributors.length} sample contributors`}
                    >
                      {project.contributors.slice(0, 4).map((person) => (
                        <span key={person.name}>{person.initials}</span>
                      ))}
                    </div>
                    <span>
                      {project.contributors.length} sample contributors
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="section-block home-people" id="people">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Heritage Hack Club</span>
              <h2>Members</h2>
              <p>These are our members!</p>
            </div>
          </div>
          <div className="home-member-directory">
            {portfolioMembers.map((member) => (
              <Link
                className="home-member-card"
                href={`/people/${member.slug}`}
                key={member.slug}
              >
                <div
                  className="home-member-avatar"
                  data-placeholder={!member.avatarTone}
                  style={
                    member.avatarTone
                      ? { backgroundColor: member.avatarTone }
                      : undefined
                  }
                >
                  {member.initials}
                </div>
                <div>
                  <h3>{member.name}</h3>
                  <p>{member.headline}</p>
                  <span>
                    Sample profile · {member.projectSlugs.length} credited{" "}
                    {member.projectSlugs.length === 1 ? "project" : "projects"}
                  </span>
                </div>
                <HackIcon name="right-caret" size={19} />
              </Link>
            ))}
          </div>
        </section>

        <section className="section-block home-participation" id="how">
          <div className="section-heading">
            <div>
              <span className="section-kicker">There is a way in</span>
              <h2>Join the work at any stage.</h2>
            </div>
          </div>
          <div className="participation-list">
            {participationPaths.map((path) => (
              <article key={path.number}>
                <span>{path.number}</span>
                <HackIcon name={path.icon} size={24} />
                <h3>{path.title}</h3>
                <p>{path.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="home-about" id="about">
          <span className="section-kicker">What this club is for</span>
          <div>
            <h2>
              We&apos;re here to bring all different sorts of people and ideas
              together
            </h2>
            <p>
              We are connected to the national Hack Club nonprofit, but
              ultimately, this club is made by Heritage students. This site is
              our shared portfolio.
            </p>
          </div>
        </section>

        <footer className="site-footer">
          <p>Built by Heritage students. Part of the Hack Club community.</p>
          <div>
            <Link href="#projects">Projects</Link>
            <Link href="#people">People</Link>
            <Link href="/how-it-works">How it works</Link>
            <a href="https://hackclub.com/" target="_blank" rel="noreferrer">
              Hack Club
            </a>
          </div>
        </footer>
      </div>
    </SiteShell>
  );
}
