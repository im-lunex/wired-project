"use client"

import { useEffect, useRef, useState } from "react"

const MARINE_SHIP_ID = "fbb3018c6ed64f36b482beaf12a9598f"
const LUFFY_HAT_ID = "3af7f978b35b49d1a51bf1f3aba90923"
const GEAR5_ID = "59f2d758acc34d8e8389686591f02d3c"
const GITHUB_URL = "https://github.com/im-lunex?tab=repositories"

export type Pr = {
  number: number
  title: string
  repo: string
  state: "open" | "merged"
  url: string
  createdAt: string
  mergedAt: string | null
  comments: number
}

const skills = [
  { name: "LLVM / Clang", role: "Cook", level: 95, num: "Ⅰ" },
  { name: "C / C++", role: "Swordsman", level: 92, num: "Ⅱ" },
  { name: "Rust", role: "Captain", level: 88, num: "Ⅲ" },
  { name: "Kernel", role: "Shipwright", level: 78, num: "IⅤ" },
]

const projects = [
  {
    id: "LOG-001",
    title: "Shark",
    subtitle: "C Kernel from Scratch",
    desc: "A minimal kernel i built for understanding kernel from indise - To be Continued",
    tags: ["C", "ASM", "x86-64"],
    rarity: "Legendary",
    rarityColor: "#8a6a14",
    icon: "⚐",
  },
]

const stats = [
  { v: "3+", l: "Years at Sea" },
  { v: "2", l: "Complex Projects" },
  { v: "∞", l: "Bugs Slain" },
] as const

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

function fmtDate(iso: string | null) {
  if (!iso) return ""
  const d = new Date(iso)
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

function useVantaBirds() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let fx: { destroy(): void } | null = null
    ;(async () => {
      const THREE = await import("three")
      const BIRDS = (await import("vanta/dist/vanta.birds.min.js")).default as (
        o: object,
      ) => { destroy(): void }
      if (!ref.current) return
      fx = BIRDS({
        el: ref.current,
        THREE,
        backgroundAlpha: 0,
        colorMode: "varianceGradient",
        birdSize: 1.1,
        wingSpan: 20,
        speedLimit: 3.6,
        separation: 28,
        alignment: 28,
        cohesion: 28,
        quantity: 0.4,
      })
    })()
    return () => {
      fx?.destroy()
    }
  }, [])
  return ref
}

function Compass({ size = 52, light = false }: { size?: number; light?: boolean }) {
  const ring = light ? "rgba(233, 224, 200, 0.6)" : "rgba(122, 90, 53, 0.55)"
  const needle = light ? "rgba(233, 224, 200, 0.9)" : "rgba(168, 132, 44, 0.95)"
  const nColor = light ? "#e9e0c8" : "#7a5a35"
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden>
      <circle cx="30" cy="30" r="28" fill="none" stroke={ring} strokeWidth="1" />
      <circle
        cx="30"
        cy="30"
        r="20"
        fill="none"
        stroke={ring}
        strokeWidth="0.5"
        strokeDasharray="2 4"
      />
      <polygon points="30,4 27,26 33,26" fill={needle} />
      <polygon points="30,56 27,34 33,34" fill={ring} />
      <polygon points="4,30 26,27 26,33" fill={ring} />
      <polygon points="56,30 34,27 34,33" fill={ring} />
      <circle cx="30" cy="30" r="3.5" fill={needle} />
      <text
        x="30"
        y="17"
        textAnchor="middle"
        fontSize="6"
        fill={nColor}
        fontFamily="serif"
        letterSpacing="0.05em"
      >
        N
      </text>
    </svg>
  )
}

function SectionHeading({ eyebrow, headline }: { eyebrow: string; headline: string }) {
  return (
    <div className="sh">
      <p className="sh-eye">{eyebrow}</p>
      <h2 className="sh-title">{headline}</h2>
      <div className="sh-rule" aria-hidden />
    </div>
  )
}

function ModelFrame({
  id,
  title,
  loading,
  loadingLabel,
  spinner,
  caption,
  frameClass,
  onLoad,
}: {
  id: string
  title: string
  loading: boolean
  loadingLabel: string
  spinner: string
  caption: string
  frameClass: string
  onLoad: () => void
}) {
  return (
    <div className="frame-outer">
      <div className={frameClass}>
        {loading && (
          <div className="hat-loading">
            <span aria-hidden>{spinner}</span>
            <span>{loadingLabel}</span>
          </div>
        )}
        <iframe
          title={title}
          allow="autoplay; fullscreen; xr-spatial-tracking"
          frameBorder="0"
          allowFullScreen
          loading="lazy"
          onLoad={onLoad}
          style={{ width: "100%", height: "100%", display: "block", border: "none" }}
          src={`https://sketchfab.com/models/${id}/embed?autospin=0.5&autostart=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_watermark=0&dnt=1`}
        />
      </div>
      <p className="hat-cap">{caption}</p>
    </div>
  )
}

function Gear5Frame() {
  const [rdy, setRdy] = useState(false)
  return (
    <ModelFrame
      id={GEAR5_ID}
      title="Luffy Gear 5"
      loading={!rdy}
      loadingLabel="Awakening…"
      spinner="☀"
      caption="⊕ Gear 5 · The Sun God · Interactive ⊕"
      frameClass="gear-inner"
      onLoad={() => setRdy(true)}
    />
  )
}

export default function Portfolio({ prs }: { prs: Pr[] }) {
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [prFilter, setPrFilter] = useState<"all" | "merged" | "open">("all")
  const [hatRdy, setHatRdy] = useState(false)
  const birdsRef = useVantaBirds()

  const mergedCount = prs.filter((p) => p.state === "merged").length
  const openCount = prs.length - mergedCount
  const filtered =
    prFilter === "all" ? prs : prs.filter((p) => p.state === prFilter)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true))
    const fn = () => setScrolled(window.scrollY > 55)
    fn()
    window.addEventListener("scroll", fn, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", fn)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    const els = document.querySelectorAll<HTMLElement>(".reveal")
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).dataset.vis = "1"
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08 },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [mounted])

  const goto = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  const nav = [
    { l: "Achievements", id: "achievements" },
    { l: "Logbook", id: "projects" },
    { l: "About", id: "about" },
  ]

  return (
    <div id="top" className="port-root">

      <nav
        className={`pnav${scrolled ? " pnav--shadow" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="pnav-inner">
          <button className="pnav-logo" onClick={() => goto("top")} aria-label="Back to top">
            <Compass size={28} light />
            <span>LUNEX</span>
          </button>

          <div className="pnav-links">
            {nav.map((n) => (
              <button key={n.id} className="pnav-lnk" onClick={() => goto(n.id)}>
                {n.l}
              </button>
            ))}
          </div>

          <button
            className="pnav-ham"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={menuOpen ? "ham-x" : ""} />
            <span className={menuOpen ? "ham-x" : ""} />
            <span className={menuOpen ? "ham-x" : ""} />
          </button>
        </div>

        <div
          className={`pnav-drawer${menuOpen ? " pnav-drawer--open" : ""}`}
          aria-hidden={!menuOpen}
        >
          {nav.map((n) => (
            <button key={n.id} className="pnav-drawer-lnk" onClick={() => goto(n.id)}>
              {n.l}
            </button>
          ))}
        </div>
      </nav>

      <section id="hero" className="phero" aria-label="Hero">

        {mounted && (
          <iframe
            title="One Piece Marine Ship"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            frameBorder="0"
            allowFullScreen
            className="phero-ship"
            src={`https://sketchfab.com/models/${MARINE_SHIP_ID}/embed?autostart=1&preload=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_watermark=0&ui_watermark_link=0&ui_help=0&ui_hint=0&ui_animations=0&ui_annotations=0&ui_vr=0&ui_ar=0&ui_audio=0&ui_general_controls=0&dnt=1`}
          />
        )}

        <div className="phero-birds" ref={birdsRef} aria-hidden />

        <div className="phero-ov phero-ov--grid" aria-hidden />
        <div className="phero-ov phero-ov--core" aria-hidden />
        <div className="phero-ov phero-ov--vignette" aria-hidden />
        <div className="phero-ov phero-ov--top" aria-hidden />
        <div className="phero-ov phero-ov--bottom" aria-hidden />

        <span className="phero-coord phero-coord--l" aria-hidden>
          34°07&prime;N · 139°45&prime;E
        </span>
        <span className="phero-coord phero-coord--r" aria-hidden>
          GRAND LINE · LOG POSE
        </span>

        <div className="phero-content">
          <p className="phero-eye">⟨ East Blue · Grand Line Chronicles ⟩</p>

          <h1 className="phero-name">LUNEX</h1>

          <div className="phero-role-row">
            <span className="phero-line" />
            <span className="phero-role">Compiler Engineer</span>
            <span className="phero-line" />
          </div>

          <p className="phero-desc">
            Forging compilers that sail treacherous waters of optimization. From
            lexer to machine code — no pass too wild, no bug too deep.
          </p>

          <div className="phero-btns">
            <button className="btn-gold" onClick={() => goto("achievements")}>
              View the Bounty Board
            </button>
            <a
              className="btn-ghost"
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub ↗
            </a>
          </div>
        </div>

        <div className="phero-compass" aria-hidden>
          <Compass size={70} light />
        </div>

        <div className="phero-scroll-hint" aria-hidden>
          <span>Scroll</span>
          <span className="phero-arrow">↓</span>
        </div>

        <div className="phero-hint" aria-hidden>
          Drag to orbit · Scroll to zoom
        </div>
      </section>

      <section id="achievements" className="pfeat" aria-label="Achievements">
        <div className="pfeat-bg" aria-hidden />
        <div className="pfeat-contours" aria-hidden />
        <div className="pfeat-wave pfeat-wave--top" aria-hidden />
        <div className="pfeat-wave pfeat-wave--bottom" aria-hidden />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <SectionHeading eyebrow="WANTED · DEAD OR ALIVE" headline="THE BOUNTY BOARD" />

          <div className="pfeat-cols">

            <div className="pfeat-hero reveal">
              <Gear5Frame />
              <div className="gear-plaque">GEAR 5 · THE SUN GOD</div>
              <p className="gear-cap">
                The pirate who conquered the seas — his legend grows with every
                voyage.
              </p>
            </div>

            <div className="pfeat-panel reveal" style={{ "--d": "120ms" } as React.CSSProperties}>
              <div className="pfeat-panel-head">
                <div className="pfeat-panel-titlewrap">
                  <p className="pfeat-panel-title">CONQUESTS OF THE GRAND LINE</p>
                  <p className="pfeat-count">
                    {prs.length} logged · {mergedCount} merged · {openCount} open
                  </p>
                </div>
                <div className="chips" role="group" aria-label="Filter PRs">
                  {(["all", "merged", "open"] as const).map((f) => (
                    <button
                      key={f}
                      className={`chip${prFilter === f ? " chip--on" : ""}`}
                      onClick={() => setPrFilter(f)}
                      aria-pressed={prFilter === f}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="plist-wrap">
                <div className="plist">
                  {filtered.map((p) => (
                    <a
                      key={p.url}
                      className="prow"
                      href={p.url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <span className={`prow-stamp prow-stamp--${p.state}`}>
                        {p.state === "merged" ? "MERGED" : "OPEN"}
                      </span>
                      <span className="prow-main">
                        <span className="prow-title">{p.title}</span>
                        <span className="prow-meta">
                          <span className="prow-repo">{p.repo}</span>
                          <span className="prow-dot" aria-hidden>·</span>
                          <span className="prow-date">
                            {fmtDate(p.state === "merged" ? p.mergedAt : p.createdAt)}
                          </span>
                        </span>
                      </span>
                      <span className="prow-num">#{p.number}</span>
                      <span className="prow-arrow" aria-hidden>↗</span>
                    </a>
                  ))}
                  {filtered.length === 0 && (
                    <div className="plist-empty">
                      <p>The bounty board is empty — fair winds have brought no
                        conquests yet.</p>
                      <a className="plist-empty-link" href={GITHUB_URL} target="_blank" rel="noreferrer noopener">
                        Visit the GitHub account ↗
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section id="projects" className="pprojects" aria-label="Projects">
        <div className="pprojects-grid-bg" aria-hidden />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <SectionHeading eyebrow="Grand Log" headline="THE LOGBOOK" />

          <div className="loglist">
            {projects.map((p, i) => (
              <article
                key={p.id}
                className="logcard reveal"
                style={{ "--d": `${i * 100}ms` } as React.CSSProperties}
              >
                <header className="logcard-head">
                  <span className="logcard-id">{p.id}</span>
                  <span
                    className="logcard-rarity"
                    style={{
                      color: p.rarityColor,
                      borderColor: `${p.rarityColor}66`,
                      background: `${p.rarityColor}0f`,
                    }}
                  >
                    {p.rarity}
                  </span>
                </header>
                <div className="logcard-body">
                  <span className="logcard-icon" aria-hidden>
                    {p.icon}
                  </span>
                  <div className="logcard-main">
                    <h3 className="logcard-title">{p.title}</h3>
                    <p className="logcard-sub">{`// ${p.subtitle}`}</p>
                    <p className="logcard-desc">{p.desc}</p>
                    <div className="logcard-tags">
                      {p.tags.map((t) => (
                        <span key={t} className="logcard-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="pabout" aria-label="About">
        <div className="container">
          <div className="pabout-grid">

            <div className="reveal" style={{ "--d": "0ms" } as React.CSSProperties}>
              <ModelFrame
                id={LUFFY_HAT_ID}
                title="Luffy's Straw Hat"
                loading={!hatRdy}
                loadingLabel="Raising anchor…"
                spinner="⚓"
                caption="⊕ Luffy&rsquo;s Straw Hat · Interactive ⊕"
                frameClass="hat-inner"
                onLoad={() => setHatRdy(true)}
              />
            </div>

            <div className="pabout-bio reveal" style={{ "--d": "130ms" } as React.CSSProperties}>
              <p className="pabout-eye">— The Pirate&rsquo;s Tale —</p>
              <h2 className="pabout-head">About Me</h2>

              <p className="pabout-para">
                I&rsquo;m <strong>Lunex</strong>, a compiler engineer navigating the
                Grand Line of systems programming. I mess with with projects like LLVM, GCC and rust.
              </p>
              <p className="pabout-para">
                My voyage started deep in C++, threading through LLVM internals, IR
                design, etc. Like any seasoned cartographer, I
                chart my own course through undocumented waters and undefined
                behavior.
              </p>

              <div className="pabout-stats">
                {stats.map((s) => (
                  <div key={s.l} className="pabout-stat">
                    <span className="pabout-stat-v">{s.v}</span>
                    <span className="pabout-stat-l">{s.l}</span>
                  </div>
                ))}
              </div>

              <div className="crew-roster">
                <p className="crew-title">— The Crew Manifest —</p>
                <div className="crew-grid">
                  {skills.map((s) => (
                    <div key={s.name} className="crew-item">
                      <span className="crew-num">{s.num}</span>
                      <span className="crew-body">
                        <span className="crew-name">{s.name}</span>
                        <span className="crew-role">{s.role}</span>
                      </span>
                      <span className="crew-pct">{s.level}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="pking" aria-label="Closing statement">
        <div className="pking-bg" aria-hidden />
        <div className="container">
          <div className="pking-inner reveal">
            <div className="pking-rules" aria-hidden>
              <span className="pking-rule" />
              <span className="pking-crest">⚓ ☠ ⚓</span>
              <span className="pking-rule" />
            </div>
            <p className="pking-quote">IM GONNA BE THE FUTURE PIRATE KING</p>
            <p className="pking-sign">— Lunex · im-lunex —</p>
          </div>
        </div>
      </section>

      <footer className="pfooter">
        <Compass size={34} />
        <p className="pfooter-text">
          © 2026 <strong>LUNEX</strong> · Built by Lunex (
          <a href={GITHUB_URL} target="_blank" rel="noreferrer noopener">im-lunex</a>) on
          the Grand Line
        </p>
        <p className="pfooter-skull">⚓ · ☠ · ⚓</p>
      </footer>

    </div>
  )
}
