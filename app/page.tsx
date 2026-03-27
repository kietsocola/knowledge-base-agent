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
  PlayCircle,
  Sparkles,
  TimerOff,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen text-foreground">
      <nav className="glass-panel fixed top-0 z-50 w-full border-b border-white/60 px-6 py-3 shadow-sm shadow-primary/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-heading text-xl font-black tracking-tight text-primary">WellStudy AI</span>
            </div>
            <div className="hidden gap-6 md:flex">
              <a className="border-b-2 border-primary px-1 text-sm font-semibold text-primary" href="#home">
                Trang chủ
              </a>
              <a className="text-sm text-muted-foreground transition-colors hover:text-primary" href="#features">
                Tính năng
              </a>
              <a className="text-sm text-muted-foreground transition-colors hover:text-primary" href="#benefits">
                Lợi ích
              </a>
            </div>
          </div>
          <Link
            href="/portal"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]"
          >
            Thử demo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      <main className="pt-20">
        <section id="home" className="soft-grid relative overflow-hidden px-6 pb-24 pt-16 md:px-12">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 md:flex-row">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                Chuyển đổi số giáo dục 2026
              </div>
              <h1 className="mt-8 max-w-3xl font-heading text-4xl font-black leading-tight text-foreground md:text-6xl">
                Biến dữ liệu Moodle thành{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  tri thức vượt trội
                </span>{" "}
                cùng AI cá nhân hóa
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Đồng bộ học liệu từ LMS, hỏi đáp dựa trên tài liệu môn học, và tự động đánh giá năng lực sau mỗi phiên học.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/portal"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-[#0066ff] px-8 py-4 text-white shadow-xl shadow-primary/20 transition-transform hover:scale-[1.03]"
                >
                  Bắt đầu ngay
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
                <button className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/10 bg-white px-8 py-4 font-bold text-primary transition-colors hover:bg-primary/5">
                  <PlayCircle className="h-5 w-5" />
                  Xem demo
                </button>
              </div>
            </div>

            <div className="relative w-full flex-1">
              <div className="absolute left-1/2 top-1/2 -z-10 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
              <div className="mx-auto max-w-xl">
                <Image
                  src="/image-hero.webp"
                  alt="WellStudy AI giao diện demo"
                  width={600}
                  height={450}
                  className="w-full object-contain drop-shadow-2xl"
                  priority
                />
              </div>

              <div className="absolute -bottom-6 right-4 rounded-[1.5rem] border border-white/70 bg-white/90 p-4 shadow-xl">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-xs font-bold">Đánh giá năng lực</span>
                </div>
                <div className="space-y-2">
                  {[["Thuật toán", 75], ["Độ phức tạp", 60], ["Cài đặt", 88]].map(([label, pct]) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between text-[10px] font-semibold text-muted-foreground">
                        <span>{label}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white/50 px-6 py-24 md:px-12">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground">
              Bạn đang kiệt sức trong "mê cung" học liệu Moodle?
            </h2>
            <div className="mt-12 grid gap-8 text-left md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  Icon: FolderX,
                  title: "Hàng trăm tệp tin Moodle không tên",
                  desc: "Hỗn loạn tài liệu PDF, bài giảng không nhãn dán khiến việc tìm kiếm thông tin trở thành cơn ác mộng mỗi kỳ thi.",
                },
                {
                  Icon: Layers,
                  title: "Kiến thức rời rạc, khó ôn tập",
                  desc: "Dữ liệu phân mảnh khiến bạn không thể kết nối các khái niệm, dẫn đến việc học vẹt và nhanh chóng quên sạch sau 24h.",
                },
                {
                  Icon: TimerOff,
                  title: "Không có ai giải đáp ngay lập tức",
                  desc: "Gặp khó khăn nhưng phải chờ đợi giảng viên hàng ngày trời. Sự gián đoạn này giết chết động lực và tiến độ học tập của bạn.",
                },
                {
                  Icon: Compass,
                  title: "Mất phương hướng trong lộ trình",
                  desc: "Bạn bơi giữa biển kiến thức mà không biết nên bắt đầu từ đâu, trọng tâm là gì, dẫn đến lãng phí thời gian vô ích.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.75rem] border border-transparent bg-white p-6 shadow-sm transition-shadow hover:border-destructive/10 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10">
                    <item.Icon className="h-6 w-6 text-destructive" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-bold leading-tight">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="bg-white/60 px-6 py-24 md:px-12">
          <div className="mx-auto max-w-7xl space-y-12">
            <div className="space-y-4 text-center">
              <h2 className="font-heading text-3xl font-black md:text-5xl">Trải nghiệm học tập thế hệ mới</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Bộ giao diện mới tập trung vào portal, chat, evaluation và khả năng thuyết trình trước ban giám khảo.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-2 rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm">
                <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Link2 className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 font-heading text-2xl font-bold">Đồng bộ Moodle 1-click</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Chỉ cần launch từ LMS, AI sẽ nhận context môn học và bắt đầu session tương ứng.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] bg-muted p-5">
                    <div className="grid gap-3">
                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Portal</div>
                        <div className="mt-2 text-sm text-muted-foreground">Chọn sinh viên, môn học và launch.</div>
                      </div>
                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Chat</div>
                        <div className="mt-2 text-sm text-muted-foreground">Hỏi đáp có ngữ cảnh và có trích dẫn.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-heading text-2xl font-bold">Gia sư AI 24/7</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Giải thích theo giáo trình, theo slide, và theo lịch sử hỏi đáp của sinh viên.
                </p>
              </div>

              <div className="rounded-[2rem] border border-cyan-100 bg-cyan-50 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-heading text-xl font-bold">Chat có ngữ cảnh</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Minh bạch, dễ tin và toàn bộ UI tập trung vào trải nghiệm chat cho demo.
                </p>
              </div>

              <div className="rounded-[2rem] bg-gradient-to-br from-primary to-[#0066ff] p-8 text-white shadow-xl shadow-primary/20 md:col-span-2">
                <h3 className="font-heading text-3xl font-black">Huấn luyện chuyên biệt</h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-blue-50/85">
                  Tạo agent riêng cho CTDL, OOP, CSDL và nhiều môn học khác. Mỗi agent là một chuyên gia thực thụ.
                </p>
                <Link
                  href="/portal"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-primary"
                >
                  Thử nghiệm ngay
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" className="bg-white px-6 py-24 md:px-12">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 md:flex-row">
            <div className="flex-1">
              <div className="relative rounded-[2.5rem] border border-slate-100 bg-[#f7f9fb] p-8 shadow-sm">
                <div className="space-y-6">
                  <div className="flex items-end justify-around gap-1 pt-4">
                    {[
                      [24, 44],
                      [32, 64],
                      [40, 88],
                      [48, 112],
                      [44, 136],
                      [52, 168],
                      [60, 200],
                      [56, 224],
                    ].map(([trad, ai], i) => (
                      <div key={i} className="flex items-end gap-0.5">
                        <div className="w-5 rounded-t-md bg-slate-200" style={{ height: trad }} />
                        <div className="w-5 rounded-t-md bg-primary" style={{ height: ai }} />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-slate-200" />Học truyền thống</span>
                    <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary" />WellStudy AI</span>
                  </div>
                  <div className="border-t border-slate-200 pt-4">
                    <div className="text-sm font-bold text-primary">Tốc độ tiếp thu kiến thức</div>
                    <div className="text-xs text-muted-foreground">So sánh với cách học thủ công truyền thống</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <h2 className="font-heading text-4xl font-black">Tối ưu hành trình của bạn</h2>
              <div className="mt-8 space-y-6">
                {[
                  ["Hiệu quả gấp 3 lần", "Tiết kiệm thời gian tìm tài liệu và tổng hợp kiến thức."],
                  ["Cá nhân hóa lộ trình", "AI điều chỉnh cách giải thích theo session và mục tiêu học tập."],
                  ["Tích hợp LMS sâu", "Hoạt động mượt mà với luồng Moodle/LTI hiện có."],
                ].map(([title, desc]) => (
                  <div key={title} className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-heading font-bold">{title}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f2f4f6] px-6 py-20">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">
              Được tin dùng bởi sinh viên từ các trường
            </p>
            <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
              <div className="flex w-max animate-marquee items-center gap-16">
                {[
                  "/Logo-dai-hoc-Bach-Khoa-TP.HCM-.webp",
                  "/Logo_UEH_xanh.png",
                  "/Logo_IUH.png",
                  "/Logo-SGU.png",
                  "/Logo-GTVT.png",
                  "/Logo-dai-hoc-Bach-Khoa-TP.HCM-.webp",
                  "/Logo_UEH_xanh.png",
                  "/Logo_IUH.png",
                  "/Logo-SGU.png",
                  "/Logo-GTVT.png",
                ].map((src, i) => (
                  <Image
                    key={i}
                    src={src}
                    alt=""
                    width={140}
                    height={56}
                    className="h-12 w-auto object-contain"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-24">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-primary p-12 text-center text-white">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan-400/20 blur-2xl" />
            <div className="relative z-10">
              <h2 className="font-heading text-4xl font-black md:text-5xl">
                Sẵn sàng nâng tầm tri thức của bạn?
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-50/85">
                Trải nghiệm flow hoàn chỉnh từ portal đến chat và evaluation trong một giao diện mới đồng bộ.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/portal"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-10 py-5 text-lg font-bold text-primary transition-transform hover:scale-[1.02]"
                >
                  Vào demo ngay
                </Link>
                <button className="rounded-full border border-white/30 bg-white/10 px-10 py-5 text-lg font-bold backdrop-blur-sm transition-colors hover:bg-white/15">
                  Liên hệ trường học
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-8 py-12 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="font-heading text-xl font-bold text-primary">WellStudy AI</span>
            <p className="text-xs text-slate-500">© 2026 WellStudy AI. Bảo lưu mọi quyền.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {["Chính sách bảo mật", "Điều khoản dịch vụ", "Sản phẩm", "Bản tin"].map((item) => (
              <a key={item} className="text-xs text-slate-400 transition-colors hover:text-primary" href="#">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
