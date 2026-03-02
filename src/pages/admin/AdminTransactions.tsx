import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const typeLabel: Record<string, string> = { tuition: "Học phí", salary: "Lương gia sư", "exam-fee": "Phí thi thử" };
const statusLabel: Record<string, string> = { completed: "Hoàn thành", pending: "Đang xử lý", failed: "Thất bại", refunded: "Hoàn tiền" };
const statusColor: Record<string, string> = { completed: "bg-green-100 text-green-700", pending: "bg-yellow-100 text-yellow-700", failed: "bg-red-100 text-red-700", refunded: "bg-blue-100 text-blue-700" };

const AdminTransactions = () => {
  const { transactions, users, settings } = useAdmin();

  const totalRevenue = transactions.filter(t => t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const escrowProfit = Math.round(totalRevenue * settings.escrowPercent / 100);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Giao dịch</h1>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Tổng giao dịch</p><p className="text-2xl font-bold text-foreground">{transactions.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Tổng doanh thu</p><p className="text-2xl font-bold text-foreground">{totalRevenue.toLocaleString("vi-VN")}đ</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Lợi nhuận Escrow ({settings.escrowPercent}%)</p><p className="text-2xl font-bold text-foreground">{escrowProfit.toLocaleString("vi-VN")}đ</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người thanh toán</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map(tx => {
                const user = users.find(u => u.id === tx.userId);
                return (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user && <img src={user.avatar} className="w-7 h-7 rounded-full object-cover" />}
                        <span className="text-sm font-medium text-foreground">{user?.name || "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{typeLabel[tx.type]}</TableCell>
                    <TableCell className="text-sm font-medium">{tx.amount.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{tx.date}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{tx.description}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[tx.status]}`}>{statusLabel[tx.status]}</span>
                    </TableCell>
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

export default AdminTransactions;
