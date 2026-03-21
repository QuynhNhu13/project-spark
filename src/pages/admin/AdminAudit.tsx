import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollText, Shield, Clock, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const actionColor: Record<string, string> = {
  "Duyệt tài khoản": "bg-success/150/10 text-success",
  "Từ chối tài khoản": "bg-destructive/10 text-destructive",
  "Xóa người dùng": "bg-destructive/10 text-destructive",
  "Tạo lớp học": "bg-primary/10 text-primary",
  "Cập nhật lớp học": "bg-warning/150/10 text-warning",
  "Xóa lớp học": "bg-destructive/10 text-destructive",
  "Tạo bài test": "bg-primary/10 text-primary",
  "Cập nhật bài test": "bg-warning/150/10 text-warning",
  "Xóa bài test": "bg-destructive/10 text-destructive",
  "Cập nhật cài đặt": "bg-muted text-muted-foreground",
  "Thêm giao dịch": "bg-success/150/10 text-success",
};

const AdminAudit = () => {
  const { auditLog } = useAdmin();
  const [search, setSearch] = useState("");
  const [periodType, setPeriodType] = useState("month");
  const [monthFilter, setMonthFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filtered = auditLog.filter((log) => {
    const q = search.toLowerCase();
    if (search && !log.action.toLowerCase().includes(q) && !log.target.toLowerCase().includes(q) && !log.actor.toLowerCase().includes(q)) return false;

    const d = new Date(log.timestamp.replace(" ", "T"));
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear());
    const dateOnly = d.toISOString().slice(0, 10);

    if (periodType === "month" && monthFilter !== "all" && month !== monthFilter) return false;
    if (periodType === "year" && yearFilter !== "all" && year !== yearFilter) return false;
    if (periodType === "custom") {
      if (!fromDate || !toDate) return false;
      if (dateOnly < fromDate || dateOnly > toDate) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="p-6 space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ScrollText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{auditLog.length}</p>
              <p className="text-xs text-muted-foreground">Tổng log</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/150/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{auditLog.filter(l => l.action.includes("Duyệt")).length}</p>
              <p className="text-xs text-muted-foreground">Phê duyệt</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <User className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{auditLog.filter(l => l.action.includes("Xóa")).length}</p>
              <p className="text-xs text-muted-foreground">Xóa dữ liệu</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <div className="flex gap-2 flex-wrap">
        <Input placeholder="Tìm theo hành động/đối tượng..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="max-w-sm" />
        <Select value={periodType} onValueChange={(v) => { setPeriodType(v); setPage(1); }}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Theo tháng</SelectItem>
            <SelectItem value="year">Theo năm</SelectItem>
            <SelectItem value="custom">Khoảng tùy chọn</SelectItem>
          </SelectContent>
        </Select>
        {periodType === "month" && (
          <Select value={monthFilter} onValueChange={(v) => { setMonthFilter(v); setPage(1); }}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Tháng" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả tháng</SelectItem>
              {Array.from({ length: 12 }, (_, i) => <SelectItem key={i + 1} value={String(i + 1).padStart(2, "0")}>Tháng {i + 1}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        {periodType === "year" && (
          <Select value={yearFilter} onValueChange={(v) => { setYearFilter(v); setPage(1); }}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Năm" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả năm</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
        )}
        {periodType === "custom" && (
          <>
            <Input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} className="w-40" />
            <Input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }} className="w-40" />
          </>
        )}
      </div>

      <Card className="border-0 shadow-soft overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold">Thời gian</TableHead>
                <TableHead className="font-semibold">Người thực hiện</TableHead>
                <TableHead className="font-semibold">Hành động</TableHead>
                <TableHead className="font-semibold">Đối tượng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(log => (
                <TableRow key={log.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-mono text-xs">{log.timestamp}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{log.actor}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${actionColor[log.action] || "bg-muted text-muted-foreground"}`}>
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.target}</TableCell>
                </TableRow>
              ))}
              {paginated.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-12">Chưa có log nào</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filtered.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Hiển thị {(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, filtered.length)} / {filtered.length}</p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`h-8 min-w-8 px-2 rounded-lg text-xs font-medium ${page === i + 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAudit;
