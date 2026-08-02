"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HackIcon } from "@/components/ui/hack-icon";

const stories = [
  {
    image: "/images/home/campus-entrance.png",
    alt: "The Heritage High School main entrance at dusk",
    title: "Welcome to Heritage Hack Club!",
    titleScale: "standard",
    copy: "A student-led project studio where ideas become useful public work, and every contributor gets visible credit.",
    source: "Club welcome · Main entrance",
    position: "50% 55%",
  },
  {
    image: "/images/home/campus-lawn.png",
    alt: "A wide view of the Heritage High School campus and lawn",
    title: "Build proof for future opportunities",
    titleScale: "compact",
    copy: "Ship websites, bots, films, hardware, designs, and research, then document the decisions and skills behind the result on this very website.",
    source: "Project studio · Work in progress",
    position: "48% 55%",
  },
  {
    image: "/images/home/campus-entrance.png",
    alt: "The Heritage High School main entrance and surrounding campus",
    title: "Make an impact at Heritage",
    titleScale: "standard",
    copy: "Start with a real need at school, test an idea with the people it affects, and build something the community can actually use.",
    source: "Campus demo · Made for Heritage",
    position: "50% 50%",
  },
  {
    image: "/images/home/campus-gym.png",
    alt: "A sunlit academic wing at Heritage High School",
    title: "Everybody deserves credit",
    titleScale: "standard",
    copy: "Coders, designers, researchers, testers, writers, filmmakers, organizers, and presenters all get credit on their projects.",
    source: "Team work session · Built together",
    position: "50% 55%",
  },
  {
    image: "/images/home/campus-theater.png",
    alt: "The Heritage High School theater and stage",
    title: "Present your work at showcases",
    titleScale: "standard",
    copy: "Put your ideas out there and present live! Share your progress and hard work behind your project.",
    source: "Project showcase · Presented live",
    position: "55% 50%",
  },
] as const;

const AUTOPLAY_MS = 6500;

export function HomeStoryCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null);
  const [progressDirection, setProgressDirection] = useState<
    "forward" | "backward"
  >("forward");
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  const show = useCallback(
    (index: number) => {
      const nextIndex = (index + stories.length) % stories.length;

      if (nextIndex === activeIndex) return;

      const forwardDistance =
        (nextIndex - activeIndex + stories.length) % stories.length;
      const backwardDistance =
        (activeIndex - nextIndex + stories.length) % stories.length;

      setLeavingIndex(activeIndex);
      setProgressDirection(
        backwardDistance < forwardDistance ? "backward" : "forward",
      );
      setActiveIndex(nextIndex);
    },
    [activeIndex],
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(media.matches);
    const updateVisibility = () =>
      setPageVisible(document.visibilityState === "visible");

    updateMotionPreference();
    updateVisibility();
    media.addEventListener("change", updateMotionPreference);
    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      media.removeEventListener("change", updateMotionPreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || !pageVisible) return;

    const timer = window.setTimeout(() => show(activeIndex + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, pageVisible, paused, reducedMotion, show]);

  const activeStory = stories[activeIndex];

  return (
    <section
      className="home-story"
      id="home"
      aria-roledescription="carousel"
      aria-label="Heritage Hack Club introduction"
    >
      <div className="home-story-stage">
        {stories.map((story, index) => (
          <div
            className="home-story-slide"
            data-active={index === activeIndex}
            aria-hidden={index !== activeIndex}
            key={story.title}
          >
            <Image
              src={story.image}
              alt={index === activeIndex ? story.alt : ""}
              fill
              priority={index === 0}
              quality={95}
              sizes="(max-width: 760px) 100vw, calc(100vw - 280px)"
              style={{ objectPosition: story.position }}
            />
          </div>
        ))}

        <div className="home-story-wash" aria-hidden="true" />

        <div className="home-story-copy">
          <h1 data-scale={activeStory.titleScale}>{activeStory.title}</h1>
          <p>{activeStory.copy}</p>
          <div className="home-story-actions">
            <Link
              className="public-action public-action--primary"
              href="#projects"
            >
              Explore the work
              <HackIcon name="right-caret" size={18} />
            </Link>
            <Link className="public-action" href="#how">
              Find your part
              <HackIcon name="down" size={18} />
            </Link>
          </div>
        </div>

        <div className="home-story-meta">
          <p aria-live="polite">
            <span>
              0{activeIndex + 1} / 0{stories.length}
            </span>
            Heritage High School · {activeStory.source}
          </p>
          <div className="home-story-controls">
            <button
              type="button"
              aria-label="Previous story"
              onClick={() => show(activeIndex - 1)}
            >
              <HackIcon
                className="home-story-previous-icon"
                name="right-caret"
                size={21}
              />
            </button>
            <button
              type="button"
              aria-label={
                paused ? "Resume automatic slides" : "Pause automatic slides"
              }
              aria-pressed={paused}
              onClick={() => setPaused((isPaused) => !isPaused)}
            >
              <HackIcon
                name={paused ? "play-circle" : "pause-circle"}
                size={22}
              />
            </button>
            <button
              type="button"
              aria-label="Next story"
              onClick={() => show(activeIndex + 1)}
            >
              <HackIcon name="right-caret" size={21} />
            </button>
          </div>
        </div>
      </div>

      <div
        className="home-story-progress"
        aria-label="Choose a story"
        style={{
          gridTemplateColumns: `repeat(${stories.length}, minmax(0, 1fr))`,
        }}
      >
        {stories.map((story, index) => (
          <button
            type="button"
            aria-label={`Show story ${index + 1}: ${story.title}`}
            aria-current={index === activeIndex ? "true" : undefined}
            data-progress-state={
              index === activeIndex
                ? `active-${progressDirection}`
                : index === leavingIndex
                  ? `leaving-${progressDirection}`
                  : "idle"
            }
            onClick={() => show(index)}
            key={story.title}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}
