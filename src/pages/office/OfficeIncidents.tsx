import { useOffice } from "@/contexts/OfficeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Clock, Search as SearchIcon } from "lucide-react";
import { useState } from "react";

const priorityConfig: Record<string, { label: string; className: string }> = {
  high: { label: "Cao", className: "bg-red-100 text-red-700 border-red-200" },
  medium: { label: "Trung bình", className: "bg-amber-100 text-amber-700 border-amber-200" },
  low: { label: "Thấp", className: "bg-blue-100 text-blue-700 border-blue-200" },
};

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  pending: { label: "Chờ xử lý", icon: Clock, className: "text-amber-600" },
  investigating: { label: "Đang điều tra", icon: SearchIcon, className: "text-blue-600" },
  resolved: { label: "Đã xử lý", icon: CheckCircle2, className: "text-emerald-600" },
};

const OfficeIncidents = () => {
  const { incidents, resolveIncident } = useOffice();
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? incidents : incidents.filter(i => i.status === filter);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
          <div><p className="text-xl font-bold text-foreground">{incidents.filter(i => i.status === "pending").length}</p><p className="text-xs text-muted-foreground">Chờ xử lý</p></div>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><SearchIcon className="w-5 h-5 text-blue-600" /></div>
          <div><p className="text-xl font-bold text-foreground">{incidents.filter(i => i.status === "investigating").length}</p><p className="text-xs text-muted-foreground">Đang điều tra</p></div>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
          <div><p className="text-xl font-bold text-foreground">{incidents.filter(i => i.status === "resolved").length}</p><p className="text-xs text-muted-foreground">Đã xử lý</p></div>
        </CardContent></Card>
      </div>

      <div className="flex gap-2">
        {["all", "pending", "investigating", "resolved"].map(s => (
          <Button key={s} variant={filter === s ? "default" : "outline"} size="sm" className="rounded-xl text-xs" onClick={() => setFilter(s)}>
            {s === "all" ? "Tất cả" : statusConfig[s]?.label}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(incident => {
          const pCfg = priorityConfig[incident.priority];
          const sCfg = statusConfig[incident.status];
          return (
            <Card key={incident.id} className="border-border">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${pCfg.className}`}>{pCfg.label}</span>
                    <div className={`flex items-center gap-1 text-xs font-medium ${sCfg.className}`}>
                      <sCfg.icon className="w-3.5 h-3.5" />
                      {sCfg.label}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{incident.createdAt}</p>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{incident.className}</h3>
                <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Báo cáo bởi: <span className="font-medium text-foreground">{incident.reporter}</span> ({incident.reporterRole})</p>
                  {incident.status !== "resolved" && (
                    <Button size="sm" className="rounded-xl text-xs" onClick={() => resolveIncident(incident.id)}>
                      Đánh dấu đã xử lý
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OfficeIncidents;
