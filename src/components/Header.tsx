import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const demoRoles = [
  { name: "Admin", path: "/demo/admin" },
  { name: "Gia sư", path: "/demo/tutor" },
  { name: "Giáo viên", path: "/demo/teacher" },
  { name: "Học sinh", path: "/demo/student" },
  { name: "Phụ huynh", path: "/demo/parent" },
  { name: "Kế toán", path: "/demo/accountant" },
  { name: "Văn phòng", path: "/demo/office" },
  { name: "Quản lý đề", path: "/demo/exam-manager" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">E</span>
          </div>
          <span className="font-bold text-xl text-foreground">
            Edu<span className="text-secondary">Connect</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/find-tutor" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Tìm gia sư
          </Link>
          <Link to="/exam-online" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Thi thử Online
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Demo <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {demoRoles.map((role) => (
                <DropdownMenuItem key={role.path} asChild>
                  <Link to={role.path}>{role.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/login">Đăng nhập</Link>
          </Button>
          <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            <Link to="/register">Đăng ký</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4 space-y-3">
          <Link to="/find-tutor" className="block py-2 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Tìm gia sư</Link>
          <Link to="/exam-online" className="block py-2 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Thi thử Online</Link>
          <details className="group">
            <summary className="py-2 text-sm font-medium text-muted-foreground cursor-pointer list-none flex items-center gap-1">
              Demo <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="pl-4 space-y-1">
              {demoRoles.map((role) => (
                <Link key={role.path} to={role.path} className="block py-1.5 text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>
                  {role.name}
                </Link>
              ))}
            </div>
          </details>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" asChild className="flex-1">
              <Link to="/login" onClick={() => setMobileOpen(false)}>Đăng nhập</Link>
            </Button>
            <Button asChild className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Link to="/register" onClick={() => setMobileOpen(false)}>Đăng ký</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
