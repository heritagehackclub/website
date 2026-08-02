"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useColorMode } from "theme-ui";
import { HackIcon } from "@/components/ui/hack-icon";

const navItems = [
  { href: "/#home", label: "Home", icon: "home" as const },
  { href: "/#projects", label: "Projects", icon: "grid" as const },
  { href: "/#people", label: "People", icon: "profile" as const },
  {
    href: "/how-it-works",
    label: "How it works",
    icon: "idea" as const,
  },
  { href: "/#about", label: "About", icon: "info" as const },
];

const instagramUrl = "https://www.instagram.com/heritagehackclub/";
const clubEmail = "heritagehackclub@gmail.com";
const profileApplicationUrl =
  process.env.NEXT_PUBLIC_PROFILE_APPLICATION_URL?.trim() ||
  `mailto:${clubEmail}?subject=Heritage%20Hack%20Club%20profile%20application`;
const profileApplicationIsForm = profileApplicationUrl.startsWith("http");

export function SiteShell({
  children,
  current = "Home",
  showTopbar = true,
}: {
  children: ReactNode;
  current?: string;
  showTopbar?: boolean;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [drawerX, setDrawerX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [colorMode, setColorMode] = useColorMode();
  const [searchOpen, setSearchOpen] = useState(false);
  const [instantSearch, setInstantSearch] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const searchDialogRef = useRef<HTMLDialogElement>(null);
  const dragStart = useRef(0);
  const dragCurrent = useRef(0);

  const closeDrawer = (restoreFocus = true) => {
    setDrawerOpen(false);
    setDrawerX(0);
    if (restoreFocus) {
      requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  };

  const openSearch = (fromKeyboard = false) => {
    setInstantSearch(fromKeyboard);
    setSearchOpen(true);
  };

  useEffect(() => {
    if (!drawerOpen) return;

    const sidebar = sidebarRef.current;
    const discovered = Array.from(
      sidebar?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );
    const closeButton = sidebar?.querySelector<HTMLElement>(".sidebar-close");
    const focusable = closeButton
      ? [
          closeButton,
          ...discovered.filter((element) => element !== closeButton),
        ]
      : discovered;
    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDrawer();
        return;
      }

      if (event.key !== "Tab" || !focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [drawerOpen]);

  useEffect(() => {
    const handleSearchShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch(true);
      }
    };

    document.addEventListener("keydown", handleSearchShortcut);
    return () => document.removeEventListener("keydown", handleSearchShortcut);
  }, []);

  useEffect(() => {
    const dialog = searchDialogRef.current;
    if (searchOpen && !dialog?.open) {
      dialog?.showModal();
      requestAnimationFrame(() => dialog?.querySelector("input")?.focus());
    } else if (!searchOpen && dialog?.open) {
      dialog.close();
    }
  }, [searchOpen]);

  const beginDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (!drawerOpen || (event.target as HTMLElement).closest("button, a"))
      return;
    dragStart.current = event.clientX;
    dragCurrent.current = event.clientX;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (!dragging) return;
    dragCurrent.current = event.clientX;
    setDrawerX(Math.min(0, event.clientX - dragStart.current));
  };

  const finishDrag = () => {
    if (!dragging) return;
    setDragging(false);
    const distance = dragCurrent.current - dragStart.current;
    if (distance < -70) closeDrawer();
    else setDrawerX(0);
  };

  const isDark = colorMode === "dark";

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
  }, [isDark]);

  return (
    <div className="site-shell" data-sidebar-collapsed={sidebarCollapsed}>
      <nav aria-label="Skip navigation">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
      </nav>

      <header className="mobile-bar">
        <button
          ref={menuButtonRef}
          className="icon-button"
          type="button"
          aria-label="Open navigation"
          aria-expanded={drawerOpen}
          aria-controls="site-sidebar"
          onClick={() => setDrawerOpen(true)}
        >
          <HackIcon name="menu" />
        </button>
        <Link className="mobile-wordmark" href="/">
          Heritage <span>Hack Club</span>
        </Link>
        <button
          className="icon-button"
          type="button"
          aria-label="Search"
          onClick={() => openSearch()}
        >
          <HackIcon name="search" />
        </button>
      </header>

      <button
        className="drawer-scrim"
        type="button"
        aria-label="Close navigation"
        data-open={drawerOpen}
        onClick={() => closeDrawer()}
      />

      <aside
        id="site-sidebar"
        ref={sidebarRef}
        className="site-sidebar"
        aria-label="Primary navigation"
        data-open={drawerOpen}
        data-dragging={dragging}
        style={{ "--drawer-x": `${drawerX}px` } as React.CSSProperties}
      >
        <div
          className="drawer-drag-handle"
          aria-hidden="true"
          onPointerDown={beginDrag}
          onPointerMove={moveDrag}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
        />
        <div className="brand-lockup">
          <button
            className="icon-button sidebar-collapse"
            type="button"
            aria-label={
              sidebarCollapsed ? "Expand navigation" : "Collapse navigation"
            }
            aria-expanded={!sidebarCollapsed}
            onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
          >
            <HackIcon name="menu" size={22} />
          </button>
          <Link
            className="brand-signature"
            href="/"
            aria-label="Heritage Hack Club home"
          >
            <span className="brand-flag" aria-hidden="true">
              <Image
                src="https://assets.hackclub.com/flag-standalone.svg"
                alt=""
                width={77}
                height={27}
                priority
              />
            </span>
            <span className="brand-name">
              <strong>Heritage</strong>
              <small>Hack Club</small>
            </span>
          </Link>
          <button
            className="icon-button sidebar-close"
            type="button"
            aria-label="Close navigation"
            onClick={() => closeDrawer()}
          >
            <HackIcon name="menu" size={22} />
          </button>
        </div>

        <nav aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              className="nav-item"
              data-active={current === item.label}
              href={item.href}
              key={item.label}
              aria-current={current === item.label ? "page" : undefined}
              onClick={() => closeDrawer(false)}
            >
              <HackIcon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-utility-links" aria-label="Club utilities">
          <a href={profileApplicationUrl}>
            <HackIcon name="profile-add" size={19} />
            <span>Apply for a profile</span>
          </a>
          <a href={instagramUrl} target="_blank" rel="noreferrer">
            <HackIcon name="instagram" size={19} />
            <span>@heritagehackclub</span>
          </a>
          <a href={`mailto:${clubEmail}`}>
            <HackIcon name="email" size={19} />
            <span>Email the club</span>
          </a>
          <Link href="/admin">
            <HackIcon name="admin" size={19} />
            <span>Admin editor</span>
          </Link>
        </div>

        <div className="sidebar-footer">
          <button
            className="appearance-toggle"
            type="button"
            onClick={() => setColorMode(isDark ? "light" : "dark")}
          >
            <HackIcon name={isDark ? "sun" : "moon"} />
            <span>{isDark ? "Light appearance" : "Dark appearance"}</span>
          </button>
          <p>Student-led at Heritage. Part of the Hack Club community.</p>
        </div>
      </aside>

      <div className="shell-content">
        {showTopbar ? (
          <header className="desktop-topbar">
            <div
              className="topbar-contact"
              aria-label="Heritage Hack Club contact information"
            >
              <a href={instagramUrl} target="_blank" rel="noreferrer">
                <HackIcon name="instagram" size={17} />
                <span>@heritagehackclub</span>
              </a>
              <a href={`mailto:${clubEmail}`}>
                <HackIcon name="email" size={17} />
                <span>{clubEmail}</span>
              </a>
            </div>

            <div className="topbar-actions">
              <a
                className="topbar-apply"
                href={profileApplicationUrl}
                target={profileApplicationIsForm ? "_blank" : undefined}
                rel={profileApplicationIsForm ? "noreferrer" : undefined}
              >
                <HackIcon name="profile-add" size={17} />
                Apply for a profile
              </a>
              <Link className="topbar-admin" href="/admin">
                <HackIcon name="admin" size={17} />
                Admin
              </Link>
              <button
                className="topbar-search"
                type="button"
                aria-label="Search"
                onClick={() => openSearch()}
              >
                <HackIcon name="search" size={17} />
                <span>Search</span>
                <kbd>Ctrl K</kbd>
              </button>
            </div>
          </header>
        ) : null}
        <main id="main-content">{children}</main>
      </div>

      <dialog
        ref={searchDialogRef}
        className="search-dialog"
        data-instant={instantSearch}
        aria-labelledby="search-title"
        onClose={() => setSearchOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div className="search-panel">
          <div>
            <HackIcon name="search" />
            <input
              type="search"
              aria-labelledby="search-title"
              placeholder="Search projects and people…"
            />
            <button
              className="icon-button"
              type="button"
              aria-label="Close search"
              onClick={() => searchDialogRef.current?.close()}
            >
              ×
            </button>
          </div>
          <p id="search-title">Site search preview</p>
          <span>Project search becomes live when the database arrives.</span>
        </div>
      </dialog>
    </div>
  );
}
