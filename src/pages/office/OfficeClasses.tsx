import { useOffice } from "@/contexts/OfficeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Đang học", variant: "default" },
  completed: { label: "Hoàn thành", variant: "secondary" },
  paused: { label: "Tạm dừng", variant: "outline" },
  searching: { label: "Đang tìm", variant: "destructive" },
};

const OfficeClasses = () => {
  const { classes, addClass } = useOffice();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [newClass, setNewClass] = useState({ name: "", subject: "", fee: "" });

  const filtered = classes.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.tutor.toLowerCase().includes(search.toLowerCase()) || c.student.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreate = () => {
    if (!newClass.name || !newClass.subject) return;
    addClass({
      id: `c${Date.now()}`,
      name: newClass.name,
      tutor: "Chưa phân công",
      tutorAvatar: "",
      student: "Chưa có",
      studentAvatar: "",
      schedule: "Chưa xếp",
      fee: parseInt(newClass.fee) || 0,
      status: "searching",
      subject: newClass.subject,
      totalSessions: 0,
      completedSessions: 0,
    });
    setNewClass({ name: "", subject: "", fee: "" });
    setShowCreate(false);
    toast({ title: "Tạo lớp thành công", description: `Lớp "${newClass.name}" đã được tạo` });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Input placeholder="Tìm kiếm lớp..." value={search} onChange={e => setSearch(e.target.value)} className="w-64 h-9 text-sm rounded-xl" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 h-9 text-sm rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Đang học</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
              <SelectItem value="searching">Đang tìm</SelectItem>
              <SelectItem value="paused">Tạm dừng</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button className="rounded-xl"><Plus className="w-4 h-4 mr-1" /> Tạo lớp mới</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Tạo lớp học mới</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Tên lớp</Label><Input value={newClass.name} onChange={e => setNewClass(p => ({ ...p, name: e.target.value }))} placeholder="VD: Toán 12 - Nâng cao" className="rounded-xl mt-1" /></div>
              <div><Label>Môn học</Label><Input value={newClass.subject} onChange={e => setNewClass(p => ({ ...p, subject: e.target.value }))} placeholder="VD: Toán" className="rounded-xl mt-1" /></div>
              <div><Label>Học phí (VNĐ)</Label><Input type="number" value={newClass.fee} onChange={e => setNewClass(p => ({ ...p, fee: e.target.value }))} placeholder="VD: 2000000" className="rounded-xl mt-1" /></div>
              <Button onClick={handleCreate} className="w-full rounded-xl">Tạo lớp</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lớp học</TableHead>
                <TableHead>Gia sư</TableHead>
                <TableHead>Học sinh</TableHead>
                <TableHead>Lịch học</TableHead>
                <TableHead>Học phí</TableHead>
                <TableHead>Tiến độ</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => {
                const cfg = statusMap[c.status];
                const progress = c.totalSessions > 0 ? Math.round((c.completedSessions / c.totalSessions) * 100) : 0;
                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.subject}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {c.tutorAvatar && <img src={c.tutorAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />}
                        <span className="text-sm">{c.tutor}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {c.studentAvatar && <img src={c.studentAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />}
                        <span className="text-sm">{c.student}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{c.schedule}</TableCell>
                    <TableCell className="text-sm font-medium">{c.fee.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>
                      <div className="w-24">
                        <Progress value={progress} className="h-2" />
                        <p className="text-[10px] text-muted-foreground mt-1">{c.completedSessions}/{c.totalSessions} buổi</p>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant={cfg.variant}>{cfg.label}</Badge></TableCell>
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

export default OfficeClasses;
