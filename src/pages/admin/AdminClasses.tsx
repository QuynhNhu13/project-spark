import { useAdmin } from "@/contexts/AdminContext";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit } from "lucide-react";
import type { AdminClass, ClassStatus, ClassFormat } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";

const statusLabel: Record<string, string> = { searching: "Đang tìm", active: "Đang học", completed: "Hoàn thành" };
const statusColor: Record<string, string> = { searching: "bg-yellow-100 text-yellow-700", active: "bg-green-100 text-green-700", completed: "bg-blue-100 text-blue-700" };
const formatLabel: Record<string, string> = { online: "Online", offline: "Offline", hybrid: "Hybrid" };

const emptyForm = { name: "", studentId: "", tutorId: "", format: "online" as ClassFormat, fee: 0, status: "searching" as ClassStatus, subject: "" };

const AdminClasses = () => {
  const { classes, users, addClass, updateClass, deleteClass, addTransaction } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();

  const students = users.filter(u => u.role === "student" && u.status === "approved");
  const tutors = users.filter(u => (u.role === "tutor" || u.role === "teacher") && u.status === "approved");

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (c: AdminClass) => { setForm({ name: c.name, studentId: c.studentId, tutorId: c.tutorId, format: c.format, fee: c.fee, status: c.status, subject: c.subject }); setEditId(c.id); setShowForm(true); };

  const handleSave = () => {
    if (!form.name || !form.studentId || !form.tutorId) { toast({ title: "Vui lòng điền đầy đủ", variant: "destructive" }); return; }
    if (editId) {
      updateClass(editId, form);
      toast({ title: "Đã cập nhật lớp học" });
    } else {
      addClass(form);
      if (form.fee > 0) {
        addTransaction({ userId: form.studentId, type: "tuition", amount: form.fee, date: new Date().toISOString().slice(0, 10), status: "pending", description: `Học phí ${form.name}` });
      }
      toast({ title: "Đã tạo lớp học" });
    }
    setShowForm(false);
  };

  const handleDelete = (c: AdminClass) => { deleteClass(c.id); toast({ title: `Đã xóa ${c.name}`, variant: "destructive" }); };

  const handleStatusChange = (id: string, status: string) => { updateClass(id, { status: status as ClassStatus }); };

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || "—";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Quản lý lớp học</h1>
        <Button className="rounded-full" onClick={openCreate}><Plus className="w-4 h-4 mr-1" /> Tạo lớp</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên lớp</TableHead>
                <TableHead>Học sinh</TableHead>
                <TableHead>Gia sư</TableHead>
                <TableHead>Hình thức</TableHead>
                <TableHead>Học phí</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                  <TableCell className="text-sm">{getUserName(c.studentId)}</TableCell>
                  <TableCell className="text-sm">{getUserName(c.tutorId)}</TableCell>
                  <TableCell className="text-sm">{formatLabel[c.format]}</TableCell>
                  <TableCell className="text-sm">{c.fee.toLocaleString("vi-VN")}đ</TableCell>
                  <TableCell>
                    <Select value={c.status} onValueChange={v => handleStatusChange(c.id, v)}>
                      <SelectTrigger className="w-28 h-7 text-xs rounded-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="searching">Đang tìm</SelectItem>
                        <SelectItem value="active">Đang học</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(c)}><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(c)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Sửa lớp học" : "Tạo lớp học mới"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Tên lớp</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-full" /></div>
            <div><Label>Môn</Label><Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="rounded-full" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Học sinh</Label>
                <Select value={form.studentId} onValueChange={v => setForm(f => ({ ...f, studentId: v }))}>
                  <SelectTrigger className="rounded-full"><SelectValue placeholder="Chọn" /></SelectTrigger>
                  <SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Gia sư / GV</Label>
                <Select value={form.tutorId} onValueChange={v => setForm(f => ({ ...f, tutorId: v }))}>
                  <SelectTrigger className="rounded-full"><SelectValue placeholder="Chọn" /></SelectTrigger>
                  <SelectContent>{tutors.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Hình thức</Label>
                <Select value={form.format} onValueChange={v => setForm(f => ({ ...f, format: v as ClassFormat }))}>
                  <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Học phí (VNĐ)</Label><Input type="number" value={form.fee} onChange={e => setForm(f => ({ ...f, fee: Number(e.target.value) }))} className="rounded-full" /></div>
            </div>
            <Button className="w-full rounded-full" onClick={handleSave}>{editId ? "Cập nhật" : "Tạo lớp"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminClasses;
