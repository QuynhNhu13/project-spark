import { useAdmin } from "@/contexts/AdminContext";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Eye, Search } from "lucide-react";
import type { AdminUser, UserStatus } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";

const roleTabs = [
  { value: "all", label: "Tất cả" },
  { value: "tutor", label: "Gia sư" },
  { value: "teacher", label: "Giáo viên" },
  { value: "student", label: "Học sinh" },
  { value: "parent", label: "Phụ huynh" },
];

const statusLabel: Record<string, string> = { pending: "Chờ duyệt", approved: "Đã duyệt", rejected: "Từ chối", suspended: "Tạm khóa" };
const statusColor: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700", approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700", suspended: "bg-gray-100 text-gray-700" };
const roleLabel: Record<string, string> = { tutor: "Gia sư", teacher: "Giáo viên", student: "Học sinh", parent: "Phụ huynh", admin: "Admin", accountant: "Kế toán", office: "Văn phòng", "exam-manager": "QL Đề" };

const AdminUsers = () => {
  const { users, updateUserStatus, deleteUser } = useAdmin();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<AdminUser | null>(null);
  const { toast } = useToast();

  const filtered = users.filter(u => {
    if (tab !== "all" && u.role !== tab) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDelete = (u: AdminUser) => {
    deleteUser(u.id);
    toast({ title: `Đã xóa ${u.name}`, variant: "destructive" });
  };

  const handleStatusChange = (id: string, status: string) => {
    updateUserStatus(id, status as UserStatus);
    toast({ title: "Đã cập nhật trạng thái" });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Quản lý người dùng</h1>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Tìm theo tên hoặc email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 rounded-full" />
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          {roleTabs.map(r => <TabsTrigger key={r.value} value={r.value}>{r.label}</TabsTrigger>)}
        </TabsList>
        <TabsContent value={tab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(u => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="font-medium text-foreground">{u.name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><span className="text-sm">{roleLabel[u.role]}</span></TableCell>
                      <TableCell>
                        <Select value={u.status} onValueChange={v => handleStatusChange(u.id, v)}>
                          <SelectTrigger className="w-32 h-8 rounded-full text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Chờ duyệt</SelectItem>
                            <SelectItem value="approved">Đã duyệt</SelectItem>
                            <SelectItem value="rejected">Từ chối</SelectItem>
                            <SelectItem value="suspended">Tạm khóa</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{u.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => setDetail(u)}><Eye className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(u)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Không tìm thấy người dùng</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Chi tiết người dùng</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <img src={detail.avatar} className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-lg text-foreground">{detail.name}</p>
                  <p className="text-sm text-muted-foreground">{roleLabel[detail.role]}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{detail.email}</span></div>
                <div><span className="text-muted-foreground">SĐT:</span> <span className="text-foreground">{detail.phone}</span></div>
                <div><span className="text-muted-foreground">Trạng thái:</span> <span className={`px-2 py-0.5 rounded-full text-xs ${statusColor[detail.status]}`}>{statusLabel[detail.status]}</span></div>
                <div><span className="text-muted-foreground">Ngày tạo:</span> <span className="text-foreground">{detail.createdAt}</span></div>
                {detail.subject && <div><span className="text-muted-foreground">Môn:</span> <span className="text-foreground">{detail.subject}</span></div>}
              </div>
              {detail.bio && <p className="text-sm text-foreground bg-muted p-3 rounded-lg">{detail.bio}</p>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
