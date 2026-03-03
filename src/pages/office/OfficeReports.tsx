import { useOffice } from "@/contexts/OfficeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { BarChart3, Download, TrendingUp, Users, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const weeklyData = [
  { day: "T2", sessions: 12, issues: 1 },
  { day: "T3", sessions: 15, issues: 0 },
  { day: "T4", sessions: 10, issues: 2 },
  { day: "T5", sessions: 14, issues: 1 },
  { day: "T6", sessions: 16, issues: 0 },
  { day: "T7", sessions: 8, issues: 1 },
  { day: "CN", sessions: 5, issues: 0 },
];

const classDistribution = [
  { name: "Toán", value: 35 },
  { name: "Văn", value: 20 },
  { name: "Anh", value: 25 },
  { name: "Lý", value: 12 },
  { name: "Hóa", value: 8 },
];

const COLORS = ["hsl(220, 70%, 55%)", "hsl(160, 60%, 45%)", "hsl(35, 90%, 55%)", "hsl(280, 60%, 55%)", "hsl(350, 70%, 55%)"];

const OfficeReports = () => {
  const { attendance, classes, incidents } = useOffice();
  const { toast } = useToast();

  const kpis = [
    { label: "Tổng buổi học tuần", value: weeklyData.reduce((s, d) => s + d.sessions, 0), icon: BookOpen, color: "bg-blue-500/10 text-blue-600" },
    { label: "Tỷ lệ điểm danh", value: "94%", icon: TrendingUp, color: "bg-emerald-500/10 text-emerald-600" },
    { label: "Sự cố trong tuần", value: weeklyData.reduce((s, d) => s + d.issues, 0), icon: BarChart3, color: "bg-amber-500/10 text-amber-600" },
    { label: "HS đang học", value: classes.filter(c => c.status === "active").length * 1, icon: Users, color: "bg-purple-500/10 text-purple-600" },
  ];

  const exportReport = () => {
    const lines = [
      "BÁO CÁO TUẦN - VĂN PHÒNG EDUCONNECT",
      `Ngày: 03/03/2026`,
      "",
      "KPI:",
      ...kpis.map(k => `  ${k.label}: ${k.value}`),
      "",
      "THỐNG KÊ THEO NGÀY:",
      ...weeklyData.map(d => `  ${d.day}: ${d.sessions} buổi, ${d.issues} sự cố`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bao-cao-tuan-van-phong.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Đã xuất báo cáo" });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Báo cáo tuần này</h2>
        <Button variant="outline" className="rounded-xl" onClick={exportReport}><Download className="w-4 h-4 mr-1" /> Xuất báo cáo</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(k => (
          <Card key={k.label} className="border-border"><CardContent className="p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${k.color}`}><k.icon className="w-5 h-5" /></div>
            <p className="text-2xl font-bold text-foreground">{k.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{k.label}</p>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader className="pb-2"><CardTitle className="text-base">Buổi học & Sự cố theo ngày</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip />
                <Bar dataKey="sessions" name="Buổi học" fill="hsl(220, 70%, 55%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="issues" name="Sự cố" fill="hsl(350, 70%, 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2"><CardTitle className="text-base">Phân bổ lớp theo môn</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={classDistribution} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {classDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfficeReports;
