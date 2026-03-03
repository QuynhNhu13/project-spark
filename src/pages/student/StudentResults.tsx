import { useStudent } from "@/contexts/StudentContext";
import { Trophy, CheckCircle2, TrendingUp, Star, Search, Eye, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const StudentResults = () => {
  const { examResults, tests, mockExams } = useStudent();
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("Tất cả");
  const [detailResult, setDetailResult] = useState<string | null>(null);

  const subjects = ["Tất cả", ...Array.from(new Set(examResults.map(r => r.subject)))];

  const filtered = examResults.filter(r => {
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase());
    const matchSubject = subjectFilter === "Tất cả" || r.subject === subjectFilter;
    return matchSearch && matchSubject;
  });

  const totalExams = examResults.length;
  const avgScore = totalExams > 0 ? Math.round(examResults.reduce((s, r) => s + r.score, 0) / totalExams) : 0;
  const passedCount = examResults.filter(r => r.passed).length;
  const highestScore = totalExams > 0 ? Math.max(...examResults.map(r => r.score)) : 0;

  const stats = [
    { label: "Tổng bài thi", value: totalExams, icon: Trophy },
    { label: "Điểm trung bình", value: `${avgScore}%`, icon: TrendingUp },
    { label: "Số bài đạt", value: passedCount, icon: CheckCircle2 },
    { label: "Điểm cao nhất", value: `${highestScore}%`, icon: Star },
  ];

  // Find the test/exam data for detail view
  const getDetailData = (examId: string) => {
    const test = tests.find(t => t.id === examId);
    if (test && test.answers) return { questions: test.questions, answers: test.answers };
    const mock = mockExams.find(m => m.id === examId);
    if (mock && mock.answers) return { questions: mock.questions, answers: mock.answers };
    return null;
  };

  const detailData = detailResult ? getDetailData(examResults.find(r => r.id === detailResult)?.examId || "") : null;
  const detailInfo = detailResult ? examResults.find(r => r.id === detailResult) : null;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <s.icon className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Tìm kết quả..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-xl" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {subjects.map(s => (
            <button key={s} onClick={() => setSubjectFilter(s)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-colors", subjectFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {detailInfo && detailData && (
        <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-4" onClick={() => setDetailResult(null)}>
          <div className="bg-card border border-border rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">{detailInfo.title}</h2>
                <p className="text-xs text-muted-foreground">Điểm: {detailInfo.score}% • Đúng {detailInfo.correctAnswers}/{detailInfo.totalQuestions} • {detailInfo.completedAt}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setDetailResult(null)}><X className="w-4 h-4" /></Button>
            </div>
            <div className="space-y-4">
              {detailData.questions.map((q, i) => {
                const userAns = detailData.answers[q.id];
                const isCorrect = userAns === q.correctAnswer;
                return (
                  <div key={q.id} className={cn("border rounded-xl p-4", isCorrect ? "border-border bg-muted/30" : "border-destructive/30 bg-destructive/5")}>
                    <div className="flex items-start gap-2 mb-2">
                      <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0", isCorrect ? "bg-muted text-foreground" : "bg-destructive/10 text-destructive")}>{isCorrect ? "✓" : "✕"}</span>
                      <p className="text-sm font-medium text-foreground">Câu {i + 1}: {q.question}</p>
                    </div>
                    <div className="ml-7 space-y-1 mb-2">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className={cn("text-xs p-1.5 rounded", oi === q.correctAnswer ? "bg-muted text-foreground font-medium" : oi === userAns && !isCorrect ? "text-destructive line-through" : "text-muted-foreground")}>
                          {String.fromCharCode(65 + oi)}. {opt}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground ml-7 italic">{q.explanation}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Chi tiết kết quả</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[11px] text-muted-foreground font-medium p-3">Bài thi</th>
                <th className="text-left text-[11px] text-muted-foreground font-medium p-3">Môn</th>
                <th className="text-center text-[11px] text-muted-foreground font-medium p-3">Điểm</th>
                <th className="text-center text-[11px] text-muted-foreground font-medium p-3">Đúng</th>
                <th className="text-center text-[11px] text-muted-foreground font-medium p-3">Ngày</th>
                <th className="text-center text-[11px] text-muted-foreground font-medium p-3">Kết quả</th>
                <th className="text-center text-[11px] text-muted-foreground font-medium p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-3 text-sm font-medium text-foreground">{r.title}</td>
                  <td className="p-3"><Badge variant="outline" className="text-[10px]">{r.subject}</Badge></td>
                  <td className="p-3 text-center">
                    <span className={cn("text-sm font-bold", r.score >= 70 ? "text-foreground" : r.score >= 50 ? "text-foreground" : "text-destructive")}>{r.score}%</span>
                  </td>
                  <td className="p-3 text-center text-sm text-muted-foreground">{r.correctAnswers}/{r.totalQuestions}</td>
                  <td className="p-3 text-center text-xs text-muted-foreground">{r.completedAt}</td>
                  <td className="p-3 text-center">
                    <Badge className={cn("text-[10px]", r.passed ? "bg-muted text-foreground" : "bg-destructive/10 text-destructive")}>
                      {r.passed ? "Đạt" : "Chưa đạt"}
                    </Badge>
                  </td>
                  <td className="p-3 text-center">
                    <Button variant="ghost" size="sm" className="rounded-lg text-xs h-7 gap-1" onClick={() => setDetailResult(r.id)}>
                      <Eye className="w-3 h-3" /> Chi tiết
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Không tìm thấy kết quả</p>}
      </div>
    </div>
  );
};

export default StudentResults;
