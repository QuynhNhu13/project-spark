import { useStudent, TestQuestion } from "@/contexts/StudentContext";
import { ClipboardCheck, Clock, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, Flag, Search, Filter, BarChart3, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const StudentTests = () => {
  const { tests, submitTest } = useStudent();
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [reviewTest, setReviewTest] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "completed">("all");

  const filtered = tests.filter(t => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const available = filtered.filter(t => t.status === "available");
  const completed = filtered.filter(t => t.status === "completed");
  const allCompleted = tests.filter(t => t.status === "completed");
  const avgScore = allCompleted.length > 0 ? Math.round(allCompleted.reduce((s, t) => s + (t.score || 0), 0) / allCompleted.length) : 0;

  const test = activeTest ? tests.find(t => t.id === activeTest) : null;
  const review = reviewTest ? tests.find(t => t.id === reviewTest) : null;

  const chartData = allCompleted.map(t => ({ name: t.title.slice(0, 15), score: t.score || 0 }));

  const startTest = (testId: string) => {
    const t = tests.find(tt => tt.id === testId);
    if (!t) return;
    setActiveTest(testId);
    setCurrentQ(0);
    setAnswers({});
    setFlagged(new Set());
    setTimeLeft(t.duration * 60);
  };

  const handleSubmit = () => {
    if (activeTest) {
      submitTest(activeTest, answers);
      setActiveTest(null);
    }
  };

  const toggleFlag = (qId: string) => {
    setFlagged(prev => {
      const n = new Set(prev);
      n.has(qId) ? n.delete(qId) : n.add(qId);
      return n;
    });
  };

  // Active Test View
  if (test) {
    const q = test.questions[currentQ];
    const answered = Object.keys(answers).length;
    return (
      <div className="p-6 space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">{test.title}</h2>
              <p className="text-xs text-muted-foreground">{test.subject} • {test.totalQuestions} câu • {test.duration} phút</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-mono text-foreground">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</span>
              <Button variant="destructive" className="rounded-xl" size="sm" onClick={handleSubmit}>Nộp bài</Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {test.questions.map((qq, i) => (
              <button key={qq.id} onClick={() => setCurrentQ(i)} className={cn(
                "w-8 h-8 rounded-lg text-xs font-medium transition-all",
                currentQ === i ? "bg-primary text-primary-foreground" :
                answers[qq.id] !== undefined ? "bg-muted text-foreground border border-border" :
                flagged.has(qq.id) ? "bg-muted text-foreground border border-border" :
                "bg-muted text-muted-foreground"
              )}>
                {i + 1}
              </button>
            ))}
          </div>
          <Progress value={(answered / test.totalQuestions) * 100} className="h-1.5 mb-6" />
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Câu {currentQ + 1}/{test.totalQuestions}</h3>
              <button onClick={() => toggleFlag(q.id)} className={cn("flex items-center gap-1 text-xs", flagged.has(q.id) ? "text-foreground font-medium" : "text-muted-foreground")}>
                <Flag className="w-3.5 h-3.5" /> {flagged.has(q.id) ? "Đã đánh dấu" : "Đánh dấu"}
              </button>
            </div>
            <p className="text-sm text-foreground mb-4">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => (
                <button key={oi} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: oi }))} className={cn(
                  "w-full text-left p-3 rounded-xl border text-sm transition-all",
                  answers[q.id] === oi ? "border-primary bg-primary/5 text-foreground font-medium" : "border-border bg-card text-muted-foreground hover:border-primary/50"
                )}>
                  <span className="inline-flex w-6 h-6 rounded-full border border-current items-center justify-center text-xs mr-3">
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Button variant="outline" className="rounded-xl gap-1" size="sm" disabled={currentQ === 0} onClick={() => setCurrentQ(currentQ - 1)}>
              <ChevronLeft className="w-4 h-4" /> Câu trước
            </Button>
            <span className="text-xs text-muted-foreground">{answered}/{test.totalQuestions} đã trả lời</span>
            {currentQ < test.totalQuestions - 1 ? (
              <Button className="rounded-xl gap-1" size="sm" onClick={() => setCurrentQ(currentQ + 1)}>
                Câu sau <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button className="rounded-xl" size="sm" onClick={handleSubmit}>Nộp bài</Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Review Test View
  if (review) {
    const correctCount = review.questions.filter(q => review.answers?.[q.id] === q.correctAnswer).length;
    const wrongCount = review.totalQuestions - correctCount;
    return (
      <div className="p-6 space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">{review.title}</h2>
              <p className="text-xs text-muted-foreground">Điểm: {review.score}% • {review.completedAt} • Đúng {correctCount}/{review.totalQuestions}</p>
            </div>
            <Button variant="outline" className="rounded-xl" size="sm" onClick={() => setReviewTest(null)}>Đóng</Button>
          </div>

          {/* Analysis Summary */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 bg-muted/50 rounded-xl text-center">
              <p className="text-xs text-muted-foreground">Đúng</p>
              <p className="text-lg font-bold text-foreground">{correctCount}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-xl text-center">
              <p className="text-xs text-muted-foreground">Sai</p>
              <p className="text-lg font-bold text-destructive">{wrongCount}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-xl text-center">
              <p className="text-xs text-muted-foreground">Điểm</p>
              <p className="text-lg font-bold text-foreground">{review.score}%</p>
            </div>
          </div>

          <div className="space-y-4">
            {review.questions.map((q, i) => {
              const userAnswer = review.answers?.[q.id];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div key={q.id} className={cn("border rounded-xl p-4", isCorrect ? "border-border bg-muted/30" : "border-destructive/30 bg-destructive/5")}>
                  <div className="flex items-start gap-2 mb-3">
                    <span className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0", isCorrect ? "bg-muted text-foreground" : "bg-destructive/10 text-destructive")}>
                      {isCorrect ? "✓" : "✕"}
                    </span>
                    <p className="text-sm font-medium text-foreground">Câu {i + 1}: {q.question}</p>
                  </div>
                  <div className="space-y-1.5 mb-3 ml-8">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className={cn("p-2 rounded-lg text-xs",
                        oi === q.correctAnswer ? "bg-muted text-foreground font-medium" :
                        oi === userAnswer && !isCorrect ? "bg-destructive/10 text-destructive line-through" :
                        "text-muted-foreground"
                      )}>
                        {String.fromCharCode(65 + oi)}. {opt}
                        {oi === q.correctAnswer && " (Đáp án đúng)"}
                      </div>
                    ))}
                  </div>
                  <div className="ml-8 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Giải thích:</span> {q.explanation}</p>
                    {!isCorrect && <p className="text-xs text-destructive mt-1">Bạn chọn: {String.fromCharCode(65 + (userAnswer ?? 0))} - Sai vì không đúng công thức/khái niệm</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center"><ClipboardCheck className="w-6 h-6 text-foreground" /></div>
          <div><p className="text-xs text-muted-foreground">Bài có sẵn</p><p className="text-xl font-bold text-foreground">{tests.filter(t => t.status === "available").length}</p></div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center"><CheckCircle2 className="w-6 h-6 text-foreground" /></div>
          <div><p className="text-xs text-muted-foreground">Đã hoàn thành</p><p className="text-xl font-bold text-foreground">{allCompleted.length}</p></div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center"><BarChart3 className="w-6 h-6 text-foreground" /></div>
          <div><p className="text-xs text-muted-foreground">Điểm TB</p><p className="text-xl font-bold text-foreground">{avgScore}%</p></div>
        </div>
      </div>

      {/* Score Chart */}
      {chartData.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Điểm các bài kiểm tra</h3>
          <ChartContainer config={{ score: { label: "Điểm", color: "hsl(var(--primary))" } }} className="h-[180px] w-full">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="score" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Tìm bài kiểm tra..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-xl" />
        </div>
        <div className="flex gap-2">
          {(["all", "available", "completed"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-colors", statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
              {s === "all" ? "Tất cả" : s === "available" ? "Có sẵn" : "Đã làm"}
            </button>
          ))}
        </div>
      </div>

      {/* Available */}
      {available.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Bài kiểm tra có sẵn</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {available.map(t => (
              <div key={t.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{t.title}</h4>
                    <p className="text-xs text-muted-foreground">{t.subject} • {t.totalQuestions} câu • {t.duration} phút</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{t.subject}</Badge>
                </div>
                <Button className="w-full rounded-xl" size="sm" onClick={() => startTest(t.id)}>Bắt đầu làm bài</Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Đã hoàn thành</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completed.map(t => (
              <div key={t.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{t.title}</h4>
                    <p className="text-xs text-muted-foreground">{t.completedAt} • {t.subject}</p>
                  </div>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold bg-muted text-foreground")}>
                    {t.score}%
                  </div>
                </div>
                <Button variant="outline" className="w-full rounded-xl" size="sm" onClick={() => setReviewTest(t.id)}>Xem lại bài làm</Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTests;
