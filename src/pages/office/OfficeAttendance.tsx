import { useOffice } from "@/contexts/OfficeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, Clock, AlertTriangle, CalendarDays, ClipboardCheck } from "lucide-react";
import { useState } from "react";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Chờ xác nhận", variant: "outline" },
  confirmed: { label: "Đã xác nhận", variant: "default" },
  reported: { label: "Đã báo lỗi", variant: "destructive" },
  upcoming: { label: "Sắp tới", variant: "secondary" },
  completed: { label: "Đã học", variant: "default" },
};

const OfficeAttendance = () => {
  const { attendance, confirmAttendance } = useOffice();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = attendance.filter(a => {
    const matchSearch = a.className.toLowerCase().includes(search.toLowerCase()) || a.student.toLowerCase().includes(search.toLowerCase()) || a.tutor.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pending = attendance.filter(a => a.status === "pending").length;
  const completed = attendance.filter(a => a.status === "completed").length;
  const reported = attendance.filter(a => a.status === "reported").length;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div>
          <div><p className="text-xl font-bold text-foreground">{pending}</p><p className="text-xs text-muted-foreground">Chờ xác nhận</p></div>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
          <div><p className="text-xl font-bold text-foreground">{completed}</p><p className="text-xs text-muted-foreground">Đã hoàn thành</p></div>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
          <div><p className="text-xl font-bold text-foreground">{reported}</p><p className="text-xs text-muted-foreground">Đã báo lỗi</p></div>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><CalendarDays className="w-5 h-5 text-blue-600" /></div>
          <div><p className="text-xl font-bold text-foreground">{attendance.length}</p><p className="text-xs text-muted-foreground">Tổng buổi học</p></div>
        </CardContent></Card>
      </div>

      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <CardTitle className="text-base flex items-center gap-2"><ClipboardCheck className="w-4 h-4" /> Danh sách buổi học</CardTitle>
            <div className="flex gap-2">
              <Input placeholder="Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)} className="w-48 h-9 text-sm rounded-xl" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 h-9 text-sm rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Chờ xác nhận</SelectItem>
                  <SelectItem value="completed">Đã học</SelectItem>
                  <SelectItem value="reported">Đã báo lỗi</SelectItem>
                  <SelectItem value="upcoming">Sắp tới</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lớp học</TableHead>
                <TableHead>Gia sư</TableHead>
                <TableHead>Học sinh</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Giờ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>PH xác nhận</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(a => {
                const cfg = statusConfig[a.status];
                return (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.className}</TableCell>
                    <TableCell>{a.tutor}</TableCell>
                    <TableCell>{a.student}</TableCell>
                    <TableCell>{a.date}</TableCell>
                    <TableCell>{a.time}</TableCell>
                    <TableCell><Badge variant={cfg.variant}>{cfg.label}</Badge></TableCell>
                    <TableCell>
                      {a.parentConfirmed ? <Badge variant="default">Đã xác nhận</Badge> : <Badge variant="outline">Chưa</Badge>}
                    </TableCell>
                    <TableCell>
                      {a.status === "pending" && (
                        <Button size="sm" variant="outline" className="text-xs rounded-xl" onClick={() => confirmAttendance(a.id)}>
                          Xác nhận
                        </Button>
                      )}
                      {a.status === "reported" && (
                        <Button size="sm" variant="destructive" className="text-xs rounded-xl" onClick={() => confirmAttendance(a.id)}>
                          Xử lý
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfficeAttendance;
