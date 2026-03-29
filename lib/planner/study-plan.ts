import { buildSupportPlan } from "@/lib/evaluation/support-plan"
import type { EvaluationResult } from "@/types/evaluation"
import type { LearningOverview } from "@/types/learning"
import type { StudyPlan } from "@/types/planner"

function pickFocusTopics(result: EvaluationResult, overview: LearningOverview): string[] {
  const recommended = result.recommendedTopics.filter(Boolean)
  if (recommended.length > 0) {
    return recommended.slice(0, 2)
  }

  const focus = overview.focusConcepts.map((concept) => concept.conceptName)
  if (focus.length > 0) {
    return focus.slice(0, 2)
  }

  return result.gaps.slice(0, 2)
}

export function buildStudyPlan(result: EvaluationResult, overview: LearningOverview): StudyPlan {
  const supportPlan = buildSupportPlan(result)
  const focusTopics = pickFocusTopics(result, overview)
  const primaryTopic = focusTopics[0] ?? "nội dung cốt lõi"
  const secondaryTopic = focusTopics[1] ?? primaryTopic
  const weakestConcept = overview.focusConcepts[0]?.conceptName ?? primaryTopic
  const horizonLabel =
    supportPlan.level === "high"
      ? "Kế hoạch 24-48 giờ"
      : supportPlan.level === "medium"
        ? "Kế hoạch cho phiên học tiếp theo"
        : "Kế hoạch mở rộng 2-3 phiên"

  const summary =
    supportPlan.level === "high"
      ? `Ưu tiên lấp lỗ hổng ở ${weakestConcept} trước khi mở rộng sang nội dung khác.`
      : supportPlan.level === "medium"
        ? `Tập trung củng cố ${primaryTopic} rồi kiểm tra lại bằng một checkpoint ngắn.`
        : `Duy trì đà học tốt và mở rộng chiều sâu ở ${primaryTopic}.`

  const steps = [
    {
      id: "diagnose",
      title: "Chốt lại phần đang hổng",
      objective:
        supportPlan.level === "high"
          ? `Xác định chính xác câu hỏi còn vướng quanh ${weakestConcept} và gom lại thành 2-3 ý cụ thể.`
          : `Nhìn lại các phần chưa chắc trong ${primaryTopic} để tránh hỏi lan man.`,
      agent: "Diagnosis Agent" as const,
    },
    {
      id: "plan",
      title: "Chọn thứ tự học tối ưu",
      objective:
        supportPlan.level === "low"
          ? `Mở rộng theo thứ tự ${primaryTopic} -> ${secondaryTopic} -> bài tập vận dụng.`
          : `Ưu tiên ${primaryTopic} trước, sau đó mới chuyển sang ${secondaryTopic} hoặc bài tập áp dụng.`,
      agent: "Planner Agent" as const,
    },
    {
      id: "practice",
      title: "Học theo từng bước với AI",
      objective:
        supportPlan.level === "high"
          ? `Yêu cầu AI giải thích lại ${primaryTopic} bằng ví dụ đơn giản, sau đó tự trả lời lại để kiểm tra hiểu thật.`
          : `Dùng AI để luyện hỏi đáp có cấu trúc, rồi yêu cầu một mini quiz hoặc ví dụ vận dụng.`,
      agent: "Tutor Agent" as const,
    },
  ]

  const suggestedPrompts = [
    `Giải thích lại ${primaryTopic} theo từng bước và cho ví dụ thật đơn giản.`,
    `Hãy hỏi tôi 3 câu ngắn để kiểm tra xem tôi đã hiểu ${weakestConcept} chưa.`,
    `Lập cho tôi một mini quiz về ${secondaryTopic} và chấm từng câu.`,
  ]

  const successSignal =
    supportPlan.level === "high"
      ? "Bạn có thể tự trả lời lại khái niệm chính mà không cần nhìn tài liệu và hoàn thành một lần evaluation mới."
      : supportPlan.level === "medium"
        ? "Bạn hoàn thành một vòng hỏi đáp + một checkpoint ngắn mà số concept cần tập trung giảm xuống."
        : "Bạn giữ được điểm hiện tại và chuyển thêm ít nhất một concept sang vùng mastered."

  return {
    title: "Planner Flow cho phiên học tiếp theo",
    summary,
    horizonLabel,
    steps,
    successSignal,
    suggestedPrompts,
  }
}
