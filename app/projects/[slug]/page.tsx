import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/shell/site-shell";
import { ProjectVisual } from "@/components/public/project-visual";
import { HackIcon } from "@/components/ui/hack-icon";
import { getProject, portfolioProjects } from "@/lib/fixtures/portfolio";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return portfolioProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: `${project.summary} A Heritage Hack Club project.`,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  return (
    <SiteShell current="Projects">
      <article
        className="portfolio-page public-project-page"
        style={{ "--project-accent": project.accent } as CSSProperties}
      >
        <nav className="public-breadcrumb" aria-label="Breadcrumb">
          <Link href="/#projects">Projects</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{project.title}</span>
        </nav>

        <header className="public-project-hero">
          <div className="public-project-heading">
            <div className="project-meta-line">
              <span>{project.type}</span>
              <span>{project.status}</span>
              <span>{project.year}</span>
            </div>
            <h1>{project.title}</h1>
            <p>{project.summary}</p>
            <div className="public-project-actions">
              {project.links.map((link, index) => (
                <a
                  className={
                    index === 0
                      ? "profile-link profile-link--primary"
                      : "profile-link"
                  }
                  href={link.href}
                  key={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                  <HackIcon name="external" size={14} />
                </a>
              ))}
            </div>
          </div>
          <ProjectVisual project={project} />
        </header>

        <div className="public-project-layout">
          <div className="public-project-story">
            <section className="portfolio-section">
              <span className="section-kicker">The problem</span>
              <h2>Why this project exists</h2>
              <p>{project.problem}</p>
            </section>
            <section className="portfolio-section">
              <span className="section-kicker">The work</span>
              <h2>How the team approached it</h2>
              <p>{project.story}</p>
            </section>
            <section className="portfolio-section project-outcome">
              <span className="section-kicker">Where it is now</span>
              <h2>Current outcome</h2>
              <p>{project.outcome}</p>
            </section>
          </div>

          <aside
            className="public-project-details"
            aria-label="Project details"
          >
            <section className="portfolio-section">
              <span className="section-kicker">Built with</span>
              <ul className="project-tool-list">
                {project.tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </section>
            <section className="portfolio-section">
              <span className="section-kicker">Topics</span>
              <div className="profile-tag-list">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <section className="project-contributors-section">
          <header className="portfolio-section-heading">
            <div>
              <span className="section-kicker">Project credits</span>
              <h2>Who made what</h2>
            </div>
            <span className="section-count">
              {project.contributors.length} contributors
            </span>
          </header>
          <div className="public-contributor-grid">
            {project.contributors.map((contributor) => {
              const content = (
                <>
                  <span className="public-contributor-avatar">
                    {contributor.initials}
                  </span>
                  <div>
                    <h3>{contributor.name}</h3>
                    <strong>{contributor.role}</strong>
                    <p>{contributor.contribution}</p>
                  </div>
                  {contributor.memberSlug ? (
                    <HackIcon name="right-caret" size={19} />
                  ) : (
                    <span className="unlinked-credit">Project credit</span>
                  )}
                </>
              );

              return contributor.memberSlug ? (
                <Link
                  className="public-contributor-card"
                  href={`/people/${contributor.memberSlug}`}
                  key={contributor.name}
                >
                  {content}
                </Link>
              ) : (
                <div className="public-contributor-card" key={contributor.name}>
                  {content}
                </div>
              );
            })}
          </div>
        </section>
      </article>
    </SiteShell>
  );
}
