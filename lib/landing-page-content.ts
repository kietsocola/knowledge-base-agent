export const landingNavItems = [
  { label: "Solutions", href: "#hero", sectionId: "hero" },
  { label: "Features", href: "#architecture", sectionId: "architecture" },
  { label: "University Partners", href: "#partners", sectionId: "partners" },
  { label: "Pricing", href: "#cta", sectionId: "cta" },
] as const

export const landingPalette = {
  primarySurface: "#16354c",
  primarySurfaceStrong: "#102838",
  accent: "#d78b49",
  accentSoft: "#f0d3b5",
  neutralWarm: "#f2e7d6",
} as const

export const landingLayout = {
  shellMaxWidth: 1680,
} as const

export const landingHero = {
  badge: "National Scale Innovation",
  title: "Personalized Intelligence for Every Learner in Vietnam. Meet Your AI Twin.",
  titleAccent: "Intelligence",
  description:
    "Accessible Excellence. Democratizing high-fidelity AI tutoring for students from Hanoi to the Mekong Delta. Built for the National Curriculum.",
  imageAlt: "Multi-Agent AI Twin System",
  imageSrc:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCq4N8SDWshfv8gvUX8WfzDWWOhW_N4UNXGpxh1BwEVe5Cw_7nH7Z0a7r24IUPZj3SKf4fXZGJfV50uaQa7OMqWSFr3lt9HBVCWl770QOEOpejb6iXNnrqreGYJ03lVpz_lSISbI95cTaFcLajbDvq5-p_A81jfj3OW0y0z48P6SxPFgiHg-D7PpZrf4-GsIkOsLTumubVITipDCiMoOez_ndFaBEQpoDp8oaUkVX5szlPkP9Drh0Z9PI9rxnEPFoA7NNw1N1R_wL1J",
  liveLabel: "Live AI Active",
  liveText: "Optimizing curriculum for 1,200 rural schools today.",
}

export const landingPrimaryCtas = [
  { label: "Get Started", href: "/portal" },
  { label: "View National Programs", href: "#programs" },
  { label: "Create Your Student Twin", href: "/portal" },
  { label: "University Partnerships", href: "#partners" },
] as const

export const landingStats = [
  { value: "45k+", label: "Active Students" },
  { value: "12+", label: "University Partners" },
  { value: "92%", label: "Mastery Rate" },
] as const

export const landingTrustLogos = [
  "VNU Hanoi",
  "VNU HCM",
  "HUE UNIVERSITY",
  "CAN THO UNIVERSITY",
  "RMIT VIETNAM",
] as const

export const landingAgents = [
  {
    title: "Diagnosis Agent",
    description:
      "Precision mapping of cognitive knowledge gaps using Socratic probing. It understands what you know, and what you only think you know.",
    insightLabel: "REAL-TIME INSIGHT",
    insightText:
      "\"Student has 85% mastery in Linear Algebra but struggles with Vector visualization.\"",
  },
  {
    title: "Planner Agent",
    description:
      "Synchronizes daily study goals with the MOET National Academic Calendar and personal student commitments for a stress-free path.",
    insightLabel: "SCHEDULE SYNC",
    insightText:
      "\"Adjusting exam prep for midterm week. 45-min deep work session scheduled for tonight.\"",
  },
  {
    title: "Tutor Agent",
    description:
      "24/7 Socratic guidance. Instead of giving answers, it asks the right questions to build genuine conceptual intuition and confidence.",
    insightLabel: "ACTIVE GUIDANCE",
    insightText:
      "\"What happens to the denominator if we double the distance? Think about the inverse square law.\"",
  },
] as const

export const landingTeacherSupport = {
  title: "Empowering the Heart of the Classroom.",
  accent: "Heart",
  description:
    "WellStudy AI isn't here to replace teachers—it's here to liberate them. By handling the manual weight of support and grading, we return time to educators for what matters most: inspiration.",
  imageAlt: "Teacher in classroom",
  imageSrc:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA6wQMlMwxvRATTFab54ac7zQqk2uqxm87HrJOBNeMumoOhHGzfB7usuBQvKK072hp3nAdNZPPJmBmA_EakHUfnjciT8C_WkINoCOjgSOx2HfVRHuwsSFFNq9IHMVOLYSUY3xZnhrUzkPS9dkXRsOqOc5etK4rNPf8xCc71mHjr2fpEkc8WFgdvH5NYobQojiKjHLtNcpvddq_kLF5b4T1q2-4nH3NJ1vinbChKIbWJ7NjceMZ6Oy4lhhfzjC1WyTgc8z45jCIc-L05",
  metricValue: "70%",
  metricLabel: "Grading Reduction",
} as const

export const landingTeacherSupportItems = [
  {
    title: "Bottleneck Concepts",
    description:
      "Automatically identifies specific modules where the whole class is stalling, allowing for targeted intervention.",
  },
  {
    title: "Manual Support Offloading",
    description:
      "The AI Twin handles repetitive student questions, freeing you to focus on high-impact 1-on-1 mentorship.",
  },
] as const

export const landingAccessibility = {
  title: "Education Without Borders.",
  description:
    "From the busy streets of Saigon to remote mountainous villages in Ha Giang, WellStudy AI ensures that elite-level educational intelligence is affordable for every family in Vietnam.",
  items: ["Rural Optimization", "Offline Sync Mode", "Subsidized Licenses"],
} as const

export const landingCta = {
  title: "Ready to Scale Your Potential?",
  description:
    "Join 45,000+ students already mastering their future with WellStudy AI.",
} as const

export const landingFooterColumns = [
  {
    title: "Foundation",
    links: ["National Curriculum", "Academic Ethics", "AI Safety Guidelines"],
  },
  {
    title: "Support",
    links: ["Help Center", "Community Forum", "Teacher Training"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service"],
  },
] as const
