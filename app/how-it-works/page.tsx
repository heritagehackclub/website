import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/shell/site-shell";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How Heritage Hack Club uses lunch meetings, shared projects, and public credit to help students turn ideas and skills into work they can show.",
};

const applicationUrl =
  process.env.NEXT_PUBLIC_PROFILE_APPLICATION_URL?.trim() ||
  "mailto:heritagehackclub@gmail.com?subject=Heritage%20Hack%20Club%20profile%20application";

export default function HowItWorksPage() {
  return (
    <SiteShell current="How it works">
      <article className="how-page">
        <header className="how-intro">
          <nav className="public-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">How it works</span>
          </nav>
          <span className="section-kicker">Heritage Hack Club</span>
          <h1>A place to make real projects with a team</h1>
          <p>
            Heritage Hack Club is a student project community and a chapter of
            Hack Club, a global nonprofit network of high school coding clubs.
            We meet at lunch to bring all sorts of different people in the same
            room to talk about their ideas.
          </p>
          <p>
            You can come in any meeting with a project, a rough idea, a skill
            you already have, or nothing at all!
          </p>
        </header>

        <div className="how-layout">
          <aside className="how-contents" aria-label="On this page">
            <p>On this page</p>
            <a href="#lunch">What lunch is for</a>
            <a href="#projects">How projects grow</a>
            <a href="#future">What you can take with you</a>
            <a href="#community">How the club grows</a>
            <a className="how-contents-join" href={applicationUrl}>
              Apply for a profile
            </a>
          </aside>

          <div className="how-prose">
            <section id="lunch">
              <h2>What lunch is for</h2>
              <p>
                Lunch is the club&apos;s shared working time. 30 minutes or less
                is too short for every meeting to be a full coding lesson, and
                it would also be quite boring. But it&apos;s definitely long
                enough to make a pitch deck on PowerPoint, find someone who can
                help, test something, or finish a small piece of work.
              </p>
              <p>
                Some students will continue building their projects at home or
                over a call. While others have sports, jobs, family
                responsibilities, difficult classes, and other commitments. We
                believe a member who can only give lunch once a week should
                still be able to contribute and get on our website!
              </p>

              <ul className="how-lunch-work">
                <li>Brainstorm together</li>
                <li>Make a pitch deck with friends</li>
                <li>Ask for honest feedback</li>
                <li>Find collaborators</li>
                <li>Test other people&apos;s work</li>
              </ul>

              <p>
                Most of the lunch time should be for the project tables and the
                work there. Before leaving, each table records what changed and
                what should happen next. It could be a single finished slide,
                three interview notes, a revised design, a plan, or a working
                feature.
              </p>
            </section>

            <section id="projects">
              <h2>How a project can grow far past one lunch</h2>
              <p>
                A project can begin with someone saying, &quot;It would be
                really cool if this existed...&quot; Then their team might start
                doing a few interviews and start creating a pitch deck and put
                it on this website. With the pitch deck, a builder can make it
                work as it was designed. The testers can then find the weakest
                parts of it and with that advice, the team could keep revising
                until it&apos;s perfect, and they have an excellent project for
                their portfolio.
              </p>

              <ol className="how-project-path">
                <li>
                  <strong>Find something worth working on</strong>
                  <p>Bring a personal project or pitch a new idea</p>
                </li>
                <li>
                  <strong>Make the idea understandable</strong>
                  <p>
                    Research it, ask people what they need, create a pitch deck
                  </p>
                </li>
                <li>
                  <strong>Build with different strengths</strong>
                  <p>
                    Divide the work between the people who want to design,
                    build, write, organize, test, document, and present it
                  </p>
                </li>
                <li>
                  <strong>Put it in front of people</strong>
                  <p>
                    Test it with students, show it at a meeting, or ask the
                    school for a small pilot when the project is ready
                  </p>
                </li>
                <li>
                  <strong>Publish the result and the process</strong>
                  <p>
                    Record what happened, what changed, what is still
                    unfinished, exactly what each contributor did, and maybe
                    even present at a showcase
                  </p>
                </li>
              </ol>

              <p>
                The project could be a website, bot, film, design, event,
                hardware build, research project, presentation, or school
                resource. It could grow into something students actually use, or
                a competition entry, or an event with people outside the club.
              </p>
              <p>
                Our lunch time keeps the team connected while that longer work
                unfolds. A member who misses a week should be able to read the
                project update, see what help is needed, and return without
                feeling like they missed out.
              </p>
            </section>

            <section id="future">
              <h2>What you can take with you</h2>
              <p>
                Wanting something meaningful for an activities list, portfolio,
                application, interview, or resume is a completely reasonable
                reason to join. Our role as a club for you is to be a structure
                in which you could take on real responsibilities and the
                evidence would be clearly documented.
              </p>

              <ul
                className="how-evidence"
                aria-label="Examples of contribution evidence"
              >
                <li>
                  A researcher could point to the interviews that changed a
                  project&apos;s direction and the proposal built from those
                  results.
                </li>
                <li>
                  A designer could show early drafts, explain feedback, and show
                  how the final version became easier for students to use.
                </li>
                <li>
                  A builder could explain the feature they owned, what they
                  debugged, and how people used the finished project.
                </li>
                <li>
                  A tester could document the problems they found, the test they
                  ran, and the changes the team made because of their report.
                </li>
                <li>
                  A project lead could show how they set up the work, recruited
                  a team, and brought the project to where it is now.
                </li>
                <li>
                  An organizer or storyteller could document an event, publish a
                  case study, prepare a public presentation, and make every
                  contributor&apos;s work understandable to an outside audience.
                </li>
              </ul>

              <p>
                Everybody deserves public credit for their hard work! The person
                who tested five versions, organized the interviews, rebuilt a
                presentation, or kept the team&apos;s notes should definitely
                get credit.
              </p>
            </section>

            <section id="community">
              <h2>How the club grows</h2>
              <p>
                A club focused on one lesson at a time would only ever attract
                students who actually want that lesson. But, a{" "}
                <em>project community</em> gives you way more freedom. One
                student could be there because they want to build an app, and
                another could just want feedback on their film. There could be
                another student who likes making slides in class, meeting new
                people, testing products, or planning events.
              </p>
              <p>
                A project community like us is meant to be a unit. We
                wouldn&apos;t want any of these different motives to be
                competing to become a project. In fact, having more members with
                different skills and intentions gives the projects more of
                what&apos;s needed.
              </p>
              <p>
                This website is a project archive and a big public record of
                everything we made at our club. Over time, one team&apos;s notes
                and mistakes and advice can help the next team with their
                project.
              </p>
              <p>
                The long-term goal for this is a club that can keep making
                things and running even when the people who started this and
                projects itself change, and <em>anybody</em> can easily
                contribute.
              </p>
            </section>

            <section id="join" className="how-close">
              <h2>Bring what you have now</h2>
              <p>
                Bring the note in your phone, the half-made prototype, the skill
                you want to use, or the questions you have. And bring all your
                friends!
              </p>
              <div>
                <a
                  className="profile-link profile-link--primary"
                  href={applicationUrl}
                >
                  Apply for a profile
                </a>
                <Link className="profile-link" href="/#projects">
                  Explore current projects
                </Link>
              </div>
            </section>
          </div>
        </div>
      </article>
    </SiteShell>
  );
}
