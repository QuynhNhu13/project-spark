import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, CheckCircle, BookOpen, FileText, CreditCard, BarChart3, ScrollText, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Tổng quan", end: true },
  { to: "/admin/approvals", icon: CheckCircle, label: "Phê duyệt" },
  { to: "/admin/users", icon: Users, label: "Người dùng" },
  { to: "/admin/classes", icon: BookOpen, label: "Lớp học" },
  { to: "/admin/tests", icon: FileText, label: "Bài test" },
  { to: "/admin/transactions", icon: CreditCard, label: "Giao dịch" },
  { to: "/admin/reports", icon: BarChart3, label: "Báo cáo" },
  { to: "/admin/audit", icon: ScrollText, label: "Audit Log" },
  { to: "/admin/settings", icon: Settings, label: "Cài đặt" },
];

const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col shrink-0">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-foreground">EduConnect</h1>
          <p className="text-xs text-muted-foreground mt-1">Admin Dashboard</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Về trang chủ
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
