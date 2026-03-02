import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollText } from "lucide-react";

const AdminAudit = () => {
  const { auditLog } = useAdmin();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Audit Log</h1>
      <p className="text-muted-foreground">{auditLog.length} hành động đã ghi nhận</p>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thời gian</TableHead>
                <TableHead>Người thực hiện</TableHead>
                <TableHead>Hành động</TableHead>
                <TableHead>Đối tượng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLog.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-muted-foreground font-mono">{log.timestamp}</TableCell>
                  <TableCell className="text-sm font-medium text-foreground">{log.actor}</TableCell>
                  <TableCell className="text-sm">{log.action}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.target}</TableCell>
                </TableRow>
              ))}
              {auditLog.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Chưa có log nào</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAudit;
