import { useStudent, AvailabilitySlot } from "@/contexts/StudentContext";
import { Clock, Plus, Trash2, Copy, Save, Info, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const StudentAvailability = () => {
  const { availability, updateAvailability } = useStudent();
  const { toast } = useToast();
  const [localAvail, setLocalAvail] = useState<AvailabilitySlot[]>(JSON.parse(JSON.stringify(availability)));
  const [addSlotModal, setAddSlotModal] = useState<number | null>(null);
  const [newFrom, setNewFrom] = useState("18:00");
  const [newTo, setNewTo] = useState("20:00");

  const toggleDay = (idx: number) => {
    setLocalAvail(prev => prev.map((a, i) => i === idx ? { ...a, enabled: !a.enabled } : a));
  };

  const addSlot = () => {
    if (addSlotModal === null) return;
    setLocalAvail(prev => prev.map((a, i) => i === addSlotModal ? { ...a, slots: [...a.slots, { from: newFrom, to: newTo }] } : a));
    setAddSlotModal(null);
    setNewFrom("18:00");
    setNewTo("20:00");
  };

  const removeSlot = (dayIdx: number, slotIdx: number) => {
    setLocalAvail(prev => prev.map((a, i) => i === dayIdx ? { ...a, slots: a.slots.filter((_, si) => si !== slotIdx) } : a));
  };

  const updateSlot = (dayIdx: number, slotIdx: number, field: "from" | "to", value: string) => {
    setLocalAvail(prev => prev.map((a, i) => i === dayIdx ? {
      ...a, slots: a.slots.map((s, si) => si === slotIdx ? { ...s, [field]: value } : s)
    } : a));
  };

  const copyPreviousDay = (dayIdx: number) => {
    if (dayIdx === 0) return;
    const prev = localAvail[dayIdx - 1];
    setLocalAvail(a => a.map((slot, i) => i === dayIdx ? { ...slot, enabled: prev.enabled, slots: JSON.parse(JSON.stringify(prev.slots)) } : slot));
  };

  const handleSave = () => {
    updateAvailability(localAvail);
    toast({ title: "Đã lưu!", description: "Khung giờ rảnh đã được cập nhật." });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Explanation */}
      <div className="bg-muted/50 border border-border rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">Khung giờ rảnh của bạn</p>
          <p className="text-xs text-muted-foreground mt-1">Hệ thống sẽ sử dụng khung giờ rảnh này để đề xuất lịch học phù hợp nhất cho bạn. Gia sư và giáo viên cũng có thể xem lịch rảnh của bạn khi sắp xếp buổi học.</p>
        </div>
      </div>

      {/* Add Slot Modal */}
      {addSlotModal !== null && (
        <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-4" onClick={() => setAddSlotModal(null)}>
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Thêm khung giờ - {localAvail[addSlotModal].day}</h3>
              <button onClick={() => setAddSlotModal(null)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Từ</label>
                <input type="time" value={newFrom} onChange={e => setNewFrom(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Đến</label>
                <input type="time" value={newTo} onChange={e => setNewTo(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm" />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button className="flex-1 rounded-xl" onClick={addSlot}>Thêm</Button>
              <Button variant="outline" className="rounded-xl" onClick={() => setAddSlotModal(null)}>Hủy</Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" /> Quản lý khung giờ rảnh
          </h3>
          <Button className="rounded-xl gap-2" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4" /> Lưu thay đổi
          </Button>
        </div>

        <div className="space-y-4">
          {localAvail.map((day, dayIdx) => (
            <div key={day.day} className={cn("border border-border rounded-xl p-4 transition-all", day.enabled ? "bg-card" : "bg-muted/30 opacity-60")}>
              <div className="flex items-center gap-4 mb-3">
                <Switch checked={day.enabled} onCheckedChange={() => toggleDay(dayIdx)} />
                <span className="text-sm font-semibold text-foreground w-20">{day.day}</span>
                <div className="flex-1" />
                {dayIdx > 0 && (
                  <Button variant="ghost" size="sm" className="text-xs gap-1 rounded-lg h-7" onClick={() => copyPreviousDay(dayIdx)}>
                    <Copy className="w-3 h-3" /> Copy ngày trước
                  </Button>
                )}
                {day.enabled && (
                  <Button variant="ghost" size="sm" className="text-xs gap-1 rounded-lg h-7" onClick={() => setAddSlotModal(dayIdx)}>
                    <Plus className="w-3 h-3" /> Thêm
                  </Button>
                )}
              </div>

              {day.enabled && (
                <div className="space-y-2 ml-14">
                  {day.slots.map((slot, slotIdx) => (
                    <div key={slotIdx} className="flex items-center gap-3">
                      <input type="time" value={slot.from} onChange={e => updateSlot(dayIdx, slotIdx, "from", e.target.value)} className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm" />
                      <span className="text-xs text-muted-foreground">đến</span>
                      <input type="time" value={slot.to} onChange={e => updateSlot(dayIdx, slotIdx, "to", e.target.value)} className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm" />
                      <button onClick={() => removeSlot(dayIdx, slotIdx)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {day.slots.length === 0 && <p className="text-xs text-muted-foreground">Chưa có khung giờ nào. Bấm "Thêm" để thêm.</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentAvailability;
