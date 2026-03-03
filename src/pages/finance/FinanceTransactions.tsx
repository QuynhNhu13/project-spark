import { useFinance } from "@/contexts/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeftRight } from "lucide-react";
import { useState } from "react";

const typeLabels: Record<string, string> = {
  tuition: "Học phí", salary: "Lương", withdrawal: "Rút tiền", deposit: "Nạp tiền", "exam-fee": "Phí thi", refund: "Hoàn tiền",
};

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  completed: { label: "Hoàn thành", variant: "default" },
  pending: { label: "Chờ xử lý", variant: "outline" },
  failed: { label: "Thất bại", variant: "destructive" },
  refunded: { label: "Đã hoàn", variant: "secondary" },
};

const FinanceTransactions = () => {
  const { transactions } = useFinance();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = transactions.filter(t => {
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) || t.user.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || t.type === typeFilter;
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const totalIn = transactions.filter(t => (t.type === "tuition" || t.type === "deposit" || t.type === "exam-fee") && t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => (t.type === "salary" || t.type === "withdrawal" || t.type === "refund") && t.status === "completed").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border"><CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Tổng thu</p>
          <p className="text-xl font-bold text-emerald-600">+{totalIn.toLocaleString("vi-VN")}đ</p>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Tổng chi</p>
          <p className="text-xl font-bold text-red-600">-{totalOut.toLocaleString("vi-VN")}đ</p>
        </CardContent></Card>
        <Card className="border-border"><CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Lợi nhuận</p>
          <p className="text-xl font-bold text-foreground">{(totalIn - totalOut).toLocaleString("vi-VN")}đ</p>
        </CardContent></Card>
      </div>

      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <CardTitle className="text-base flex items-center gap-2"><ArrowLeftRight className="w-4 h-4" /> Danh sách giao dịch</CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Input placeholder="Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)} className="w-44 h-9 text-sm rounded-xl" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32 h-9 text-sm rounded-xl"><SelectValue placeholder="Loại" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="tuition">Học phí</SelectItem>
                  <SelectItem value="salary">Lương</SelectItem>
                  <SelectItem value="withdrawal">Rút tiền</SelectItem>
                  <SelectItem value="deposit">Nạp tiền</SelectItem>
                  <SelectItem value="exam-fee">Phí thi</SelectItem>
                  <SelectItem value="refund">Hoàn tiền</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 h-9 text-sm rounded-xl"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="failed">Thất bại</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mô tả</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(t => {
                const sCfg = statusConfig[t.status];
                const isIncome = t.type === "tuition" || t.type === "deposit" || t.type === "exam-fee";
                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium text-sm">{t.description}</TableCell>
                    <TableCell className="text-sm">{t.user}</TableCell>
                    <TableCell className="text-sm">{t.userRole}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{typeLabels[t.type]}</Badge></TableCell>
                    <TableCell className={`text-sm font-medium ${isIncome ? "text-emerald-600" : "text-red-600"}`}>
                      {isIncome ? "+" : "-"}{t.amount.toLocaleString("vi-VN")}đ
                    </TableCell>
                    <TableCell className="text-sm">{t.date}</TableCell>
                    <TableCell><Badge variant={sCfg.variant}>{sCfg.label}</Badge></TableCell>
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

export default FinanceTransactions;
