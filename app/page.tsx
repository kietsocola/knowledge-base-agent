import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Check,
  Compass,
  FolderX,
  Layers,
  Link2,
  MessageSquare,
  Sparkles,
  TimerOff,
} from "lucide-react"

const PAIN_POINTS = [
  {
    Icon: FolderX,
    title: "Học liệu nhiều nhưng không thành tri thức",
    description:
      "Slide, PDF, bài tập và thông báo bị chôn trong Moodle. Sinh viên mất thời gian tìm lại đúng đoạn cần học hơn là thật sự học.",
  },
  {
    Icon: Layers,
    title: "Không biết đang yếu ở concept nào",
    description:
      "Một chatbot chỉ trả lời là chưa đủ. Người học cần biết mình đang vướng ở khái niệm nào và tiến bộ ra sao qua từng phiên.",
  },
  {
    Icon: TimerOff,
    title: "Phản hồi thường đến quá muộn",
    description:
      "Khi sinh viên hụt nhịp, hệ thống hiện tại hiếm khi phát hiện sớm để gợi ý ôn lại, làm bài tập, hay escalates sang giảng viên.",
  },
  {
    Icon: Compass,
    title: "Thiếu lộ trình bước tiếp theo",
    description:
      "Sau mỗi câu trả lời, người học vẫn phải tự đoán nên ôn gì trước. Điều đó làm trải nghiệm học bị rời rạc và mất động lực.",
  },
]

const SYSTEM_STAGES = [
  {
    id: "01",
    title: "Observe",
    description: "Theo dõi câu hỏi, tài liệu truy xuất, evaluation và activity timeline trong từng phiên học.",
  },
  {
    id: "02",
    title: "Diagnose",
    description: "Phân tích mastery theo concept, tổng hợp điểm mạnh, khoảng trống và mức độ rủi ro học tập.",
  },
  {
    id: "03",
    title: "Intervene",
    description: "Sinh cảnh báo sớm và phương án hỗ trợ khi người học lặp lại lỗi, thiếu đánh giá hoặc chậm tiến bộ.",
  },
  {
    id: "04",
    title: "Plan",
    description: "Lập kế hoạch học nhiều bước để phiên tiếp theo có mục tiêu, câu hỏi gợi ý và tín hiệu thành công rõ ràng.",
  },
]

const PRODUCT_SURFACES = [
  {
    eyebrow: "Portal",
    title: "Launch từ LMS, không phá workflow cũ",
    description:
      "Sinh viên vào từ course đang học, hệ thống tự nhận context môn, tạo session và hiển thị đúng learning surface cần thiết.",
    icon: Link2,
  },
  {
    eyebrow: "Chat",
    title: "RAG minh bạch, có trích dẫn thật",
    description:
      "Chat trả lời theo tài liệu môn học, lưu lịch sử, tracking tiến trình và nhắc evaluation ngay trong lúc học.",
    icon: MessageSquare,
  },
  {
    eyebrow: "Analytics",
    title: "Từ chatbot thành learning copilot",
    description:
      "Concept mastery, timeline, classroom dashboard, intervention và planner flow biến dữ liệu chat thành insight có thể hành động.",
    icon: BrainCircuit,
  },
]

const OUTCOMES = [
  "Theo dõi sinh viên đang học gì theo concept thay vì chỉ đếm số câu chat.",
  "Đưa ra cảnh báo sớm khi người học chậm tiến bộ hoặc chưa evaluation đúng lúc.",
  "Đề xuất study plan nhiều bước để lần học sau có định hướng rõ ràng.",
]

export default function HomePage() {
  return (
    <div className="min-h-screen text-foreground">
      <nav className="glass-panel fixed top-0 z-50 w-full border-b border-border/50 px-6 py-4 shadow-[0_10px_40px_rgba(25,69,99,0.08)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/15">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
            </div>
            <div>
              <div className="font-heading text-lg font-black tracking-tight text-primary">WellStudy AI</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                learning copilot dossier
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <a className="text-sm font-semibold text-primary transition-colors hover:text-secondary" href="#home">
              Tuyên ngôn
            </a>
            <a className="text-sm text-muted-foreground transition-colors hover:text-primary" href="#system">
              Kiến trúc
            </a>
            <a className="text-sm text-muted-foreground transition-colors hover:text-primary" href="#experience">
              Trải nghiệm
            </a>
            <a className="text-sm text-muted-foreground transition-colors hover:text-primary" href="#impact">
              Tác động
            </a>
          </div>

          <Link
            href="/portal"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]"
          >
            Vào demo
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      <main id="main-content" className="pt-24">
        <section id="home" className="soft-grid relative overflow-hidden px-6 pb-18 pt-8 md:px-12 md:pb-24">
          <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,rgba(25,69,99,0.14),transparent_64%)]" />
          <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="paper-surface rounded-[2.6rem] p-8 md:p-10">
              <div className="section-label">Hackathon 2026</div>
              <div className="rule-divider mt-6 pb-8">
                <div className="max-w-4xl font-heading text-[clamp(3rem,6vw,5.8rem)] font-black leading-[0.95] tracking-[-0.04em]">
                  Một hệ thống học tập biết
                  <span className="block text-secondary">quan sát, chẩn đoán và can thiệp.</span>
                </div>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  WellStudy AI không dừng ở việc trả lời câu hỏi. Hệ thống đọc ngữ cảnh môn học,
                  tracking theo concept, phát hiện rủi ro sớm và tạo lộ trình học nhiều bước ngay trong lúc học.
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-[1.3fr_1fr_1fr]">
                <div className="metric-tile rounded-[1.8rem] px-5 py-5">
                  <div className="section-label">Current thesis</div>
                  <div className="mt-4 text-2xl font-black text-primary">From chatbot to learning copilot</div>
                  <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Tracking, intervention và planner flow được đưa lên cùng một trải nghiệm thống nhất.
                  </div>
                </div>
                {[
                  ["24/7", "Gia sư AI theo giáo trình"],
                  ["Concept-first", "Đo tiến bộ theo mastery"],
                ].map(([value, label]) => (
                  <div key={label} className="metric-tile rounded-[1.8rem] px-5 py-5">
                    <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
                      signal
                    </div>
                    <div className="mt-3 text-3xl font-black text-primary">{value}</div>
                    <div className="mt-2 text-xs leading-relaxed text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/portal"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/15 transition-transform hover:scale-[1.02]"
                >
                  Mở portal demo
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <a
                  href="#system"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/15 bg-card/80 px-8 py-4 text-sm font-bold text-primary transition-colors hover:bg-primary/5"
                >
                  Đọc flow hệ thống
                </a>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="ink-panel rounded-[2.6rem] p-7">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <div className="section-label text-white/60 before:bg-white/20">control room</div>
                    <div className="mt-4 font-heading text-3xl font-black leading-tight">
                      Observe → Diagnose → Intervene → Plan
                    </div>
                  </div>
                  <div className="rounded-[1.6rem] border border-white/10 bg-white/8 px-4 py-3 text-right">
                    <div className="text-[10px] uppercase tracking-[0.24em] text-white/45">version</div>
                    <div className="mt-1 text-2xl font-black text-secondary">4.0</div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  {SYSTEM_STAGES.map((stage) => (
                    <div
                      key={stage.id}
                      className="grid gap-4 rounded-[1.6rem] border border-white/10 bg-white/6 p-4 md:grid-cols-[66px_1fr]"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-lg font-black text-secondary">
                        {stage.id}
                      </div>
                      <div>
                        <div className="font-heading text-xl font-bold">{stage.title}</div>
                        <div className="mt-1 text-sm leading-relaxed text-white/70">{stage.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="paper-surface rounded-[2.4rem] p-6">
                <div className="section-label">evidence preview</div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    ["12", "concept được theo dõi"],
                    ["03", "mức can thiệp sớm"],
                    ["01", "planner flow sau evaluation"],
                  ].map(([value, label]) => (
                    <div key={label} className="metric-tile rounded-[1.5rem] px-4 py-4">
                      <div className="text-3xl font-black text-primary">{value}</div>
                      <div className="mt-2 text-xs leading-relaxed text-muted-foreground">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-[1.7rem] border border-border/60 bg-background/70 p-5">
                  <div className="grid gap-3 md:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-[1.4rem] bg-primary px-4 py-4 text-primary-foreground">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-primary-foreground/65">
                        live stack
                      </div>
                      <div className="mt-3 text-2xl font-black">Portal / Chat / Evaluation / Classroom</div>
                    </div>
                    <div className="text-sm leading-relaxed text-muted-foreground">
                      Mỗi lớp UI được nối trực tiếp với dữ liệu tracking thật ở backend:
                      session history, concept mastery, learning events, intervention alerts và study plan.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-18 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="paper-surface rounded-[2.5rem] p-8">
                <div className="section-label">Problem framing</div>
                <h2 className="mt-5 max-w-xl font-heading text-4xl font-black leading-tight">
                  Sinh viên không thiếu tài liệu. Họ thiếu phản hồi đúng lúc và thiếu bản đồ học tập rõ ràng.
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  Nếu chỉ thêm một chatbot vào Moodle, trải nghiệm vẫn rời rạc.
                  Giá trị thực sự nằm ở chỗ biến tương tác học tập thành tín hiệu có thể quan sát, giải thích và hành động.
                </p>
              </div>

              <div className="grid gap-4">
                {PAIN_POINTS.map(({ Icon, title, description }, index) => (
                  <article
                    key={title}
                    className="paper-surface rounded-[2rem] p-6"
                  >
                    <div className="grid gap-4 md:grid-cols-[78px_1fr]">
                      <div className="flex flex-col gap-3">
                        <div className="text-sm font-black text-secondary">{`0${index + 1}`}</div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/14 text-secondary">
                          <Icon aria-hidden="true" className="h-5 w-5" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-heading text-2xl font-bold leading-tight">{title}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="system" className="px-6 py-18 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="section-label">System architecture</div>
                <h2 className="mt-3 font-heading text-4xl font-black leading-tight">
                  Một product flow thống nhất, không phải các card tính năng rời rạc
                </h2>
              </div>
              <div className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                Theo đúng kiến trúc hiện tại, lớp trải nghiệm bám vào luồng `portal → chat → evaluation → classroom`,
                không tách rời khỏi dữ liệu và không giả lập giá trị.
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
              <div className="paper-surface rounded-[2.4rem] p-7">
                <div className="grid gap-4">
                  {PRODUCT_SURFACES.map(({ eyebrow, title, description, icon: Icon }) => (
                    <article key={title} className="metric-tile rounded-[1.8rem] p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
                            {eyebrow}
                          </div>
                          <h3 className="mt-3 font-heading text-2xl font-bold leading-tight">{title}</h3>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Icon aria-hidden="true" className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="ink-panel rounded-[2.4rem] p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14">
                    <BarChart3 aria-hidden="true" className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <div className="section-label text-white/60 before:bg-white/20">Evidence layer</div>
                    <div className="mt-2 font-heading text-2xl font-black">Từ hội thoại thành bằng chứng học tập</div>
                  </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Sessions", "Lưu toàn bộ phiên học theo môn"],
                    ["Concepts", "Đánh dấu mastery theo chủ đề"],
                    ["Events", "Ghi nhận activity timeline và evaluation"],
                    ["Alerts", "Bật cảnh báo sớm khi có rủi ro học tập"],
                  ].map(([label, description]) => (
                    <div key={label} className="rounded-[1.5rem] border border-white/10 bg-white/7 p-4">
                      <div className="text-sm font-bold text-secondary">{label}</div>
                      <div className="mt-2 text-xs leading-relaxed text-white/72">{description}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-7 space-y-4">
                  {OUTCOMES.map((outcome) => (
                    <div key={outcome} className="flex items-start gap-3 text-sm leading-relaxed text-white/82">
                      <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        <Check aria-hidden="true" className="h-3.5 w-3.5" />
                      </div>
                      <div>{outcome}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="px-6 py-18 md:px-12">
          <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[0.94fr_1.06fr]">
            <div className="ink-panel rounded-[2.5rem] p-8">
              <div className="section-label text-white/60 before:bg-white/20">Experience map</div>
              <h2 className="mt-4 font-heading text-4xl font-black leading-tight">
                Một hành trình học thống nhất từ portal tới classroom dashboard
              </h2>
              <div className="mt-8 space-y-4">
                {[
                  ["Portal", "Chọn người học, môn học và khởi động session chỉ bằng một lần launch."],
                  ["Chat", "Hỏi đáp theo tài liệu, mở tracking ngay trong sidebar, nhắc evaluation đúng thời điểm."],
                  ["Evaluation", "Xem concept mastery, planner flow và phương án hỗ trợ sau mỗi vòng hỏi đáp."],
                  ["Classroom", "Giảng viên nhìn thấy tín hiệu lớp học chứ không phải chỉ từng câu chat lẻ."],
                ].map(([label, description], index) => (
                  <div key={label} className="grid gap-4 rounded-[1.6rem] border border-white/10 bg-white/6 p-4 md:grid-cols-[54px_1fr]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 font-black text-secondary">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-heading text-xl font-bold">{label}</div>
                      <div className="mt-1 text-sm leading-relaxed text-white/70">{description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              <div className="paper-surface rounded-[2.3rem] p-8">
                <div className="section-label">Classroom value</div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <h3 className="max-w-2xl font-heading text-3xl font-black leading-tight">
                    Không chỉ hỗ trợ một người học. Hệ thống còn giúp giảng viên phát hiện lớp đang nghẽn ở đâu.
                  </h3>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/14 text-secondary">
                    <Compass aria-hidden="true" className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {[
                    ["Class insights", "Top concept yếu của lớp"],
                    ["Needs attention", "Danh sách sinh viên cần chú ý"],
                    ["Timeline", "Lịch sử hoạt động theo ngày"],
                  ].map(([label, value]) => (
                    <div key={label} className="metric-tile rounded-[1.5rem] p-4">
                      <div className="text-xs font-bold uppercase tracking-[0.22em] text-primary">{label}</div>
                      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <section id="impact" className="paper-surface rounded-[2.3rem] p-8">
                <div className="section-label">Impact</div>
                <h3 className="mt-4 font-heading text-3xl font-black leading-tight">
                  Từ MVP chatbot sang AI multi-step learning copilot
                </h3>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {[
                    ["MVP cũ", "Chat + citation + history"],
                    ["Hiện tại", "Tracking + analytics + intervention"],
                    ["Bước tiếp", "Planner + classroom intelligence"],
                  ].map(([title, description]) => (
                    <div key={title} className="metric-tile rounded-[1.5rem] p-5">
                      <div className="font-heading text-lg font-bold text-primary">{title}</div>
                      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/portal"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
                  >
                    Trải nghiệm demo ngay
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                  <a
                    href="#home"
                    className="inline-flex items-center justify-center rounded-full border border-primary/15 bg-card px-8 py-4 text-sm font-bold text-primary transition-colors hover:bg-primary/5"
                  >
                    Quay lại tuyên ngôn
                  </a>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 bg-card/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-heading text-xl font-black text-primary">WellStudy AI</div>
            <p className="mt-1 text-sm text-muted-foreground">
              AI learning copilot tích hợp LMS cho tracking, intervention và lập kế hoạch học tập.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <a className="transition-colors hover:text-primary" href="#system">
              Kiến trúc
            </a>
            <a className="transition-colors hover:text-primary" href="#experience">
              Trải nghiệm
            </a>
            <Link className="transition-colors hover:text-primary" href="/portal">
              Portal demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
