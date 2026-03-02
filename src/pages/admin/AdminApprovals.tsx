import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { AdminUser } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";

const roleLabel: Record<string, string> = { tutor: "Gia sư", teacher: "Giáo viên", student: "Học sinh", parent: "Phụ huynh" };

const AdminApprovals = () => {
  const { users, approveUser, rejectUser } = useAdmin();
  const [detail, setDetail] = useState<AdminUser | null>(null);
  const { toast } = useToast();

  const pending = users.filter(u => u.status === "pending");

  const handleApprove = (id: string) => {
    approveUser(id);
    toast({ title: "Đã duyệt tài khoản" });
  };

  const handleReject = (id: string) => {
    rejectUser(id);
    toast({ title: "Đã từ chối tài khoản", variant: "destructive" });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Phê duyệt tài khoản</h1>
      <p className="text-muted-foreground">{pending.length} tài khoản đang chờ phê duyệt</p>

      {pending.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">Không có tài khoản nào chờ duyệt.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {pending.map(u => (
            <Card key={u.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{u.name}</p>
                  <p className="text-sm text-muted-foreground">{u.email} · {roleLabel[u.role] || u.role}</p>
                  {u.subject && <p className="text-xs text-muted-foreground">Môn: {u.subject}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => setDetail(u)}>
                    <Eye className="w-4 h-4 mr-1" /> Chi tiết
                  </Button>
                  <Button size="sm" className="rounded-full bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(u.id)}>
                    <CheckCircle className="w-4 h-4 mr-1" /> Duyệt
                  </Button>
                  <Button size="sm" variant="destructive" className="rounded-full" onClick={() => handleReject(u.id)}>
                    <XCircle className="w-4 h-4 mr-1" /> Từ chối
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Chi tiết hồ sơ</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <img src={detail.avatar} alt={detail.name} className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-lg text-foreground">{detail.name}</p>
                  <p className="text-sm text-muted-foreground">{roleLabel[detail.role] || detail.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{detail.email}</span></div>
                <div><span className="text-muted-foreground">SĐT:</span> <span className="text-foreground">{detail.phone}</span></div>
                {detail.subject && <div><span className="text-muted-foreground">Môn:</span> <span className="text-foreground">{detail.subject}</span></div>}
                <div><span className="text-muted-foreground">Ngày đăng ký:</span> <span className="text-foreground">{detail.createdAt}</span></div>
              </div>
              {detail.bio && <p className="text-sm text-foreground bg-muted p-3 rounded-lg">{detail.bio}</p>}
              <div className="flex gap-2 pt-2">
                <Button className="rounded-full bg-green-600 hover:bg-green-700 text-white flex-1" onClick={() => { handleApprove(detail.id); setDetail(null); }}>Duyệt</Button>
                <Button variant="destructive" className="rounded-full flex-1" onClick={() => { handleReject(detail.id); setDetail(null); }}>Từ chối</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApprovals;
