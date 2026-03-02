import { useAdmin } from "@/contexts/AdminContext";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { settings, updateSettings } = useAdmin();
  const [form, setForm] = useState(settings);
  const { toast } = useToast();

  useEffect(() => { setForm(settings); }, [settings]);

  const handleSave = () => {
    updateSettings(form);
    toast({ title: "Đã lưu cài đặt" });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Cài đặt hệ thống</h1>

      <Card>
        <CardHeader><CardTitle>Thông tin nền tảng</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Tên nền tảng</Label>
            <Input value={form.platformName} onChange={e => setForm(f => ({ ...f, platformName: e.target.value }))} className="rounded-full max-w-sm" />
          </div>
          <div>
            <Label>Phí Escrow (%)</Label>
            <Input type="number" min={0} max={100} value={form.escrowPercent} onChange={e => setForm(f => ({ ...f, escrowPercent: Number(e.target.value) }))} className="rounded-full max-w-xs" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Tính năng</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><Label>Thi thử online</Label><p className="text-xs text-muted-foreground">Cho phép học sinh làm bài test</p></div>
            <Switch checked={form.enableExams} onCheckedChange={v => setForm(f => ({ ...f, enableExams: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <div><Label>Chat</Label><p className="text-xs text-muted-foreground">Cho phép nhắn tin giữa gia sư và học sinh</p></div>
            <Switch checked={form.enableChat} onCheckedChange={v => setForm(f => ({ ...f, enableChat: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <div><Label>Thanh toán</Label><p className="text-xs text-muted-foreground">Bật/tắt thanh toán online</p></div>
            <Switch checked={form.enablePayments} onCheckedChange={v => setForm(f => ({ ...f, enablePayments: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <div><Label>Chế độ bảo trì</Label><p className="text-xs text-muted-foreground">Tạm ngưng hệ thống để bảo trì</p></div>
            <Switch checked={form.maintenanceMode} onCheckedChange={v => setForm(f => ({ ...f, maintenanceMode: v }))} />
          </div>
        </CardContent>
      </Card>

      <Button className="rounded-full" onClick={handleSave}>Lưu cài đặt</Button>
    </div>
  );
};

export default AdminSettings;
