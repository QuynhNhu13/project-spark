import { useParent } from "@/contexts/ParentContext";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { BookOpen, CheckCircle2, Star, TrendingUp, Download, Target, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area, ResponsiveContainer, PieChart, Pie } from "recharts";

const COLORS = [
  "hsl(224, 76%, 48%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)",
  "hsl(280, 67%, 50%)", "hsl(0, 84%, 60%)", "hsl(190, 90%, 40%)"
];

const ParentReports = () => {
  const { children, childProgress, childSubjectScores } = useParent();
  const [selectedChild, setSelectedChild] = useState(children[0]?.id || "");
  const [tab, setTab] = useState<"overview" | "subjects" | "trends">("overview");

  const child = children.find(c => c.id === selectedChild);
  const progress = childProgress[selectedChild] || [];
  const subjectScores = childSubjectScores[selectedChild] || [];
  const latest = progress[progress.length - 1];
  const prev = progress[progress.length - 2];
  const gpaDiff = latest && prev ? (latest.gpa - prev.gpa).toFixed(1) : "0";

  const totalSessions = child?.classes.reduce((s, c) => s + c.completedSessions, 0) || 0;
  const attended = Math.round(totalSessions * ((child?.attendance || 0) / 100));

  // Study hours by day data
  const studyHoursData = [
    { day: "T2", hours: 2.5 }, { day: "T3", hours: 3 }, { day: "T4", hours: 2 },
    { day: "T5", hours: 3.5 }, { day: "T6", hours: 2 }, { day: "T7", hours: 4 }, { day: "CN", hours: 1.5 },
  ];

  // Homework completion rate
  const homeworkData = progress.map(p => ({
    month: p.month,
    rate: Math.min(100, Math.round(p.attendance * 0.95 + Math.random() * 10)),
  }));

  const handleExport = () => {
    toast.success("Đang xuất báo cáo PDF...");
    setTimeout(() => toast.success("Đã xuất báo cáo thành công!"), 1500);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {children.map(c => (
            <button key={c.id} onClick={() => setSelectedChild(c.id)}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                selectedChild === c.id ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:text-foreground")}>
              <img src={c.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
              {c.name}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="rounded-xl gap-1" onClick={handleExport}>
          <Download className="w-3.5 h-3.5" /> Xuất báo cáo PDF
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: "Tổng buổi học", value: String(totalSessions), color: COLORS[0] },
          { icon: CheckCircle2, label: "Đã tham gia", value: String(attended), color: COLORS[1] },
          { icon: Star, label: "Điểm trung bình", value: String(child?.gpa || 0), color: COLORS[2] },
          { icon: TrendingUp, label: "So tháng trước", value: `${Number(gpaDiff) >= 0 ? "+" : ""}${gpaDiff}`, color: COLORS[3] },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-5" style={{ backgroundColor: s.color, transform: "translate(30%, -30%)" }} />
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center"><s.icon className="w-4 h-4 text-foreground" /></div>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 w-fit">
        {[{ key: "overview", label: "Tổng quan" }, { key: "subjects", label: "Môn học" }, { key: "trends", label: "Phân tích & Xu hướng" }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", tab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* GPA Trend */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Tiến triển GPA
            </h3>
            {progress.length > 0 ? (
              <ChartContainer config={{ gpa: { label: "GPA", color: COLORS[0] }, sessionsCompleted: { label: "Buổi học", color: COLORS[2] } }} className="h-[240px] w-full">
                <AreaChart data={progress} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="gpaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="gpa" stroke={COLORS[0]} strokeWidth={2} fill="url(#gpaGrad)" dot={{ r: 4, fill: COLORS[0] }} />
                </AreaChart>
              </ChartContainer>
            ) : <p className="text-sm text-muted-foreground text-center py-8">Chưa có dữ liệu</p>}
          </div>

          {/* Study Hours */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Giờ học trong tuần
            </h3>
            <ChartContainer config={{ hours: { label: "Giờ", color: COLORS[1] } }} className="h-[240px] w-full">
              <BarChart data={studyHoursData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                  {studyHoursData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>

          {/* Sessions completed trend */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Số buổi học hoàn thành
            </h3>
            <ChartContainer config={{ sessionsCompleted: { label: "Buổi", color: COLORS[2] } }} className="h-[240px] w-full">
              <BarChart data={progress} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sessionsCompleted" radius={[6, 6, 0, 0]}>
                  {progress.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>

          {/* Homework completion */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" /> Tỷ lệ hoàn thành bài tập
            </h3>
            <ChartContainer config={{ rate: { label: "%", color: COLORS[3] } }} className="h-[240px] w-full">
              <LineChart data={homeworkData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="rate" stroke={COLORS[3]} strokeWidth={2} dot={{ r: 4, fill: COLORS[3] }} />
              </LineChart>
            </ChartContainer>
          </div>
        </div>
      )}

      {/* Subjects Tab */}
      {tab === "subjects" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar chart */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Award className="w-4 h-4" /> Năng lực theo môn học
            </h3>
            {subjectScores.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={subjectScores}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                  <Radar name="Điểm" dataKey="score" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.3} strokeWidth={2} />
                  <Radar name="Mục tiêu" dataKey="target" stroke={COLORS[1]} fill={COLORS[1]} fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 5" />
                </RadarChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-muted-foreground text-center py-8">Chưa có dữ liệu</p>}
          </div>

          {/* Subject scores list */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Chi tiết điểm từng môn</h3>
            <div className="space-y-3">
              {subjectScores.map((s, i) => (
                <div key={i} className="p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-foreground">{s.subject}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-foreground">{s.score}</span>
                      <span className="text-xs text-muted-foreground">/ {s.target}</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(s.score / 10) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Bài tập: {s.homeworkRate}%</span>
                    <span>Tham gia: {s.participationRate}%</span>
                    <span>{s.trend === "up" ? "↑ Tăng" : s.trend === "down" ? "↓ Giảm" : "→ Ổn định"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject score bar chart */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">So sánh điểm các môn</h3>
            <ChartContainer config={{ score: { label: "Điểm", color: COLORS[0] }, target: { label: "Mục tiêu", color: COLORS[1] } }} className="h-[250px] w-full">
              <BarChart data={subjectScores} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} domain={[0, 10]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {subjectScores.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
                <Bar dataKey="target" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {tab === "trends" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance trend */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Xu hướng chuyên cần (%)</h3>
            <ChartContainer config={{ attendance: { label: "Chuyên cần", color: COLORS[1] } }} className="h-[240px] w-full">
              <AreaChart data={progress} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[1]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS[1]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} domain={[70, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="attendance" stroke={COLORS[1]} strokeWidth={2} fill="url(#attGrad)" dot={{ r: 4, fill: COLORS[1] }} />
              </AreaChart>
            </ChartContainer>
          </div>

          {/* GPA vs Attendance correlation */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">GPA & Chuyên cần</h3>
            <ChartContainer config={{ gpa: { label: "GPA", color: COLORS[0] }, attendance: { label: "Chuyên cần", color: COLORS[1] } }} className="h-[240px] w-full">
              <LineChart data={progress} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis yAxisId="gpa" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis yAxisId="att" orientation="right" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} domain={[70, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line yAxisId="gpa" type="monotone" dataKey="gpa" stroke={COLORS[0]} strokeWidth={2} dot={{ r: 4, fill: COLORS[0] }} />
                <Line yAxisId="att" type="monotone" dataKey="attendance" stroke={COLORS[1]} strokeWidth={2} dot={{ r: 4, fill: COLORS[1] }} />
              </LineChart>
            </ChartContainer>
          </div>

          {/* Monthly comparison - all metrics */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Phân tích tổng hợp theo tháng</h3>
            <ChartContainer config={{
              gpa: { label: "GPA", color: COLORS[0] },
              attendance: { label: "Chuyên cần", color: COLORS[1] },
              sessionsCompleted: { label: "Buổi học", color: COLORS[2] }
            }} className="h-[280px] w-full">
              <BarChart data={progress} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="gpa" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
                <Bar dataKey="sessionsCompleted" fill={COLORS[2]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>

          {/* Summary insights */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Tháng tốt nhất", value: progress.reduce((best, p) => p.gpa > best.gpa ? p : best, progress[0])?.month || "-", sub: `GPA: ${progress.reduce((best, p) => p.gpa > best.gpa ? p : best, progress[0])?.gpa || 0}` },
              { label: "Tổng giờ học", value: `${totalSessions * 1.5}h`, sub: `${totalSessions} buổi × 1.5h` },
              { label: "Xu hướng", value: Number(gpaDiff) >= 0 ? "Tích cực" : "Cần cải thiện", sub: `GPA ${Number(gpaDiff) >= 0 ? "tăng" : "giảm"} ${Math.abs(Number(gpaDiff))} điểm` },
            ].map((s, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5">
                <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                <p className="text-lg font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentReports;
