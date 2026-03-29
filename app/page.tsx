import Image from "next/image"
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
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/15">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
            </div>
            <div>
              <div className="font-heading text-lg font-black tracking-tight text-primary">WellStudy AI</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                learning copilot
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <a className="text-sm font-semibold text-primary transition-colors hover:text-secondary" href="#home">
              Tổng quan
            </a>
            <a className="text-sm text-muted-foreground transition-colors hover:text-primary" href="#system">
              Hệ thống
            </a>
            <a className="text-sm text-muted-foreground transition-colors hover:text-primary" href="#experience">
              Trải nghiệm
            </a>
            <a className="text-sm text-muted-foreground transition-colors hover:text-primary" href="#impact">
              Giá trị
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
        <section
          id="home"
          className="soft-grid relative overflow-hidden px-6 pb-16 pt-10 md:px-12 md:pb-24"
        >
          <div className="absolute inset-x-0 top-0 -z-10 h-56 bg-[radial-gradient(circle_at_top,rgba(25,69,99,0.12),transparent_60%)]" />
          <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2.5rem] border border-border/60 bg-card/80 p-8 shadow-[0_28px_80px_rgba(25,69,99,0.08)] backdrop-blur-sm md:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                Hackathon 2026
              </div>

              <h1 className="mt-6 max-w-4xl font-heading text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
                Không chỉ trả lời câu hỏi.
                <span className="mt-3 block text-secondary">
                  WellStudy AI theo dõi, chẩn đoán và dẫn đường cho cả quá trình học.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Từ dữ liệu Moodle và lịch sử chat, hệ thống tạo learning analytics theo concept,
                cảnh báo sớm khi sinh viên hụt nhịp, và đề xuất lộ trình ôn luyện nhiều bước ngay trong lúc học.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["24/7", "Gia sư AI theo giáo trình"],
                  ["Concept-based", "Tracking theo mastery"],
                  ["Actionable", "Intervention và planner flow"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-[1.6rem] border border-border/60 bg-card/75 px-4 py-4 shadow-sm"
                  >
                    <div className="text-2xl font-black text-primary">{value}</div>
                    <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{label}</div>
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
                  Xem cách hệ thống vận hành
                </a>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="overflow-hidden rounded-[2.5rem] bg-[#132232] p-7 text-white shadow-[0_30px_90px_rgba(15,23,32,0.22)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/50">
                      learning control room
                    </div>
                    <div className="mt-2 font-heading text-3xl font-black leading-tight">
                      Observe → Diagnose → Intervene → Plan
                    </div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/8 px-4 py-3 text-right">
                    <div className="text-[10px] uppercase tracking-[0.24em] text-white/45">phiên bản</div>
                    <div className="mt-1 text-2xl font-black text-secondary">4.0</div>
                  </div>
                </div>

                <div className="mt-8 grid gap-3">
                  {SYSTEM_STAGES.map((stage) => (
                    <div
                      key={stage.id}
                      className="grid gap-3 rounded-[1.65rem] border border-white/10 bg-white/6 p-4 md:grid-cols-[64px_1fr]"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-lg font-black text-secondary">
                        {stage.id}
                      </div>
                      <div>
                        <div className="font-heading text-xl font-bold">{stage.title}</div>
                        <div className="mt-1 text-sm leading-relaxed text-white/68">{stage.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[2.5rem] border border-border/60 bg-card/75 p-6 shadow-[0_24px_80px_rgba(25,69,99,0.08)]">
                <div className="absolute right-0 top-0 h-40 w-40 translate-x-1/4 -translate-y-1/4 rounded-full bg-secondary/20 blur-3xl" />
                <div className="relative">
                  <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
                    giao diện demo
                  </div>
                  <div className="mt-3 overflow-hidden rounded-[1.8rem] border border-border/40 bg-background/80 p-4">
                    <Image
                      src="/image-hero.webp"
                      alt="Màn hình demo WellStudy AI với portal, chat và evaluation"
                      width={700}
                      height={520}
                      className="w-full rounded-[1.25rem] object-cover shadow-[0_20px_60px_rgba(25,69,99,0.12)]"
                      priority
                    />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {[
                      ["12", "concept được theo dõi"],
                      ["3", "mức can thiệp sớm"],
                      ["1", "planner flow sau evaluation"],
                    ].map(([value, label]) => (
                      <div key={label} className="rounded-[1.4rem] bg-[#182635] px-4 py-4 text-white">
                        <div className="text-3xl font-black text-secondary">{value}</div>
                        <div className="mt-1 text-xs text-white/65">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[2.3rem] border border-border/60 bg-card/75 p-8 shadow-sm">
                <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
                  vấn đề gốc
                </div>
                <h2 className="mt-3 max-w-xl font-heading text-3xl font-black leading-tight">
                  Sinh viên không thiếu tài liệu. Họ thiếu phản hồi đúng lúc và thiếu bản đồ học tập rõ ràng.
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {PAIN_POINTS.map(({ Icon, title, description }) => (
                  <article
                    key={title}
                    className="rounded-[2rem] border border-border/60 bg-card/80 p-6 shadow-[0_18px_50px_rgba(25,69,99,0.06)]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/14 text-secondary">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-heading text-xl font-bold leading-tight">{title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="system" className="px-6 py-20 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
                  hệ thống
                </div>
                <h2 className="mt-2 font-heading text-4xl font-black leading-tight">
                  Một product flow thống nhất, không phải các card tính năng rời rạc
                </h2>
              </div>
              <div className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                WellStudy AI đã đi xa hơn một chatbot RAG cơ bản: có tracking, classroom analytics,
                intervention workflow và planner flow để tạo trải nghiệm học nhiều bước.
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
              <div className="grid gap-4">
                {PRODUCT_SURFACES.map(({ eyebrow, title, description, icon: Icon }) => (
                  <article
                    key={title}
                    className="rounded-[2.1rem] border border-border/60 bg-card/80 p-7 shadow-[0_18px_60px_rgba(25,69,99,0.06)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-muted-foreground">
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

              <div className="overflow-hidden rounded-[2.4rem] bg-primary p-8 text-primary-foreground shadow-[0_28px_90px_rgba(25,69,99,0.18)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14">
                    <BarChart3 aria-hidden="true" className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-white/55">
                      evidence layer
                    </div>
                    <div className="font-heading text-2xl font-black">Từ hội thoại thành bằng chứng học tập</div>
                  </div>
                </div>

                <div className="mt-8 rounded-[1.9rem] border border-white/10 bg-black/10 p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      ["Sessions", "Lưu toàn bộ phiên học theo môn"],
                      ["Concepts", "Đánh dấu mastery theo chủ đề"],
                      ["Events", "Ghi nhận hoạt động và evaluation"],
                      ["Alerts", "Bật cảnh báo khi có rủi ro"],
                    ].map(([label, description]) => (
                      <div key={label} className="rounded-[1.4rem] border border-white/10 bg-white/7 p-4">
                        <div className="text-sm font-bold text-secondary">{label}</div>
                        <div className="mt-2 text-xs leading-relaxed text-white/72">{description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 space-y-4">
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

        <section id="experience" className="px-6 py-20 md:px-12">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[2.4rem] border border-white/50 bg-[#182635] p-8 text-white shadow-[0_28px_90px_rgba(15,23,32,0.18)]">
              <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/45">
                experience map
              </div>
              <h2 className="mt-3 font-heading text-4xl font-black leading-tight">
                Một hành trình học thống nhất từ portal tới classroom dashboard
              </h2>
              <div className="mt-8 space-y-4">
                {[
                  ["Portal", "Chọn người học, môn học và khởi động session chỉ bằng một lần launch."],
                  ["Chat", "Hỏi đáp theo tài liệu, mở tracking ngay trong sidebar, nhắc evaluation đúng thời điểm."],
                  ["Evaluation", "Xem concept mastery, planner flow và phương án hỗ trợ sau mỗi vòng hỏi đáp."],
                  ["Classroom", "Giảng viên nhìn thấy tín hiệu lớp học chứ không phải chỉ từng câu chat lẻ."],
                ].map(([label, description], index) => (
                  <div key={label} className="grid gap-3 rounded-[1.6rem] border border-white/10 bg-white/6 p-4 md:grid-cols-[52px_1fr]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 font-black text-secondary">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-heading text-xl font-bold">{label}</div>
                      <div className="mt-1 text-sm leading-relaxed text-white/68">{description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-[2.2rem] border border-border/60 bg-card/80 p-8 shadow-[0_18px_60px_rgba(25,69,99,0.06)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
                      classroom value
                    </div>
                    <h3 className="mt-3 font-heading text-3xl font-black leading-tight">
                      Không chỉ hỗ trợ một người học. Hệ thống còn giúp giảng viên phát hiện lớp đang nghẽn ở đâu.
                    </h3>
                  </div>
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
                    <div key={label} className="rounded-[1.5rem] border border-primary/10 bg-primary/5 p-4">
                      <div className="text-xs font-bold uppercase tracking-[0.22em] text-primary">{label}</div>
                      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <section id="impact" className="rounded-[2.2rem] border border-border/60 bg-card/80 p-8 shadow-[0_18px_60px_rgba(25,69,99,0.06)]">
                <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
                  impact
                </div>
                <h3 className="mt-3 font-heading text-3xl font-black leading-tight">
                  Từ MVP chatbot sang AI multi-step learning copilot
                </h3>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {[
                    ["MVP cũ", "Chat + citation + history"],
                    ["Hiện tại", "Tracking + analytics + intervention"],
                    ["Bước tiếp", "Planner + classroom intelligence"],
                  ].map(([title, description]) => (
                    <div key={title} className="rounded-[1.5rem] bg-accent p-5">
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
                    Quay lại tổng quan
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
              Hệ thống
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
