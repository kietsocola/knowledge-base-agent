import type {
  ClassroomOverview,
  InterventionAlert,
  LearningOverview,
} from "@/types/learning"

function createAlert(
  id: string,
  severity: InterventionAlert["severity"],
  title: string,
  summary: string,
  recommendedAction: string
): InterventionAlert {
  return { id, severity, title, summary, recommendedAction }
}

export function buildLearnerInterventionAlerts(overview: LearningOverview): InterventionAlert[] {
  const alerts: InterventionAlert[] = []
  const weakestConcept = overview.focusConcepts[0]

  if (overview.totalChatTurns >= 4 && overview.totalEvaluations === 0) {
    alerts.push(
      createAlert(
        "missing-evaluation",
        "high",
        "Chưa có mốc đánh giá gần đây",
        "Bạn đã có đủ lượt hỏi đáp nhưng chưa tạo một lần đánh giá để khóa lại mức độ hiểu bài.",
        "Thực hiện đánh giá ngay sau phiên học này để xác định chính xác phần đang hổng."
      )
    )
  }

  if (weakestConcept && weakestConcept.masteryScore < 0.35) {
    alerts.push(
      createAlert(
        "critical-concept-gap",
        "high",
        `Concept "${weakestConcept.conceptName}" đang dưới ngưỡng an toàn`,
        "Một concept cốt lõi đang có mastery rất thấp, dễ kéo tụt hiệu quả của các phiên học tiếp theo.",
        `Ưu tiên ôn lại ${weakestConcept.conceptName} và yêu cầu AI giải thích lại bằng ví dụ từng bước.`
      )
    )
  } else if (overview.focusConcepts.length >= 2) {
    alerts.push(
      createAlert(
        "multiple-focus-concepts",
        "medium",
        "Có nhiều concept cần tập trung cùng lúc",
        "Bạn đang có hơn một vùng kiến thức yếu, nên tránh học dàn trải trong phiên tiếp theo.",
        `Chỉ chọn 1-2 chủ đề ưu tiên: ${overview.focusConcepts.slice(0, 2).map((concept) => concept.conceptName).join(", ")}.`
      )
    )
  }

  const latestDay = overview.activityTimeline.at(-1)
  if (latestDay && latestDay.chatTurns >= 3 && latestDay.evaluations === 0) {
    alerts.push(
      createAlert(
        "chat-without-checkpoint",
        "medium",
        "Phiên gần đây có hỏi đáp nhưng chưa có checkpoint",
        "Bạn đang học khá tích cực nhưng chưa có bước kiểm tra lại để biết mình đã tiến bộ đến đâu.",
        "Sau 3-4 lượt hỏi tiếp theo, hãy chốt phiên bằng đánh giá hoặc yêu cầu AI tóm tắt phần bạn đã hiểu."
      )
    )
  }

  if (alerts.length === 0) {
    alerts.push(
      createAlert(
        "stable-progress",
        "low",
        "Tiến độ hiện tại ổn định",
        "Chưa thấy dấu hiệu cần can thiệp sớm trong dữ liệu gần đây.",
        "Giữ nhịp học hiện tại và tiếp tục mở rộng từ các concept đang cải thiện."
      )
    )
  }

  return alerts.slice(0, 3)
}

export function buildClassroomInterventionAlerts(
  overview: Pick<ClassroomOverview, "totalStudents" | "activeStudents" | "studentsNeedingAttention" | "strugglingConcepts">
): InterventionAlert[] {
  const alerts: InterventionAlert[] = []

  if (overview.totalStudents > 0) {
    const attentionRatio = overview.studentsNeedingAttention.length / overview.totalStudents
    if (overview.studentsNeedingAttention.length >= 2 && attentionRatio >= 0.4) {
      alerts.push(
        createAlert(
          "class-high-attention-ratio",
          "high",
          "Tỷ lệ sinh viên cần hỗ trợ đang cao",
          `${overview.studentsNeedingAttention.length}/${overview.totalStudents} sinh viên đang nằm trong nhóm cần theo dõi hoặc can thiệp sớm.`,
          "Nên dành một checkpoint chung cho lớp hoặc đẩy thông báo ôn tập theo nhóm."
        )
      )
    }
  }

  const bottleneckConcept = overview.strugglingConcepts[0]
  if (bottleneckConcept && bottleneckConcept.averageMasteryScore < 0.45 && bottleneckConcept.studentCount >= 2) {
    alerts.push(
      createAlert(
        "class-bottleneck-concept",
        "medium",
        `Concept nghẽn của lớp: ${bottleneckConcept.conceptName}`,
        "Nhiều sinh viên đang cùng yếu ở một concept chung, đây là dấu hiệu cần can thiệp ở cấp lớp thay vì từng cá nhân.",
        `Tạo một mini-lesson hoặc bài tập củng cố riêng cho ${bottleneckConcept.conceptName}.`
      )
    )
  }

  if (overview.totalStudents > overview.activeStudents) {
    alerts.push(
      createAlert(
        "inactive-learners",
        "medium",
        "Có sinh viên chưa tham gia đủ nhịp học",
        `${overview.totalStudents - overview.activeStudents} sinh viên đã có trong lớp nhưng chưa thể hiện hoạt động học tập đáng kể.`,
        "Nên gửi nhắc nhở hoặc mở một phiên học có hướng dẫn để kéo lại nhóm đang ít tương tác."
      )
    )
  }

  if (alerts.length === 0) {
    alerts.push(
      createAlert(
        "class-stable",
        "low",
        "Lớp học đang ở trạng thái ổn định",
        "Chưa xuất hiện tín hiệu cảnh báo sớm nổi bật ở cấp độ toàn lớp.",
        "Tiếp tục theo dõi timeline hoạt động và giữ nhịp đánh giá định kỳ."
      )
    )
  }

  return alerts.slice(0, 3)
}
