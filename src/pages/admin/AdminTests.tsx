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
import type { AdminTest, TestType, TestStatus } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";

const statusLabel: Record<string, string> = { active: "Hoạt động", draft: "Bản nháp", archived: "Đã lưu trữ" };
const statusColor: Record<string, string> = { active: "bg-green-100 text-green-700", draft: "bg-yellow-100 text-yellow-700", archived: "bg-gray-100 text-gray-700" };

const emptyForm = { code: "", name: "", subject: "", level: "", type: "multiple-choice" as TestType, status: "draft" as TestStatus };

const AdminTests = () => {
  const { tests, addTest, updateTest, deleteTest } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();

  const openCreate = () => { setForm({ ...emptyForm, code: `T${String(tests.length + 1).padStart(3, "0")}` }); setEditId(null); setShowForm(true); };
  const openEdit = (t: AdminTest) => { setForm({ code: t.code, name: t.name, subject: t.subject, level: t.level, type: t.type, status: t.status }); setEditId(t.id); setShowForm(true); };

  const handleSave = () => {
    if (!form.name || !form.code) { toast({ title: "Vui lòng điền đầy đủ", variant: "destructive" }); return; }
    if (editId) {
      updateTest(editId, form);
      toast({ title: "Đã cập nhật bài test" });
    } else {
      addTest(form);
      toast({ title: "Đã tạo bài test" });
    }
    setShowForm(false);
  };

  const handleDelete = (t: AdminTest) => { deleteTest(t.id); toast({ title: `Đã xóa ${t.code}`, variant: "destructive" }); };
  const handleStatusChange = (id: string, status: string) => { updateTest(id, { status: status as TestStatus }); };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Quản lý bài test</h1>
        <Button className="rounded-full" onClick={openCreate}><Plus className="w-4 h-4 mr-1" /> Tạo bài test</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Tên bài</TableHead>
                <TableHead>Môn</TableHead>
                <TableHead>Cấp độ</TableHead>
                <TableHead>Loại hình</TableHead>
                <TableHead>Lượt thi</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-sm">{t.code}</TableCell>
                  <TableCell className="font-medium text-foreground">{t.name}</TableCell>
                  <TableCell className="text-sm">{t.subject}</TableCell>
                  <TableCell className="text-sm">{t.level}</TableCell>
                  <TableCell className="text-sm">{t.type === "multiple-choice" ? "Trắc nghiệm" : "Tự luận"}</TableCell>
                  <TableCell className="text-sm font-medium">{t.attempts}</TableCell>
                  <TableCell>
                    <Select value={t.status} onValueChange={v => handleStatusChange(t.id, v)}>
                      <SelectTrigger className="w-28 h-7 text-xs rounded-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="draft">Bản nháp</SelectItem>
                        <SelectItem value="archived">Đã lưu trữ</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(t)}><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(t)}><Trash2 className="w-4 h-4" /></Button>
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
          <DialogHeader><DialogTitle>{editId ? "Sửa bài test" : "Tạo bài test mới"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Mã bài test</Label><Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className="rounded-full" /></div>
              <div><Label>Môn</Label><Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="rounded-full" /></div>
            </div>
            <div><Label>Tên bài test</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-full" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Cấp độ</Label><Input value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} className="rounded-full" /></div>
              <div>
                <Label>Loại hình</Label>
                <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as TestType }))}>
                  <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">Trắc nghiệm</SelectItem>
                    <SelectItem value="essay">Tự luận</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full rounded-full" onClick={handleSave}>{editId ? "Cập nhật" : "Tạo bài test"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTests;
