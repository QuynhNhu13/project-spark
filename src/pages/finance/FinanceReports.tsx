import { useFinance } from "@/contexts/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from "recharts";
import { Download, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const monthlyData = [
  { month: "T10", revenue: 28000000, expense: 22000000, profit: 6000000 },
  { month: "T11", revenue: 32000000, expense: 25000000, profit: 7000000 },
  { month: "T12", revenue: 35000000, expense: 27000000, profit: 8000000 },
  { month: "T1", revenue: 30000000, expense: 23000000, profit: 7000000 },
  { month: "T2", revenue: 38000000, expense: 29000000, profit: 9000000 },
  { month: "T3", revenue: 42000000, expense: 31000000, profit: 11000000 },
];

const expenseBreakdown = [
  { name: "Lương gia sư", value: 65 },
  { name: "Hoàn tiền", value: 8 },
  { name: "Vận hành", value: 15 },
  { name: "Marketing", value: 12 },
];

const topTutors = [
  { name: "Nguyễn Văn An", revenue: 12800000, classes: 3 },
  { name: "Trần Thị Bích", revenue: 9600000, classes: 2 },
  { name: "Đỗ Quang Minh", revenue: 7200000, classes: 1 },
  { name: "Vũ Thị Phương", revenue: 5100000, classes: 1 },
  { name: "Hoàng Đức Em", revenue: 3600000, classes: 1 },
];

const COLORS = ["hsl(160, 60%, 45%)", "hsl(350, 70%, 55%)", "hsl(220, 70%, 55%)", "hsl(35, 90%, 55%)"];

const FinanceReports = () => {
  const { transactions } = useFinance();
  const { toast } = useToast();

  const totalRevenue = monthlyData[monthlyData.length - 1].revenue;
  const totalExpense = monthlyData[monthlyData.length - 1].expense;
  const totalProfit = monthlyData[monthlyData.length - 1].profit;

  const exportReport = () => {
    const lines = [
      "BÁO CÁO TÀI CHÍNH - EDUCONNECT",
      `Kỳ: T3/2026`,
      "",
      `Doanh thu: ${totalRevenue.toLocaleString("vi-VN")}đ`,
      `Chi phí: ${totalExpense.toLocaleString("vi-VN")}đ`,
      `Lợi nhuận: ${totalProfit.toLocaleString("vi-VN")}đ`,
      "",
      "TOP GIA SƯ:",
      ...topTutors.map((t, i) => `  ${i + 1}. ${t.name}: ${t.revenue.toLocaleString("vi-VN")}đ (${t.classes} lớp)`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bao-cao-tai-chinh.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Đã xuất báo cáo tài chính" });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Báo cáo tài chính</h2>
        <Button variant="outline" className="rounded-xl" onClick={exportReport}><Download className="w-4 h-4 mr-1" /> Xuất báo cáo</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border"><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2"><DollarSign className="w-4 h-4 text-emerald-600" /><span className="text-xs text-muted-foreground">Doanh thu T3</span></div>
          <p className="text-xl font-bold text-emerald-600">{totalRevenue.toLocaleString("vi-VN")}đ</p>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1"><TrendingUp className="w-3 h-3" /> +10.5% so với T2</p>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingDown className="w-4 h-4 text-red-600" /><span className="text-xs text-muted-foreground">Chi phí T3</span></div>
          <p className="text-xl font-bold text-red-600">{totalExpense.toLocaleString("vi-VN")}đ</p>
          <p className="text-xs text-red-600 flex items-center gap-1 mt-1"><TrendingUp className="w-3 h-3" /> +6.9% so với T2</p>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-blue-600" /><span className="text-xs text-muted-foreground">Lợi nhuận T3</span></div>
          <p className="text-xl font-bold text-foreground">{totalProfit.toLocaleString("vi-VN")}đ</p>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1"><TrendingUp className="w-3 h-3" /> +22.2% so với T2</p>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="rounded-xl">
          <TabsTrigger value="overview" className="rounded-xl text-xs">Tổng quan</TabsTrigger>
          <TabsTrigger value="expense" className="rounded-xl text-xs">Chi phí</TabsTrigger>
          <TabsTrigger value="tutors" className="rounded-xl text-xs">Top gia sư</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="border-border">
            <CardHeader className="pb-2"><CardTitle className="text-base">Doanh thu, Chi phí & Lợi nhuận</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip formatter={(v: number) => `${v.toLocaleString("vi-VN")}đ`} />
                  <Legend />
                  <Bar dataKey="revenue" name="Doanh thu" fill="hsl(160, 60%, 45%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Chi phí" fill="hsl(350, 70%, 55%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" name="Lợi nhuận" fill="hsl(220, 70%, 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expense">
          <Card className="border-border">
            <CardHeader className="pb-2"><CardTitle className="text-base">Cơ cấu chi phí</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={expenseBreakdown} cx="50%" cy="50%" outerRadius={120} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {expenseBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tutors">
          <Card className="border-border">
            <CardHeader className="pb-2"><CardTitle className="text-base">Top gia sư theo doanh thu</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {topTutors.map((t, i) => (
                <div key={t.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-amber-500/20 text-amber-600" : i === 1 ? "bg-gray-300/30 text-gray-600" : i === 2 ? "bg-orange-500/20 text-orange-600" : "bg-muted text-muted-foreground"}`}>
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.classes} lớp</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-foreground">{t.revenue.toLocaleString("vi-VN")}đ</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceReports;
