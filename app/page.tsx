import Link from "next/link"
import {
  BookOpen,
  Target,
  MessageSquare,
  Link2,
  ArrowRight,
  Sparkles,
  BarChart3,
  FileSearch,
} from "lucide-react"

const FEATURES = [
  {
    icon: FileSearch,
    title: "Kiến thức RAG chuyên sâu",
    desc: "AI truy xuất chính xác từ tài liệu môn học, trả lời có trích dẫn nguồn rõ ràng.",
  },
  {
    icon: Target,
    title: "Đánh giá năng lực",
    desc: "Phân tích radar kỹ năng sau mỗi phiên học, giúp sinh viên biết điểm cần cải thiện.",
  },
  {
    icon: MessageSquare,
    title: "Lịch sử học tập",
    desc: "Lưu toàn bộ hội thoại theo phiên, xem lại kiến thức bất cứ lúc nào.",
  },
  {
    icon: Link2,
    title: "Tích hợp LTI chuẩn",
    desc: "Cắm trực tiếp vào Moodle, Canvas hay bất kỳ LMS nào hỗ trợ LTI 1.3.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">KB Agent</span>
          </div>
          <Link
            href="/portal"
            className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            Thử demo
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[calc(100vh-64px)] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(99,102,241,0.20),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_75%,rgba(59,130,246,0.12),transparent_55%)]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-500/15 text-indigo-300 text-xs font-medium px-3.5 py-1.5 rounded-full border border-indigo-500/25 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                Trợ lý học tập AI thế hệ mới
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.15]">
                Học thông minh hơn{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  cùng AI cá nhân hóa
                </span>
              </h1>
              <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-lg">
                KB Agent tích hợp trực tiếp vào LMS của trường, giúp sinh viên
                hỏi đáp kiến thức từ tài liệu môn học và nhận đánh giá năng lực
                chính xác sau mỗi phiên học.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/portal"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.03] transition-all duration-200"
                >
                  Bắt đầu học ngay
                  <ArrowRight className="w-4.5 h-4.5" />
                </Link>
              </div>
              <p className="mt-4 text-slate-500 text-sm">
                Tích hợp LTI 1.3 · Không cần cài đặt thêm · Miễn phí thử nghiệm
              </p>
            </div>

            {/* Visual – chat mockup */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-indigo-500/10 rounded-3xl blur-3xl" />
                <div className="relative bg-white/[0.06] backdrop-blur-sm rounded-2xl border border-white/10 p-5 w-[22rem] shadow-2xl">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/8">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200">KB Agent</div>
                      <div className="text-[10px] text-slate-500">Cấu Trúc Dữ Liệu & Giải Thuật</div>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-[10px] text-emerald-400">Online</span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="space-y-3">
                    <div className="bg-slate-700/50 rounded-xl rounded-tl-sm p-3 text-xs text-slate-300 leading-relaxed max-w-[85%]">
                      Phức tạp thời gian của QuickSort là gì và tại sao?
                    </div>
                    <div className="bg-indigo-600/20 border border-indigo-500/20 rounded-xl rounded-tr-sm p-3 text-xs text-slate-200 leading-relaxed ml-4">
                      QuickSort có độ phức tạp trung bình{" "}
                      <strong className="text-indigo-300">O(n log n)</strong>.
                      Theo slide tuần 5, thuật toán chia mảng quanh pivot thành
                      2 phần, mỗi lần xử lý n phần tử...
                    </div>
                    {/* Typing dots */}
                    <div className="flex items-center gap-1 pl-1">
                      {[0, 150, 300].map((delay) => (
                        <span
                          key={delay}
                          className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                          style={{ animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Citation */}
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] text-indigo-400/80 border-t border-white/5 pt-3">
                    <BookOpen className="w-3 h-3" />
                    Nguồn: Slide CTDL tuần 5, trang 12
                  </div>
                </div>

                {/* Floating eval card */}
                <div className="absolute -bottom-4 -right-6 bg-slate-800/90 border border-slate-700 rounded-xl p-3 shadow-xl w-44">
                  <div className="flex items-center gap-1.5 mb-2">
                    <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[10px] font-semibold text-slate-300">Đánh giá năng lực</span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { label: "Thuật toán", pct: 75 },
                      { label: "Độ phức tạp", pct: 60 },
                      { label: "Cài đặt", pct: 88 },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="flex justify-between text-[9px] text-slate-500 mb-0.5">
                          <span>{s.label}</span>
                          <span>{s.pct}%</span>
                        </div>
                        <div className="h-1 rounded-full bg-slate-700 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"
                            style={{ width: `${s.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section className="bg-slate-900/80 border-t border-slate-800 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white">
              Tại sao chọn KB Agent?
            </h2>
            <p className="mt-3 text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
              Được xây dựng dành riêng cho môi trường học thuật, tích hợp liền mạch
              với hạ tầng LMS hiện có.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group bg-slate-800/50 rounded-2xl p-6 border border-slate-700/60 hover:border-indigo-500/50 hover:bg-slate-800 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 flex items-center justify-center mb-4 transition-colors">
                  <f.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 to-blue-950 border-t border-indigo-900/50 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_70%)]" />
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-indigo-200 text-xs px-3 py-1.5 rounded-full border border-white/10 mb-6">
            <Sparkles className="w-3 h-3" />
            Sẵn sàng trải nghiệm
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Bắt đầu ngay hôm nay
          </h2>
          <p className="mt-4 text-indigo-200/70 text-base leading-relaxed">
            Trải nghiệm KB Agent với bộ dữ liệu demo đầy đủ, không cần cài đặt
            thêm hay đăng ký tài khoản.
          </p>
          <Link
            href="/portal"
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-white text-indigo-700 rounded-xl font-semibold shadow-xl hover:scale-[1.03] hover:shadow-2xl transition-all duration-200"
          >
            Vào demo ngay
            <ArrowRight className="w-4.5 h-4.5" />
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-slate-950 border-t border-slate-800/60 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/80 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-slate-300">KB Agent</span>
          </div>
          <p className="text-xs text-slate-600">
            AI Knowledge Base · Hệ thống học tập thông minh tích hợp LTI 1.3
          </p>
        </div>
      </footer>
    </div>
  )
}
