import { useOffice } from "@/contexts/OfficeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CalendarCog, Play, CheckCircle2, AlertTriangle, Clock, Settings } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface ScheduleResult {
  id: string;
  className: string;
  suggestedTime: string;
  confidence: number;
  conflicts: string[];
}

const OfficeAISchedule = () => {
  const { constraints, classes } = useOffice();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScheduleResult[]>([]);
  const [phase, setPhase] = useState("");

  const phases = ["Thu thập dữ liệu...", "Phân tích ràng buộc...", "Tối ưu hóa lịch...", "Kiểm tra xung đột...", "Hoàn thành!"];

  const runScheduler = useCallback(() => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);
    setPhase(phases[0]);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const pct = Math.min(step * 5, 100);
      setProgress(pct);
      const phaseIdx = Math.min(Math.floor(step / 4), phases.length - 1);
      setPhase(phases[phaseIdx]);

      if (pct >= 100) {
        clearInterval(interval);
        setIsRunning(false);
        setResults([
          { id: "r1", className: "Lý 10 - Nâng cao", suggestedTime: "T3, T6 - 17:00-19:00", confidence: 92, conflicts: [] },
          { id: "r2", className: "Toán 12 - Ôn thi ĐH", suggestedTime: "T2, T4, T6 - 19:00-21:00", confidence: 88, conflicts: ["Trùng với lịch Lý 10 vào T6"] },
          { id: "r3", className: "IELTS Writing", suggestedTime: "T7 - 09:00-12:00", confidence: 95, conflicts: [] },
        ]);
      }
    }, 150);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Settings className="w-4 h-4" /> Ràng buộc hiện tại</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {constraints.map(c => (
              <div key={c.id} className="p-3 bg-muted/50 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{c.personName}</p>
                  <Badge variant="outline" className="text-[10px]">
                    {c.type === "tutor_unavailable" ? "GS không khả dụng" : c.type === "student_unavailable" ? "HS không khả dụng" : "Ưu tiên"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{c.description}</p>
                <div className="flex gap-1 mt-2">
                  {c.timeSlots.map((t, i) => (
                    <span key={i} className="text-[10px] bg-muted px-2 py-0.5 rounded-lg">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><CalendarCog className="w-4 h-4" /> Xếp lịch AI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Thuật toán sẽ phân tích {constraints.length} ràng buộc và tối ưu hóa lịch cho {classes.filter(c => c.status === "active" || c.status === "searching").length} lớp.
            </p>
            {isRunning && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {phase}</p>
              </div>
            )}
            <Button onClick={runScheduler} disabled={isRunning} className="w-full rounded-xl">
              <Play className="w-4 h-4 mr-1" /> {isRunning ? "Đang chạy..." : "Chạy thuật toán"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {results.length > 0 && (
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Kết quả xếp lịch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.map(r => (
              <div key={r.id} className="p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-foreground">{r.className}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${r.confidence >= 90 ? "text-emerald-600" : r.confidence >= 80 ? "text-amber-600" : "text-red-600"}`}>
                      {r.confidence}% phù hợp
                    </span>
                  </div>
                </div>
                <p className="text-sm text-foreground mb-2">Đề xuất: <span className="font-medium">{r.suggestedTime}</span></p>
                {r.conflicts.length > 0 && (
                  <div className="flex items-start gap-1 text-xs text-amber-600">
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{r.conflicts.join(", ")}</span>
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="rounded-xl text-xs">Áp dụng</Button>
                  <Button size="sm" variant="outline" className="rounded-xl text-xs">Điều chỉnh</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OfficeAISchedule;
