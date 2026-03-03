import { useStudent } from "@/contexts/StudentContext";
import { FileText, Clock, Users, Trophy, ChevronLeft, ChevronRight, Flag, Search, ShoppingCart, CheckCircle2, Eye } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const StudentMockExam = () => {
  const { mockExams, submitMockExam, purchaseMockExam } = useStudent();
  const { toast } = useToast();
  const [activeExam, setActiveExam] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [showResult, setShowResult] = useState<string | null>(null);
  const [reviewAttempt, setReviewAttempt] = useState<{ examId: string; attemptIdx: number } | null>(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"marketplace" | "purchased">("marketplace");

  const marketplace = mockExams.filter(e => !e.purchased);
  const purchased = mockExams.filter(e => e.purchased);

  const filteredMarketplace = marketplace.filter(e => !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.subject.toLowerCase().includes(search.toLowerCase()));
  const filteredPurchased = purchased.filter(e => !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.subject.toLowerCase().includes(search.toLowerCase()));

  const exam = activeExam ? mockExams.find(e => e.id === activeExam) : null;
  const resultExam = showResult ? mockExams.find(e => e.id === showResult) : null;

  const startExam = (examId: string) => {
    setActiveExam(examId);
    setCurrentQ(0);
    setAnswers({});
    setFlagged(new Set());
  };

  const handleSubmit = () => {
    if (activeExam) {
      submitMockExam(activeExam, answers);
      setShowResult(activeExam);
      setActiveExam(null);
    }
  };

  const handlePurchase = (examId: string) => {
    purchaseMockExam(examId);
    toast({ title: "Mua đề thành công!", description: "Đã thanh toán 10.000đ. Bạn có thể bắt đầu làm bài ngay." });
  };

  // Review attempt
  if (reviewAttempt) {
    const ex = mockExams.find(e => e.id === reviewAttempt.examId);
    const attempt = ex?.attemptHistory?.[reviewAttempt.attemptIdx];
    if (!ex || !attempt) { setReviewAttempt(null); return null; }
    const correctCount = ex.questions.filter(q => attempt.answers[q.id] === q.correctAnswer).length;
    return (
      <div className="p-6 space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">{ex.title}</h2>
              <p className="text-xs text-muted-foreground">Lần làm {reviewAttempt.attemptIdx + 1} • {attempt.date} • Điểm: {attempt.score}% • Đúng {correctCount}/{ex.totalQuestions}</p>
            </div>
            <Button variant="outline" className="rounded-xl" size="sm" onClick={() => setReviewAttempt(null)}>Đóng</Button>
          </div>
          <div className="space-y-4">
            {ex.questions.map((q, i) => {
              const userAns = attempt.answers[q.id];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <div key={q.id} className={cn("border rounded-xl p-4", isCorrect ? "border-border bg-muted/30" : "border-destructive/30 bg-destructive/5")}>
                  <div className="flex items-start gap-2 mb-3">
                    <span className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0", isCorrect ? "bg-muted text-foreground" : "bg-destructive/10 text-destructive")}>{isCorrect ? "✓" : "✕"}</span>
                    <p className="text-sm font-medium text-foreground">Câu {i + 1}: {q.question}</p>
                  </div>
                  <div className="space-y-1.5 mb-3 ml-8">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className={cn("p-2 rounded-lg text-xs", oi === q.correctAnswer ? "bg-muted text-foreground font-medium" : oi === userAns && !isCorrect ? "bg-destructive/10 text-destructive line-through" : "text-muted-foreground")}>
                        {String.fromCharCode(65 + oi)}. {opt} {oi === q.correctAnswer && " (Đáp án đúng)"}
                      </div>
                    ))}
                  </div>
                  <div className="ml-8 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Giải thích:</span> {q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active Exam
  if (exam) {
    const q = exam.questions[currentQ];
    const answered = Object.keys(answers).length;
    return (
      <div className="p-6 space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">{exam.title}</h2>
              <p className="text-xs text-muted-foreground">{exam.difficulty} • {exam.duration} phút</p>
            </div>
            <Button variant="destructive" className="rounded-xl" size="sm" onClick={handleSubmit}>Nộp bài</Button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {exam.questions.map((qq, i) => (
              <button key={qq.id} onClick={() => setCurrentQ(i)} className={cn(
                "w-8 h-8 rounded-lg text-xs font-medium",
                currentQ === i ? "bg-primary text-primary-foreground" :
                answers[qq.id] !== undefined ? "bg-muted text-foreground border border-border" :
                flagged.has(qq.id) ? "bg-muted text-foreground" :
                "bg-muted text-muted-foreground"
              )}>
                {i + 1}
              </button>
            ))}
          </div>
          <Progress value={(answered / exam.totalQuestions) * 100} className="h-1.5 mb-6" />
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Câu {currentQ + 1}</h3>
              <button onClick={() => { const n = new Set(flagged); n.has(q.id) ? n.delete(q.id) : n.add(q.id); setFlagged(n); }} className={cn("text-xs flex items-center gap-1", flagged.has(q.id) ? "text-foreground font-medium" : "text-muted-foreground")}>
                <Flag className="w-3.5 h-3.5" /> Đánh dấu
              </button>
            </div>
            <p className="text-sm text-foreground mb-4">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => (
                <button key={oi} onClick={() => setAnswers(p => ({ ...p, [q.id]: oi }))} className={cn(
                  "w-full text-left p-3 rounded-xl border text-sm",
                  answers[q.id] === oi ? "border-primary bg-primary/5 font-medium" : "border-border hover:border-primary/50"
                )}>
                  <span className="inline-flex w-6 h-6 rounded-full border border-current items-center justify-center text-xs mr-3">{String.fromCharCode(65 + oi)}</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" size="sm" className="rounded-xl gap-1" disabled={currentQ === 0} onClick={() => setCurrentQ(currentQ - 1)}>
              <ChevronLeft className="w-4 h-4" /> Trước
            </Button>
            {currentQ < exam.totalQuestions - 1 ? (
              <Button size="sm" className="rounded-xl gap-1" onClick={() => setCurrentQ(currentQ + 1)}>
                Sau <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button size="sm" className="rounded-xl" onClick={handleSubmit}>Nộp bài</Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Result View
  if (resultExam && resultExam.status === "completed") {
    const correct = resultExam.questions.filter(q => resultExam.answers?.[q.id] === q.correctAnswer).length;
    return (
      <div className="p-6 space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6 text-center">
          <div className={cn("w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold bg-muted text-foreground")}>
            {resultExam.score}%
          </div>
          <h2 className="text-lg font-bold text-foreground mb-1">{resultExam.title}</h2>
          <p className="text-sm text-muted-foreground mb-4">Đúng {correct}/{resultExam.totalQuestions} câu</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" className="rounded-xl" onClick={() => setShowResult(null)}>Quay lại</Button>
            <Button className="rounded-xl" onClick={() => { setReviewAttempt({ examId: resultExam.id, attemptIdx: (resultExam.attemptHistory?.length || 1) - 1 }); setShowResult(null); }}>Xem chi tiết</Button>
          </div>
        </div>
      </div>
    );
  }

  const difficultyStyle = "bg-muted text-foreground";

  return (
    <div className="p-6 space-y-6">
      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Tìm đề thi thử..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-xl" />
        </div>
        <div className="flex gap-2">
          <Button variant={tab === "marketplace" ? "default" : "outline"} size="sm" className="rounded-xl text-xs gap-1" onClick={() => setTab("marketplace")}>
            <ShoppingCart className="w-3.5 h-3.5" /> Đề thi có sẵn
          </Button>
          <Button variant={tab === "purchased" ? "default" : "outline"} size="sm" className="rounded-xl text-xs gap-1" onClick={() => setTab("purchased")}>
            <CheckCircle2 className="w-3.5 h-3.5" /> Đề đã mua ({purchased.length})
          </Button>
        </div>
      </div>

      {tab === "marketplace" ? (
        <>
          <p className="text-xs text-muted-foreground">Các đề thi thử phù hợp với bạn. Thanh toán 10.000đ / đề để bắt đầu luyện tập.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredMarketplace.map(e => (
              <div key={e.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-sm font-semibold text-foreground">{e.title}</h4>
                  <Badge className={cn("text-[10px]", difficultyStyle)}>{e.difficulty}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{e.duration} phút</div>
                  <div className="flex items-center gap-1"><FileText className="w-3 h-3" />{e.totalQuestions} câu</div>
                  <div className="flex items-center gap-1"><Trophy className="w-3 h-3" />TB: {e.communityAvgScore}%</div>
                  <div className="flex items-center gap-1"><Users className="w-3 h-3" />{e.attempts} lượt</div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-foreground">10.000đ</span>
                  <Badge variant="outline" className="text-[10px]">{e.subject}</Badge>
                </div>
                <Button className="w-full rounded-xl gap-1" size="sm" onClick={() => handlePurchase(e.id)}>
                  <ShoppingCart className="w-3.5 h-3.5" /> Mua đề
                </Button>
              </div>
            ))}
            {filteredMarketplace.length === 0 && <p className="text-sm text-muted-foreground text-center py-8 col-span-full">Không tìm thấy đề thi thử</p>}
          </div>
        </>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">Đề thi thử đã mua. Bạn có thể làm bài nhiều lần và xem lại bài làm trước đó.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPurchased.map(e => (
              <div key={e.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-sm font-semibold text-foreground">{e.title}</h4>
                  <Badge className={cn("text-[10px]", difficultyStyle)}>{e.difficulty}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{e.duration} phút</div>
                  <div className="flex items-center gap-1"><FileText className="w-3 h-3" />{e.totalQuestions} câu</div>
                  <div className="flex items-center gap-1"><Trophy className="w-3 h-3" />TB: {e.communityAvgScore}%</div>
                  <div className="flex items-center gap-1"><Users className="w-3 h-3" />{e.attemptHistory?.length || 0} lần làm</div>
                </div>
                {e.status === "completed" && e.score !== undefined && (
                  <div className="p-3 bg-muted/50 rounded-xl mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Điểm gần nhất</span>
                      <span className="text-sm font-bold text-foreground">{e.score}%</span>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button className="flex-1 rounded-xl text-xs" size="sm" onClick={() => startExam(e.id)}>
                    {e.status === "completed" ? "Làm lại" : "Bắt đầu thi"}
                  </Button>
                  {e.attemptHistory && e.attemptHistory.length > 0 && (
                    <Button variant="outline" className="rounded-xl text-xs gap-1" size="sm" onClick={() => setReviewAttempt({ examId: e.id, attemptIdx: e.attemptHistory!.length - 1 })}>
                      <Eye className="w-3 h-3" /> Xem lại
                    </Button>
                  )}
                </div>
                {/* Attempt History */}
                {e.attemptHistory && e.attemptHistory.length > 1 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-[10px] text-muted-foreground font-medium">Lịch sử làm bài:</p>
                    {e.attemptHistory.map((a, idx) => (
                      <button key={idx} onClick={() => setReviewAttempt({ examId: e.id, attemptIdx: idx })} className="w-full flex items-center justify-between p-2 bg-muted/30 rounded-lg text-xs hover:bg-muted transition-colors">
                        <span className="text-muted-foreground">Lần {idx + 1} - {a.date}</span>
                        <span className="font-semibold text-foreground">{a.score}%</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {filteredPurchased.length === 0 && <p className="text-sm text-muted-foreground text-center py-8 col-span-full">Chưa mua đề thi thử nào</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentMockExam;
