import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, CreditCard, Clock, FileText, UserCheck } from "lucide-react";

const AdminDashboard = () => {
  const { users, classes, tests, transactions } = useAdmin();

  const totalUsers = users.length;
  const totalTutorsTeachers = users.filter(u => u.role === "tutor" || u.role === "teacher").length;
  const activeClasses = classes.filter(c => c.status === "active").length;
  const pendingApprovals = users.filter(u => u.status === "pending").length;

  const now = new Date();
  const monthRevenue = transactions
    .filter(t => t.status === "completed" && new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear())
    .reduce((sum, t) => sum + t.amount, 0);

  const monthTests = tests.filter(t => {
    const d = new Date(t.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const pendingUsers = users.filter(u => u.status === "pending");
  const avgApprovalDays = pendingUsers.length > 0
    ? Math.round(pendingUsers.reduce((sum, u) => sum + Math.ceil((now.getTime() - new Date(u.createdAt).getTime()) / 86400000), 0) / pendingUsers.length)
    : 0;

  const stats = [
    { label: "Tổng người dùng", value: totalUsers, icon: Users, color: "text-primary" },
    { label: "Gia sư & Giáo viên", value: totalTutorsTeachers, icon: GraduationCap, color: "text-neon-foreground" },
    { label: "Lớp đang hoạt động", value: activeClasses, icon: BookOpen, color: "text-primary" },
    { label: "Doanh thu tháng", value: `${(monthRevenue / 1000000).toFixed(1)}M`, icon: CreditCard, color: "text-neon-foreground" },
    { label: "Chờ phê duyệt", value: pendingApprovals, icon: UserCheck, color: "text-destructive" },
    { label: "Bài test tháng này", value: monthTests, icon: FileText, color: "text-primary" },
    { label: "TB phê duyệt (ngày)", value: `${avgApprovalDays}d`, icon: Clock, color: "text-muted-foreground" },
  ];

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Tổng quan</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <s.icon className={`w-8 h-8 ${s.color}`} />
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Giao dịch gần đây</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map(tx => {
              const user = users.find(u => u.id === tx.userId);
              return (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{user?.name} · {tx.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{tx.amount.toLocaleString("vi-VN")}đ</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${tx.status === "completed" ? "bg-green-100 text-green-700" : tx.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                      {tx.status === "completed" ? "Hoàn thành" : tx.status === "pending" ? "Đang xử lý" : "Thất bại"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
