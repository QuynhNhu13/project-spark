import { useParent } from "@/contexts/ParentContext";
import { Users, BookOpen, CheckCircle2, Star, CalendarDays, ClipboardList, Clock, FileText, Check, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const ParentChildren = () => {
  const { children, confirmAttendance, childSchedules, childTests } = useParent();
  const [selectedChild, setSelectedChild] = useState(children[0]?.id || "");
  const [tab, setTab] = useState<"overview" | "schedule" | "tests" | "attendance">("overview");

  const totalClasses = children.reduce((s, c) => s + c.totalClasses, 0);
  const avgAttendance = children.length > 0 ? Math.round(children.reduce((s, c) => s + c.attendance, 0) / children.length) : 0;
  const avgGpa = children.length > 0 ? (children.reduce((s, c) => s + c.gpa, 0) / children.length).toFixed(1) : "0";

  const child = children.find(c => c.id === selectedChild);
  const schedule = childSchedules[selectedChild] || [];
  const tests = childTests[selectedChild] || [];
  const pendingAttendance = (child?.attendanceConfirmations || []).filter(a => a.status === "pending");

  const handleConfirmAttendance = (confirmId: string, confirmed: boolean) => {
    confirmAttendance(selectedChild, confirmId, confirmed);
    toast.success(confirmed ? "Đã xác nhận điểm danh" : "Đã từ chối điểm danh");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Số con em", value: String(children.length) },
          { icon: BookOpen, label: "Tổng lớp học", value: String(totalClasses) },
          { icon: CheckCircle2, label: "Chuyên cần TB", value: `${avgAttendance}%` },
          { icon: Star, label: "Điểm trung bình", value: avgGpa },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center"><s.icon className="w-4 h-4 text-foreground" /></div>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Child Selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-sm font-semibold text-foreground">Chọn con em:</p>
        <div className="flex gap-2">
          {children.map(c => (
            <button key={c.id} onClick={() => { setSelectedChild(c.id); setTab("overview"); }}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                selectedChild === c.id ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:text-foreground")}>
              <img src={c.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
              {c.name}
            </button>
          ))}
        </div>
        {pendingAttendance.length > 0 && (
          <Badge variant="destructive" className="ml-auto text-xs gap-1">
            <AlertTriangle className="w-3 h-3" /> {pendingAttendance.length} chờ xác nhận
          </Badge>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 w-fit">
        {[
          { key: "overview", label: "Tổng quan", icon: Users },
          { key: "schedule", label: "Lịch học", icon: CalendarDays },
          { key: "tests", label: "Bài kiểm tra", icon: ClipboardList },
          { key: "attendance", label: "Xác nhận điểm danh", icon: CheckCircle2 },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
              tab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
            {t.key === "attendance" && pendingAttendance.length > 0 && (
              <span className="min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground px-1">{pendingAttendance.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && child && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-5">
            <img src={child.avatar} alt="" className="w-14 h-14 rounded-full object-cover" />
            <div className="flex-1">
              <p className="text-base font-bold text-foreground">{child.name}</p>
              <p className="text-sm text-muted-foreground">{child.grade} • {child.school}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">GPA: {child.gpa}</p>
              <p className="text-xs text-muted-foreground">Chuyên cần: {child.attendance}%</p>
            </div>
          </div>

          <div className="space-y-3">
            {child.classes.map(cls => (
              <div key={cls.id} className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border/50">
                <img src={cls.tutorAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{cls.name}</p>
                  <p className="text-xs text-muted-foreground">{cls.tutorName} • {cls.schedule}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 justify-end mb-1">
                    <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(cls.completedSessions / cls.totalSessions) * 100}%` }} />
                    </div>
                    <span className="text-[11px] text-muted-foreground">{cls.completedSessions}/{cls.totalSessions}</span>
                  </div>
                  <Badge variant={cls.status === "active" ? "default" : "secondary"} className="text-[10px]">
                    {cls.status === "active" ? "Đang học" : "Hoàn thành"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Tab */}
      {tab === "schedule" && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <CalendarDays className="w-4 h-4" /> Lịch học tuần này - {child?.name}
          </h3>
          {schedule.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Chưa có lịch học</p>
          ) : (
            <div className="space-y-2">
              {schedule.map((s, i) => (
                <div key={i} className={cn("flex items-center gap-4 p-4 rounded-xl border transition-all",
                  s.status === "completed" ? "border-border bg-muted/20" :
                  s.status === "upcoming" ? "border-primary/30 bg-primary/5" : "border-border")}>
                  <div className="text-center shrink-0 w-14">
                    <p className="text-xs text-muted-foreground">{s.dayOfWeek}</p>
                    <p className="text-lg font-bold text-foreground">{s.date.split("/")[0]}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{s.subject}</p>
                    <p className="text-xs text-muted-foreground">{s.tutorName} • {s.time}</p>
                    {s.topic && <p className="text-xs text-muted-foreground mt-0.5">Chủ đề: {s.topic}</p>}
                  </div>
                  <Badge variant={s.status === "completed" ? "secondary" : s.status === "upcoming" ? "default" : "outline"} className="text-[10px]">
                    {s.status === "completed" ? "Đã học" : s.status === "upcoming" ? "Sắp tới" : "Đã hủy"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tests Tab */}
      {tab === "tests" && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <ClipboardList className="w-4 h-4" /> Bài kiểm tra - {child?.name}
          </h3>
          {tests.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Chưa có bài kiểm tra</p>
          ) : (
            <div className="space-y-2">
              {tests.map((t, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.subject} • {t.date} • {t.tutorName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {t.score !== null ? (
                      <>
                        <p className={cn("text-lg font-bold", t.score >= 8 ? "text-foreground" : t.score >= 5 ? "text-muted-foreground" : "text-destructive")}>{t.score}/10</p>
                        <p className="text-[10px] text-muted-foreground">{t.score >= 8 ? "Giỏi" : t.score >= 6.5 ? "Khá" : t.score >= 5 ? "Trung bình" : "Yếu"}</p>
                      </>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">Chưa chấm</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Attendance Confirmation Tab */}
      {tab === "attendance" && (
        <div className="space-y-4">
          {/* Pending */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Chờ xác nhận - {child?.name}
            </h3>
            {pendingAttendance.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Không có điểm danh nào chờ xác nhận.</p>
            ) : (
              <div className="space-y-3">
                {pendingAttendance.map(a => (
                  <div key={a.id} className="flex items-center gap-4 p-4 rounded-xl border border-primary/30 bg-primary/5">
                    <img src={a.tutorAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{a.subject} - Buổi {a.sessionNumber}</p>
                      <p className="text-xs text-muted-foreground">{a.tutorName} • {a.date} • {a.time}</p>
                      {a.note && <p className="text-xs text-muted-foreground mt-0.5">Ghi chú GV: {a.note}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" className="rounded-xl gap-1 text-xs" onClick={() => handleConfirmAttendance(a.id, true)}>
                        <Check className="w-3 h-3" /> Xác nhận
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-xl gap-1 text-xs" onClick={() => handleConfirmAttendance(a.id, false)}>
                        <X className="w-3 h-3" /> Từ chối
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* History */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Lịch sử điểm danh</h3>
            <div className="space-y-2">
              {(child?.attendanceConfirmations || []).filter(a => a.status !== "pending").map(a => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center",
                    a.status === "confirmed" ? "bg-muted" : "bg-destructive/10")}>
                    {a.status === "confirmed" ? <CheckCircle2 className="w-4 h-4 text-foreground" /> : <X className="w-4 h-4 text-destructive" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{a.subject} - Buổi {a.sessionNumber}</p>
                    <p className="text-xs text-muted-foreground">{a.tutorName} • {a.date}</p>
                  </div>
                  <Badge variant={a.status === "confirmed" ? "secondary" : "destructive"} className="text-[10px]">
                    {a.status === "confirmed" ? "Đã xác nhận" : "Đã từ chối"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentChildren;
