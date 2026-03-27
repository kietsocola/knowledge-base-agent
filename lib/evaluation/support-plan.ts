import type { EvaluationResult } from "@/types/evaluation"

export type SupportLevel = "high" | "medium" | "low"

export interface SupportPlan {
  level: SupportLevel
  title: string
  summary: string
  actions: string[]
  shouldEscalateToInstructor: boolean
}

function pickFocusTopics(result: EvaluationResult): string[] {
  const topics = result.recommendedTopics.filter(Boolean)
  if (topics.length > 0) {
    return topics.slice(0, 2)
  }

  const gaps = result.gaps.filter(Boolean)
  if (gaps.length > 0) {
    return gaps.slice(0, 2)
  }

  return ["nội dung cốt lõi của môn học"]
}

export function buildSupportPlan(result: EvaluationResult): SupportPlan {
  const focusTopics = pickFocusTopics(result)
  const focusText = focusTopics.join(" và ")

  if (result.overallScore < 5 || result.gaps.length >= 3) {
    return {
      level: "high",
      title: "Cần hỗ trợ sớm",
      summary: "Bạn đang có một số khoảng trống kiến thức nền tảng. Nên kết hợp tự ôn tập có hướng dẫn với trao đổi trực tiếp để tránh học chồng lỗ hổng.",
      actions: [
        `Ôn lại ngay các nội dung: ${focusText}.`,
        "Viết ra 3 câu hỏi cụ thể chưa rõ để trao đổi với giảng viên.",
        "Quay lại phiên chat và yêu cầu AI giải thích lại bằng ví dụ đơn giản hơn.",
      ],
      shouldEscalateToInstructor: true,
    }
  }

  if (result.overallScore < 7.5 || result.gaps.length > 0) {
    return {
      level: "medium",
      title: "Cần củng cố có hướng dẫn",
      summary: "Bạn đã có nền tảng nhưng vẫn còn một vài điểm chưa chắc. Mục tiêu tiếp theo là ôn lại đúng trọng tâm và luyện thêm bài tập áp dụng.",
      actions: [
        `Ôn lại có trọng tâm các nội dung: ${focusText}.`,
        "Làm thêm 2-3 bài tập ngắn để kiểm tra khả năng vận dụng.",
        "Tiếp tục hỏi AI theo từng bước để lấp nốt các điểm còn vướng.",
      ],
      shouldEscalateToInstructor: false,
    }
  }

  return {
    level: "low",
    title: "Tiếp tục mở rộng",
    summary: "Bạn đang có kết quả tốt. Giai đoạn tiếp theo nên tập trung mở rộng, liên hệ thực tế và thử sức với bài tập nâng cao.",
    actions: [
      `Mở rộng hoặc đào sâu thêm ở chủ đề: ${focusText}.`,
      "Thử tự tóm tắt lại kiến thức bằng ngôn ngữ của mình trước khi hỏi AI.",
      "Làm bài tập nâng cao hoặc tình huống thực tế để tăng chiều sâu hiểu biết.",
    ],
    shouldEscalateToInstructor: false,
  }
}
