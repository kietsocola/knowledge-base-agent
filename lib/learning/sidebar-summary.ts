import type { LearningOverview } from "@/types/learning"

export interface SidebarLearningSummary {
  primaryLabel: string
  primaryConcept: string
  secondaryLabel: string
}

export function buildSidebarLearningSummary(
  overview: LearningOverview
): SidebarLearningSummary {
  if (overview.focusConcepts.length > 0) {
    return {
      primaryLabel: "Cần tập trung",
      primaryConcept: overview.focusConcepts[0].conceptName,
      secondaryLabel: "Đang cải thiện",
    }
  }

  if (overview.improvingConcepts.length > 0) {
    return {
      primaryLabel: "Đang cải thiện",
      primaryConcept: overview.improvingConcepts[0].conceptName,
      secondaryLabel: "Đã nắm tốt",
    }
  }

  if (overview.masteredConcepts.length > 0) {
    return {
      primaryLabel: "Đã nắm tốt",
      primaryConcept: overview.masteredConcepts[0].conceptName,
      secondaryLabel: "Tiếp tục mở rộng",
    }
  }

  return {
    primaryLabel: "Chưa có dữ liệu",
    primaryConcept: "Bắt đầu hỏi đáp để hệ thống ghi nhận tiến trình học tập",
    secondaryLabel: "Theo dõi sẽ xuất hiện sau",
  }
}
