"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
  Bot,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  Globe,
  MessageSquareText,
  MonitorPlay,
  TrendingUp,
} from "lucide-react"
import {
  landingAccessibility,
  landingAgents,
  landingCta,
  landingFooterColumns,
  landingHero,
  landingNavItems,
  landingPalette,
  landingPrimaryCtas,
  landingStats,
  landingTeacherSupport,
  landingTeacherSupportItems,
  landingTrustLogos,
} from "@/lib/landing-page-content"
import { pageWidthPresets } from "@/lib/layout/page-widths"

const AGENT_ICONS = [BrainCircuit, CalendarDays, Bot] as const
const SUPPORT_ICONS = [TrendingUp, MessageSquareText] as const
const FOOTER_ICONS = [Globe, MonitorPlay, MessageSquareText] as const

export function LandingPage() {
  const prefersReducedMotion = useReducedMotion()
  const [activeSection, setActiveSection] = useState("hero")

  const reveal = useMemo(
    () =>
      prefersReducedMotion
        ? {
            initial: { opacity: 1, y: 0 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.15 },
            transition: { duration: 0 },
          }
        : {
            initial: { opacity: 0, y: 30 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.2 },
            transition: { duration: 0.55 },
          },
    [prefersReducedMotion]
  )

  useEffect(() => {
    if (prefersReducedMotion) return

    const sections = landingNavItems
      .map((item) => document.getElementById(item.sectionId))
      .filter((section): section is HTMLElement => Boolean(section))

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id)
        }
      },
      {
        rootMargin: "-25% 0px -45% 0px",
        threshold: [0.2, 0.35, 0.5, 0.7],
      }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [prefersReducedMotion])

  function handleNavClick(sectionId: string) {
    const target = document.getElementById(sectionId)
    if (!target) return

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    })
  }

  const shellStyle = { maxWidth: `${pageWidthPresets.landing.maxWidth}px` }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-[color:rgba(242,231,214,0.82)] backdrop-blur-xl">
        <div className={`mx-auto flex w-full items-center justify-between gap-6 py-4 ${pageWidthPresets.landing.shellClassName}`} style={shellStyle}>
          <div className="font-heading text-xl font-bold tracking-tighter text-primary">
            WellStudy AI
          </div>

          <div className="hidden items-center gap-8 md:flex">
            {landingNavItems.map((item) => {
              const isActive = activeSection === item.sectionId

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item.sectionId)}
                  className={`relative pb-1 font-heading text-sm tracking-tight transition-colors ${
                    isActive ? "font-bold text-primary" : "text-foreground hover:text-secondary"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full bg-secondary transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-4">
            <button className="font-heading text-sm font-semibold text-foreground transition-colors hover:text-secondary">
              Sign In
            </button>
            <Link
              href={landingPrimaryCtas[0].href}
              className="rounded-lg px-6 py-2.5 font-heading text-sm font-semibold text-primary-foreground transition-[transform,opacity] duration-300 hover:-translate-y-0.5 hover:opacity-90"
              style={{
                backgroundImage: `linear-gradient(135deg, ${landingPalette.primarySurface}, ${landingPalette.primarySurfaceStrong})`,
              }}
            >
              {landingPrimaryCtas[0].label}
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        <motion.section
          id="hero"
          className={`relative overflow-hidden py-24 lg:py-36 ${pageWidthPresets.landing.shellClassName}`}
          style={{
            background: `radial-gradient(circle at top right, ${landingPalette.accent}22, transparent 26%), radial-gradient(circle at left 15%, ${landingPalette.primarySurface}1f, transparent 28%), linear-gradient(180deg, #fbf7f1 0%, ${landingPalette.neutralWarm} 100%)`,
          }}
          {...reveal}
        >
          <div className="mx-auto grid grid-cols-1 items-center gap-20 lg:grid-cols-12" style={shellStyle}>
            <motion.div
              className="z-10 lg:col-span-7"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <span className="inline-block rounded-full bg-secondary/16 px-4 py-1.5 font-sans text-[0.7rem] font-bold uppercase tracking-[0.24em] text-secondary">
                {landingHero.badge}
              </span>

              <h1 className="mt-6 max-w-5xl font-heading text-5xl font-extrabold leading-[1.02] tracking-tight text-primary lg:text-7xl">
                Personalized <span className="text-secondary">{landingHero.titleAccent}</span> for Every Learner
                in Vietnam. Meet Your AI Twin.
              </h1>

              <p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
                {landingHero.description}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={landingPrimaryCtas[0].href}
                  className="rounded-lg px-10 py-4 text-center font-heading text-lg font-bold text-primary-foreground shadow-[0_16px_48px_-12px_rgba(22,53,76,0.42)] transition-[transform,opacity] duration-300 hover:-translate-y-1 hover:opacity-95"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${landingPalette.primarySurface}, ${landingPalette.primarySurfaceStrong})`,
                  }}
                >
                  Start Learning for Free
                </Link>
                <button
                  type="button"
                  onClick={() => handleNavClick("programs")}
                  className="rounded-lg border border-[color:rgba(22,53,76,0.12)] bg-[color:rgba(255,255,255,0.58)] px-10 py-4 text-center font-heading text-lg font-bold text-primary transition-all duration-300 hover:-translate-y-1 hover:border-[color:rgba(215,139,73,0.35)] hover:text-secondary"
                >
                  {landingPrimaryCtas[1].label}
                </button>
              </div>

              <div className="mt-16 grid grid-cols-3 gap-8 border-l-2 border-border/40 pl-8">
                {landingStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className={`font-heading text-3xl font-extrabold ${index === 2 ? "text-secondary" : "text-primary"}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm uppercase tracking-tight text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative lg:col-span-5"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 36, scale: 0.97 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.08 }}
            >
              <motion.div
                className="relative aspect-square w-full overflow-hidden rounded-[2rem] shadow-[0_18px_56px_-18px_rgba(22,53,76,0.4)]"
                whileHover={prefersReducedMotion ? undefined : { y: -8, rotate: -0.4 }}
                transition={{ duration: 0.35 }}
              >
                <img
                  alt={landingHero.imageAlt}
                  className="h-full w-full object-cover"
                  src={landingHero.imageSrc}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,53,76,0.06),rgba(22,53,76,0.18))]" />
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -left-6 max-w-[240px] rounded-xl bg-[color:rgba(255,251,245,0.96)] p-6 shadow-[0_16px_48px_-14px_rgba(22,53,76,0.28)]"
                whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {landingHero.liveLabel}
                  </span>
                </div>
                <p className="text-sm leading-tight text-foreground">{landingHero.liveText}</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          id="partners"
          className="py-20"
          style={{ background: `linear-gradient(180deg, ${landingPalette.neutralWarm}, rgba(255,255,255,0.92))` }}
          {...reveal}
        >
          <div className={`mx-auto ${pageWidthPresets.landing.shellClassName}`} style={shellStyle}>
            <p className="mb-12 text-center text-[0.7rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Trusted by Institutional Leaders
            </p>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-70 transition-all duration-500 md:gap-24">
              {landingTrustLogos.map((logo, index) => (
                <motion.span
                  key={logo}
                  className="font-heading text-xl font-extrabold text-primary"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  whileHover={prefersReducedMotion ? undefined : { y: -4, color: landingPalette.accent }}
                >
                  {logo}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          id="architecture"
          className={`py-28 lg:py-32 ${pageWidthPresets.landing.shellClassName}`}
          style={{
            background: `linear-gradient(180deg, ${landingPalette.primarySurface} 0%, ${landingPalette.primarySurfaceStrong} 100%)`,
          }}
          {...reveal}
        >
          <div className="mx-auto" style={shellStyle}>
            <div className="mb-20 max-w-3xl">
              <h2 className="font-heading text-4xl font-extrabold text-[#f8efe3] lg:text-5xl">
                The AI Twin Architecture
              </h2>
              <p className="mt-6 text-xl text-[#d6c8b8]">
                The Multi-Agent AI Twin is our core breakthrough: three specialized intelligence agents working in concert to create a seamless, 24/7 Virtual Teacher for every student.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
              {landingAgents.map((agent, index) => {
                const Icon = AGENT_ICONS[index]
                const iconWrapClass =
                  index === 0
                    ? "bg-primary/12 text-primary"
                    : index === 1
                      ? "bg-secondary/16 text-secondary"
                      : "bg-emerald-400/18 text-emerald-700"

                return (
                  <motion.article
                    key={agent.title}
                    className="rounded-xl border border-white/8 bg-[color:rgba(255,248,240,0.92)] p-8 shadow-[0_18px_56px_-18px_rgba(0,0,0,0.3)] md:col-span-4"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
                    whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    whileHover={prefersReducedMotion ? undefined : { y: -10 }}
                  >
                    <div className={`mb-10 flex h-14 w-14 items-center justify-center rounded-lg ${iconWrapClass}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-primary">{agent.title}</h3>
                    <p className="mb-8 mt-4 leading-relaxed text-muted-foreground">{agent.description}</p>
                    <div className="rounded-r-lg border-l-[3px] border-secondary bg-muted/50 p-4">
                      <p className="mb-1 text-xs text-secondary">{agent.insightLabel}</p>
                      <p className="text-sm font-medium italic text-foreground">{agent.insightText}</p>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </motion.section>

        <motion.section
          className={`py-28 lg:py-32 ${pageWidthPresets.landing.shellClassName}`}
          style={{ background: `linear-gradient(180deg, #fbf7f1 0%, ${landingPalette.neutralWarm} 100%)` }}
          {...reveal}
        >
          <div className="mx-auto grid grid-cols-1 items-center gap-28 lg:grid-cols-2" style={shellStyle}>
            <motion.div
              className="order-2 lg:order-1"
              whileHover={prefersReducedMotion ? undefined : { y: -6 }}
              transition={{ duration: 0.35 }}
            >
              <div className="relative aspect-video overflow-hidden rounded-2xl shadow-[0_14px_48px_-14px_rgba(22,53,76,0.22)]">
                <img
                  alt={landingTeacherSupport.imageAlt}
                  className="h-full w-full object-cover"
                  src={landingTeacherSupport.imageSrc}
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
                <div className="glass-panel absolute bottom-6 right-6 rounded-lg p-4 text-primary">
                  <div className="font-heading text-3xl font-bold">{landingTeacherSupport.metricValue}</div>
                  <div className="text-xs uppercase">{landingTeacherSupport.metricLabel}</div>
                </div>
              </div>
            </motion.div>

            <div className="order-1 lg:order-2">
              <h2 className="font-heading text-4xl font-extrabold leading-tight text-primary lg:text-5xl">
                Empowering the <span className="text-secondary">{landingTeacherSupport.accent}</span> of the Classroom.
              </h2>
              <p className="mb-12 mt-8 text-lg leading-relaxed text-muted-foreground">
                {landingTeacherSupport.description}
              </p>
              <ul className="space-y-8">
                {landingTeacherSupportItems.map((item, index) => {
                  const Icon = SUPPORT_ICONS[index]

                  return (
                    <motion.li
                      key={item.title}
                      className="flex gap-6"
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
                      whileHover={prefersReducedMotion ? undefined : { x: 6 }}
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_24px_-10px_rgba(22,53,76,0.5)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="mb-1 text-lg font-bold text-primary">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </motion.li>
                  )
                })}
              </ul>
            </div>
          </div>
        </motion.section>

        <motion.section
          id="programs"
          className={`py-28 lg:py-32 ${pageWidthPresets.landing.shellClassName}`}
          style={{ background: `linear-gradient(180deg, ${landingPalette.neutralWarm} 0%, #fbf7f1 100%)` }}
          {...reveal}
        >
          <div className="mx-auto" style={shellStyle}>
            <motion.div
              className="relative overflow-hidden rounded-[2.5rem] px-8 py-12 text-primary-foreground lg:px-20 lg:py-24"
              style={{
                background: `linear-gradient(135deg, ${landingPalette.primarySurface} 0%, ${landingPalette.primarySurfaceStrong} 100%)`,
              }}
              whileHover={prefersReducedMotion ? undefined : { y: -4 }}
              transition={{ duration: 0.35 }}
            >
              <div className="relative z-10 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                <div>
                  <h2 className="font-heading text-4xl font-extrabold tracking-tight lg:text-6xl">
                    {landingAccessibility.title}
                  </h2>
                  <p className="mt-8 text-xl leading-relaxed text-primary-foreground/85">
                    {landingAccessibility.description}
                  </p>
                  <div className="mt-10 flex flex-wrap gap-8">
                    {landingAccessibility.items.map((item, index) => (
                      <motion.div
                        key={item}
                        className="flex items-center gap-3"
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.35, delay: index * 0.06 }}
                      >
                        <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                        <span className="font-medium">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="hidden lg:block">
                  <div className="flex aspect-square items-center justify-center rounded-full border border-white/10 bg-primary-foreground/8 p-12">
                    <motion.div
                      className="h-full w-full rounded-full bg-secondary/20 backdrop-blur-3xl"
                      animate={prefersReducedMotion ? undefined : { scale: [1, 1.06, 1], opacity: [0.65, 0.9, 0.65] }}
                      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </div>

              <div
                className="absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
                style={{ backgroundColor: `${landingPalette.accent}33` }}
              />
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          id="cta"
          className={`py-28 text-center lg:py-32 ${pageWidthPresets.landing.shellClassName}`}
          style={{ background: `linear-gradient(180deg, #fbf7f1 0%, ${landingPalette.neutralWarm} 100%)` }}
          {...reveal}
        >
          <div className="mx-auto max-w-3xl">
            <h2 className="font-heading text-4xl font-extrabold text-primary lg:text-5xl">
              {landingCta.title}
            </h2>
            <p className="mb-12 mt-6 text-xl text-muted-foreground">{landingCta.description}</p>
            <div className="flex flex-col justify-center gap-6 sm:flex-row">
              <Link
                href={landingPrimaryCtas[2].href}
                className="rounded-lg px-12 py-5 font-heading text-xl font-extrabold text-primary-foreground shadow-[0_16px_48px_-14px_rgba(22,53,76,0.38)] transition-transform duration-300 hover:-translate-y-1"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${landingPalette.primarySurface}, ${landingPalette.primarySurfaceStrong})`,
                }}
              >
                {landingPrimaryCtas[2].label}
              </Link>
              <button
                type="button"
                onClick={() => handleNavClick("partners")}
                className="rounded-lg px-12 py-5 font-heading text-xl font-extrabold text-primary transition-[transform,opacity] duration-300 hover:-translate-y-1 hover:opacity-92"
                style={{ backgroundColor: landingPalette.accentSoft }}
              >
                {landingPrimaryCtas[3].label}
              </button>
            </div>
          </div>
        </motion.section>
      </main>

      <footer
        className="w-full border-t border-border/20"
        style={{ background: `linear-gradient(180deg, ${landingPalette.primarySurfaceStrong} 0%, #0d1d29 100%)` }}
      >
        <div className={`mx-auto grid grid-cols-1 gap-12 py-16 md:grid-cols-4 ${pageWidthPresets.landing.shellClassName}`} style={shellStyle}>
          <div className="md:col-span-1">
            <div className="mb-4 font-heading text-lg font-bold text-[#f5e8d8]">WellStudy AI</div>
            <p className="mb-6 text-sm leading-relaxed text-[#d0c0af]">
              Empowering Vietnam&apos;s Digital Education through sovereign AI and multi-agent intelligence.
            </p>
            <div className="flex gap-4 text-[#d78b49]">
              {FOOTER_ICONS.map((Icon, index) => (
                <motion.div key={index} whileHover={prefersReducedMotion ? undefined : { y: -4 }}>
                  <Icon className="h-5 w-5 cursor-pointer" />
                </motion.div>
              ))}
            </div>
          </div>

          {landingFooterColumns.map((column) => (
            <div key={column.title}>
              <h5 className="mb-6 font-heading font-bold text-[#f5e8d8]">{column.title}</h5>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      className="text-sm text-[#d0c0af] transition-all hover:text-[#f0d3b5] hover:underline"
                      href="#"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`mx-auto border-t border-white/8 py-8 text-center ${pageWidthPresets.landing.shellClassName}`} style={shellStyle}>
          <p className="text-sm text-[#d0c0af]">
            © 2024 WellStudy AI. Empowering Vietnam&apos;s Digital Education.
          </p>
        </div>
      </footer>
    </div>
  )
}
