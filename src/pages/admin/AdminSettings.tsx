import { useAdmin } from "@/contexts/AdminContext";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Settings, CreditCard, Bell, Shield, Save, Zap } from "lucide-react";

const AdminSettings = () => {
  const { settings, updateSettings } = useAdmin();
  const [form, setForm] = useState(settings);
  const { toast } = useToast();

  useEffect(() => { setForm(settings); }, [settings]);

  const handleSave = () => {
    updateSettings(form);
    toast({ title: "Đã lưu cài đặt thành công" });
  };

  return (
    <div className="p-6 max-w-4xl">
      <Tabs defaultValue="escrow" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-2xl h-auto flex-wrap">
          <TabsTrigger value="escrow" className="rounded-xl data-[state=active]:shadow-sm px-4 py-2.5 gap-2 text-sm">
            <CreditCard className="w-4 h-4" /> Giao dịch & Escrow
          </TabsTrigger>
          <TabsTrigger value="general" className="rounded-xl data-[state=active]:shadow-sm px-4 py-2.5 gap-2 text-sm">
            <Settings className="w-4 h-4" /> Hệ thống chung
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl data-[state=active]:shadow-sm px-4 py-2.5 gap-2 text-sm">
            <Bell className="w-4 h-4" /> Thông báo
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl data-[state=active]:shadow-sm px-4 py-2.5 gap-2 text-sm">
            <Shield className="w-4 h-4" /> Bảo mật & Phân quyền
          </TabsTrigger>
        </TabsList>

        {/* Giao dịch & Escrow */}
        <TabsContent value="escrow">
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Giao dịch & Escrow</h3>
                  <p className="text-sm text-muted-foreground">Cấu hình phí giao dịch và thời gian giữ tiền</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Phí Escrow (%)</Label>
                  <Input type="number" min={0} max={100} value={form.escrowPercent} onChange={e => setForm(f => ({ ...f, escrowPercent: Number(e.target.value) }))} className="rounded-xl h-11" />
                  <p className="text-xs text-muted-foreground">Phần trăm nền tảng giữ lại mỗi giao dịch</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Thời gian giữ tiền (ngày)</Label>
                  <Input type="number" min={1} max={30} value={form.escrowHoldDays} onChange={e => setForm(f => ({ ...f, escrowHoldDays: Number(e.target.value) }))} className="rounded-xl h-11" />
                  <p className="text-xs text-muted-foreground">Số ngày giữ tiền trước khi chuyển cho gia sư</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-4 px-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground">💳 Thanh toán online</p>
                  <p className="text-xs text-muted-foreground">Bật/tắt thanh toán trực tuyến</p>
                </div>
                <Switch checked={form.enablePayments} onCheckedChange={v => setForm(f => ({ ...f, enablePayments: v }))} />
              </div>
              <Button className="rounded-xl w-full h-11" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" /> Lưu cài đặt Escrow
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hệ thống chung */}
        <TabsContent value="general">
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Hệ thống chung</h3>
                  <p className="text-sm text-muted-foreground">Cấu hình chung cho nền tảng</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tên nền tảng</Label>
                <Input value={form.platformName} onChange={e => setForm(f => ({ ...f, platformName: e.target.value }))} className="rounded-xl h-11 max-w-md" />
              </div>
              <div className="space-y-2">
                {[
                  { key: "enableExams", icon: "📝", label: "Thi thử online", desc: "Cho phép học sinh làm bài test trực tuyến" },
                  { key: "enableChat", icon: "💬", label: "Chat", desc: "Cho phép nhắn tin giữa gia sư và học sinh" },
                  { key: "maintenanceMode", icon: "🔧", label: "Chế độ bảo trì", desc: "Tạm ngưng hệ thống để bảo trì" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-4 px-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.icon} {item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch checked={(form as any)[item.key]} onCheckedChange={v => setForm(f => ({ ...f, [item.key]: v }))} />
                  </div>
                ))}
              </div>
              <Button className="rounded-xl w-full h-11" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" /> Lưu cài đặt chung
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Thông báo */}
        <TabsContent value="notifications">
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Thông báo</h3>
                  <p className="text-sm text-muted-foreground">Cấu hình kênh thông báo cho hệ thống</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { key: "emailNotifications", icon: "📧", label: "Email", desc: "Gửi thông báo qua email" },
                  { key: "smsNotifications", icon: "📱", label: "SMS", desc: "Gửi thông báo qua tin nhắn SMS" },
                  { key: "pushNotifications", icon: "🔔", label: "Push notification", desc: "Gửi thông báo đẩy trên trình duyệt" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-4 px-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.icon} {item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch checked={(form as any)[item.key]} onCheckedChange={v => setForm(f => ({ ...f, [item.key]: v }))} />
                  </div>
                ))}
              </div>
              <Button className="rounded-xl w-full h-11" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" /> Lưu cài đặt thông báo
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bảo mật & Phân quyền */}
        <TabsContent value="security">
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Bảo mật & Phân quyền</h3>
                  <p className="text-sm text-muted-foreground">Cấu hình bảo mật cho tài khoản và hệ thống</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-4 px-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground">🔐 Xác thực 2 bước (2FA)</p>
                  <p className="text-xs text-muted-foreground">Yêu cầu xác thực 2 lớp khi đăng nhập</p>
                </div>
                <Switch checked={form.twoFactorAuth} onCheckedChange={v => setForm(f => ({ ...f, twoFactorAuth: v }))} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Thời gian phiên đăng nhập (phút)</Label>
                  <Input type="number" min={5} max={120} value={form.sessionTimeout} onChange={e => setForm(f => ({ ...f, sessionTimeout: Number(e.target.value) }))} className="rounded-xl h-11" />
                  <p className="text-xs text-muted-foreground">Tự động đăng xuất sau thời gian không hoạt động</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Số lần đăng nhập sai tối đa</Label>
                  <Input type="number" min={3} max={10} value={form.maxLoginAttempts} onChange={e => setForm(f => ({ ...f, maxLoginAttempts: Number(e.target.value) }))} className="rounded-xl h-11" />
                  <p className="text-xs text-muted-foreground">Khóa tài khoản sau số lần đăng nhập sai</p>
                </div>
              </div>
              <Button className="rounded-xl w-full h-11" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" /> Lưu cài đặt bảo mật
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
