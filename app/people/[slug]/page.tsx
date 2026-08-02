import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/shell/site-shell";
import { HackIcon } from "@/components/ui/hack-icon";
import { ProjectVisual } from "@/components/public/project-visual";
import {
  getMember,
  getMemberContribution,
  getProject,
  portfolioMembers,
} from "@/lib/fixtures/portfolio";

type ProfilePageProps = {
  params: Promise<{ slug: string }>;
};

const linkIcons = {
  github: "github",
  website: "link",
  email: "email",
} as const;

export function generateStaticParams() {
  return portfolioMembers.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = getMember(slug);

  if (!member) return {};

  return {
    title: member.name,
    description: `${member.headline} Explore ${member.name}'s Heritage Hack Club projects and contributions.`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const member = getMember(slug);

  if (!member) notFound();

  const projects = member.projectSlugs.flatMap((projectSlug) => {
    const project = getProject(projectSlug);
    return project ? [project] : [];
  });

  return (
    <SiteShell current="People">
      <div className="portfolio-page profile-page">
        <nav className="public-breadcrumb" aria-label="Breadcrumb">
          <Link href="/#people">People</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{member.name}</span>
        </nav>

        <header className="profile-identity-card">
          <div
            className={`profile-banner ${
              member.banner
                ? `profile-banner--${member.banner}`
                : "profile-banner--empty"
            }`}
          >
            <span>HERITAGE / SAMPLE MEMBER LAYOUT</span>
            <i aria-hidden="true" />
          </div>
          <div className="profile-identity-content">
            <div
              className="profile-avatar"
              data-placeholder={!member.avatarTone}
              style={
                member.avatarTone
                  ? { backgroundColor: member.avatarTone }
                  : undefined
              }
              aria-label={
                member.avatarTone
                  ? `${member.name} profile image placeholder`
                  : `${member.name} has not added a profile photo`
              }
            >
              {member.initials}
            </div>

            <div className="profile-primary">
              <span className="profile-availability">
                <i aria-hidden="true" />
                Sample member profile
              </span>
              <h1>{member.name}</h1>
              <p className="profile-headline">{member.headline}</p>
              <p className="profile-location">
                {member.location} <span aria-hidden="true">·</span>{" "}
                {member.classYear}
              </p>
            </div>

            <div className="profile-link-actions" aria-label="Member links">
              {member.links.map((link, index) => (
                <a
                  className={
                    index === 0
                      ? "profile-link profile-link--primary"
                      : "profile-link"
                  }
                  href={link.href}
                  key={link.href}
                  target={link.kind === "email" ? undefined : "_blank"}
                  rel={link.kind === "email" ? undefined : "noreferrer"}
                >
                  <HackIcon name={linkIcons[link.kind]} size={17} />
                  {index === 0 ? "View my work" : link.label}
                  {link.kind !== "email" ? (
                    <HackIcon name="external" size={14} />
                  ) : null}
                </a>
              ))}
            </div>
          </div>
        </header>

        <div className="profile-layout">
          <div className="profile-main-column">
            <section className="portfolio-section profile-about">
              <header className="portfolio-section-heading">
                <div>
                  <span className="section-kicker">About</span>
                  <h2>Who I am and what I care about</h2>
                </div>
              </header>
              <p>{member.introduction}</p>
            </section>

            <section className="portfolio-section profile-projects">
              <header className="portfolio-section-heading">
                <div>
                  <span className="section-kicker">Project work</span>
                  <h2>Things I helped make</h2>
                </div>
                <span className="section-count">
                  {projects.length}{" "}
                  {projects.length === 1 ? "project" : "projects"}
                </span>
              </header>

              <div className="profile-project-list">
                {projects.map((project) => {
                  const contribution = getMemberContribution(
                    project,
                    member.slug,
                  );

                  return (
                    <Link
                      className="profile-project-card"
                      href={`/projects/${project.slug}`}
                      key={project.slug}
                    >
                      <ProjectVisual project={project} compact />
                      <div className="profile-project-copy">
                        <div className="profile-project-title">
                          <div>
                            <span>
                              {project.type} · {project.year}
                            </span>
                            <h3>{project.title}</h3>
                          </div>
                          <HackIcon name="right-caret" size={20} />
                        </div>
                        <p>{project.summary}</p>
                        {contribution ? (
                          <div className="contribution-summary">
                            <strong>{contribution.role}</strong>
                            <span>{contribution.contribution}</span>
                          </div>
                        ) : null}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="profile-side-column" aria-label="Member details">
            <section className="portfolio-section">
              <span className="section-kicker">Interested in</span>
              <div className="profile-tag-list">
                {member.interests.map((interest, index) => (
                  <span key={`${interest}-${index}`}>{interest}</span>
                ))}
              </div>
            </section>

            <section className="portfolio-section profile-compact-section">
              <span className="section-kicker">Can help with</span>
              <ul className="profile-detail-list">
                {member.skills.map((skill, index) => (
                  <li key={`${skill}-${index}`}>
                    <HackIcon name="checkbox-checked" size={16} />
                    {skill}
                  </li>
                ))}
              </ul>
            </section>

            <section className="portfolio-section profile-compact-section">
              <span className="section-kicker">Currently learning</span>
              <ul className="profile-detail-list">
                {member.learning.map((topic, index) => (
                  <li key={`${topic}-${index}`}>
                    <HackIcon name="bolt" size={16} />
                    {topic}
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </SiteShell>
  );
}
