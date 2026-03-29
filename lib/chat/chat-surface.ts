export const chatEmptyState = {
  kicker: "Session ready",
  title: "Bắt đầu phiên học",
  description:
    "Đặt một câu hỏi rõ ràng, yêu cầu tóm tắt nhanh, hoặc mở một hướng học cụ thể từ tài liệu môn học.",
} as const

export const chatEmptyStateToneClasses = {
  shell:
    "border-border/70 bg-[linear-gradient(180deg,rgba(255,253,248,0.98),rgba(248,241,230,0.92))] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(22,32,43,0.96),rgba(15,23,32,0.94))]",
  kicker: "text-secondary dark:text-secondary",
  title:
    "bg-gradient-to-r from-primary via-foreground to-secondary bg-clip-text text-transparent dark:from-primary dark:via-foreground dark:to-secondary",
  modeCard: "border-border/60 bg-background/70 dark:border-white/10 dark:bg-white/4",
  modeLabel: "text-muted-foreground dark:text-muted-foreground",
} as const

export const chatQuickActions = [
  "Giải thích khái niệm cốt lõi",
  "Cho mình lộ trình học phần này",
  "Tóm tắt nhanh nội dung chính",
] as const

export const chatParticipantLabels = {
  user: "Bạn",
  assistant: "Tutor",
} as const
