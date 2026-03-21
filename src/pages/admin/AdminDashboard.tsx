import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, GraduationCap, BookOpen, CreditCard, Clock, FileText, UserCheck, ArrowUpRight, ArrowDownRight, ChevronRight, Plus, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Pie, Cell, PieChart } from "recharts";

const DASHBOARD_THEME = {
  primary: "#1E68E6",
  success: "#16A34A",
  warning: "#f59e0b",
  danger: "#ef4444",
  neutral: "#94a3b8",
  muted: "#64748b",
};

const PIE_COLORS = [DASHBOARD_THEME.primary, DASHBOARD_THEME.success, DASHBOARD_THEME.warning, DASHBOARD_THEME.danger];

const AdminDashboard = () => {
  const { users, classes, tests, transactions, settings } = useAdmin();
  const navigate = useNavigate();

  // Mock demo data nếu chưa có data thật để demo nhanh
  const demoUsers = users.length ? users : [
    { id: "u1", name: "Mai Anh", role: "student", status: "active", avatar: "https://i.pravatar.cc/40?img=32", createdAt: "2024-02-01" },
    { id: "u2", name: "Nguyễn Dũng", role: "tutor", status: "active", avatar: "https://i.pravatar.cc/40?img=12", createdAt: "2024-03-10" },
    { id: "u3", name: "Lê Thảo", role: "parent", status: "pending", avatar: "https://i.pravatar.cc/40?img=8", createdAt: "2024-03-14" },
    { id: "u4", name: "Vũ Minh", role: "teacher", status: "active", avatar: "https://i.pravatar.cc/40?img=24", createdAt: "2024-03-08" },
    { id: "u5", name: "Trần Hương", role: "student", status: "active", avatar: "https://i.pravatar.cc/40?img=16", createdAt: "2024-03-02" },
    { id: "u6", name: "Phạm Khánh", role: "tutor", status: "pending", avatar: "https://i.pravatar.cc/40?img=36", createdAt: "2024-04-01" },
    { id: "u7", name: "Hoàng Long", role: "teacher", status: "active", avatar: "https://i.pravatar.cc/40?img=22", createdAt: "2024-03-12" },
    { id: "u8", name: "Đặng Sơn", role: "parent", status: "active", avatar: "https://i.pravatar.cc/40?img=20", createdAt: "2024-03-18" },
  ];

  const demoClasses = classes.length ? classes : [
    { id: "c1", name: "Toán lớp 10", tutorId: "u2", fee: 1900000, status: "active" },
    { id: "c2", name: "Hóa lớp 11", tutorId: "u4", fee: 2200000, status: "searching" },
    { id: "c3", name: "Anh văn giao tiếp", tutorId: "u2", fee: 1700000, status: "completed" },
    { id: "c4", name: "Lý luyện thi", tutorId: "u4", fee: 2200000, status: "active" },
    { id: "c5", name: "Vật lý 9", tutorId: "u7", fee: 1800000, status: "active" },
    { id: "c6", name: "Sinh học 12", tutorId: "u2", fee: 2300000, status: "completed" },
    { id: "c7", name: "Tiếng Anh thi Đại học", tutorId: "u6", fee: 2500000, status: "searching" },
  ];

  const demoTests = tests.length ? tests : [
    { id: "t1", createdAt: "2024-01-20" },
    { id: "t2", createdAt: "2024-02-02" },
    { id: "t3", createdAt: "2024-02-27" },
    { id: "t4", createdAt: "2024-03-05" },
    { id: "t5", createdAt: "2024-03-09" },
    { id: "t6", createdAt: "2024-03-11" },
    { id: "t7", createdAt: "2024-03-15" },
    { id: "t8", createdAt: "2024-03-17" },
  ];

  const demoTransactions = transactions.length ? transactions : [
    { id: "tx1", userId: "u1", date: "2024-01-18", amount: 900000, status: "completed", description: "Thanh toán lớp Toán" },
    { id: "tx2", userId: "u3", date: "2024-01-22", amount: 1200000, status: "completed", description: "Đăng ký lớp Hóa" },
    { id: "tx3", userId: "u2", date: "2024-02-01", amount: 1700000, status: "completed", description: "Thanh toán lớp Anh" },
    { id: "tx4", userId: "u4", date: "2024-02-15", amount: 2100000, status: "completed", description: "Thanh toán lớp Lý" },
    { id: "tx5", userId: "u1", date: "2024-03-02", amount: 1400000, status: "failed", description: "Thanh toán thất bại" },
    { id: "tx6", userId: "u8", date: "2024-03-05", amount: 2300000, status: "completed", description: "Đăng ký lớp Vật lý" },
    { id: "tx7", userId: "u5", date: "2024-03-10", amount: 1800000, status: "pending", description: "Đang chờ xác nhận" },
    { id: "tx8", userId: "u7", date: "2024-03-14", amount: 2500000, status: "refunded", description: "Hoàn tiền lớp Anh văn" },
    { id: "tx9", userId: "u6", date: "2024-03-18", amount: 2000000, status: "completed", description: "Thanh toán lớp Toán 11" },
  ];

  const userData = demoUsers;
  const classData = demoClasses;
  const testData = demoTests;
  const transactionData = demoTransactions;

  const totalUsers = userData.length;
  const totalTutorsTeachers = userData.filter(u => u.role === "tutor" || u.role === "teacher").length;
  const activeClasses = classData.filter(c => c.status === "active").length;
  const pendingApprovals = userData.filter(u => u.status === "pending").length;

  const now = new Date();
  const monthRevenue = transactionData
    .filter(t => t.status === "completed" && new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear())
    .reduce((sum, t) => sum + t.amount, 0);

  const monthTests = testData.filter(t => {
    const d = new Date(t.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const pendingUsers = userData.filter(u => u.status === "pending");
  const avgApprovalDays = pendingUsers.length > 0
    ? Math.round(pendingUsers.reduce((sum, u) => sum + Math.ceil((now.getTime() - new Date(u.createdAt).getTime()) / 86400000), 0) / pendingUsers.length)
    : 0;

  const topStats = [
    { label: "Tổng người dùng", value: totalUsers, icon: Users, change: "+12%", up: true, bg: "from-blue-700 to-blue-900", iconBg: "bg-blue-100", iconColor: "text-blue-700" },
    { label: "Gia sư & Giáo viên", value: totalTutorsTeachers, icon: GraduationCap, change: "+8%", up: true, bg: "from-emerald-500 to-teal-500", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
    { label: "Lớp đang hoạt động", value: activeClasses, icon: BookOpen, change: "+5%", up: true, bg: "from-amber-500 to-orange-500", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
    { label: "Doanh thu tháng", value: `${(monthRevenue / 1000000).toFixed(1)}M`, icon: CreditCard, change: "+18%", up: true, bg: "from-rose-500 to-pink-500", iconBg: "bg-rose-100", iconColor: "text-rose-600" },
  ];

  const recentClasses = classData.filter(c => c.status === "searching" || c.status === "active").slice(0, 4);
  const recentTransactions = transactionData.slice(0, 5);

  const monthlyData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const month = `Tháng ${d.getMonth() + 1}`;
    const revenue = transactionData
      .filter((t) => t.status === "completed" && new Date(t.date).getMonth() === d.getMonth())
      .reduce((s, t) => s + t.amount, 0);
    return { month, revenue };
  });

  const roleNameMap: Record<string, string> = {
    tutor: "Gia sư",
    teacher: "Giáo viên",
    student: "Học sinh",
    parent: "Phụ huynh",
  };

  const usersByRole = ["tutor", "teacher", "student", "parent"].map((role) => ({
    name: roleNameMap[role] || role,
    value: userData.filter((u) => u.role === role).length,
  }));

  const getUserName = (id: string) => userData.find(u => u.id === id)?.name || "—";

  const statusLabel: Record<string, string> = { searching: "Đang tìm", active: "Đang học", completed: "Hoàn thành" };
  const statusClass: Record<string, string> = {
    searching: "bg-amber-100 text-amber-700",
    active: "bg-blue-100 text-blue-700",
    completed: "bg-emerald-100 text-emerald-700",
  };

  const txStatusLabel: Record<string, string> = { completed: "Hoàn thành", pending: "Đang xử lý", failed: "Thất bại", refunded: "Hoàn tiền" };
  const txStatusClass: Record<string, string> = {
    completed: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    failed: "bg-red-100 text-red-700",
    refunded: "bg-sky-100 text-sky-700",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top 4 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topStats.map(s => (
          <Card key={s.label} className={`border-0 shadow-soft hover:shadow-elevated transition-shadow duration-300 bg-gradient-to-r ${s.bg} text-white`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-[13px] text-white/80 font-medium">{s.label}</p>
                  <p className="text-3xl font-bold text-white tracking-tight">{s.value}</p>
                  <div className="flex items-center gap-1">
                    {s.up ? <ArrowUpRight className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,.9)" }} /> : <ArrowDownRight className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,.9)" }} />}
                    <span className="text-xs font-semibold text-white/90">{s.change}</span>
                    <span className="text-xs text-white/70">vs tháng trước</span>
                  </div>
                </div>
                <div className="w-11 h-11 rounded-full flex items-center justify-center border border-white/30 bg-white/20 backdrop-blur-sm shadow-sm">
                  <s.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-soft">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-[13px] text-muted-foreground font-medium">Chờ phê duyệt</p>
                  <p className="text-2xl font-bold text-slate-900">{pendingApprovals}</p>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full rounded-xl text-xs" onClick={() => navigate("/admin/approvals")}>
              Xem ngay <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <FileText className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="text-[13px] text-muted-foreground font-medium">Bài test tháng này</p>
                <p className="text-2xl font-bold text-foreground">{monthTests}</p>
              </div>
            </div>
            <div className="flex items-end gap-1.5 h-10">
              {[40, 65, 55, 80, 70, 90, 60].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-blue-100/50 relative overflow-hidden" style={{ height: `${h}%` }}>
                  <div className="absolute bottom-0 w-full rounded-sm" style={{ height: `${h}%`, backgroundColor: DASHBOARD_THEME.primary }} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[13px] text-muted-foreground font-medium">TB phê duyệt</p>
                <p className="text-2xl font-bold text-foreground">{avgApprovalDays} ngày</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                  <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${Math.min(avgApprovalDays * 10, 125)} 125`} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-foreground">{avgApprovalDays}d</span>
              </div>
              <p className="text-xs text-muted-foreground">Mục tiêu: &lt; 3 ngày</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 border-0 shadow-soft">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Doanh thu theo tháng</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.35)" />
                <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 12 }} />
                <YAxis tick={{ fill: "#475569", fontSize: 12 }} tickFormatter={(v) => `${Math.round(v / 1000000)}M`} />
                <Tooltip
                  formatter={(v: number) => [`${v.toLocaleString("vi-VN")} đ`, "Doanh thu"]}
                  cursor={{ fill: "rgba(30, 58, 138, 0.06)" }}
                />
                <Bar dataKey="revenue" fill={DASHBOARD_THEME.primary} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><PieChartIcon className="w-4 h-4" /> Cơ cấu người dùng</h3>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={usersByRole} dataKey="value" nameKey="name" outerRadius={85} label>
                    {usersByRole.map((entry, index) => <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(148, 163, 184, 0.4)", color: "white" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes + Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="border-0 shadow-soft">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Quản lý lớp học</h3>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => navigate("/admin/classes")}>
                Xem tất cả <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              {recentClasses.map(c => (
                <div key={c.id} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{getUserName(c.tutorId)} · {c.fee.toLocaleString("vi-VN")}đ</p>
                  </div>
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${statusClass[c.status] ?? "bg-slate-100 text-slate-700"}`}>
                    {statusLabel[c.status]}
                  </span>
                </div>
              ))}
              {recentClasses.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Chưa có lớp học</p>}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3 rounded-xl text-xs" onClick={() => navigate("/admin/classes")}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Tạo lớp mới
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Giao dịch gần đây</h3>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => navigate("/admin/transactions")}>
                Xem tất cả <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              {recentTransactions.map(tx => {
                const user = users.find(u => u.id === tx.userId);
                return (
                  <div key={tx.id} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-muted/30 transition-colors">
                    {user?.avatar && <img src={user.avatar} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />}
                    <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{user?.name || "—"} · {tx.date}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-foreground">{tx.amount.toLocaleString("vi-VN")}đ</p>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${txStatusClass[tx.status] ?? "bg-slate-100 text-slate-700"}`}>
                        {txStatusLabel[tx.status]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
