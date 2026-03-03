import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import avatarMale1 from "@/assets/avatar-male-1.jpg";
import avatarFemale1 from "@/assets/avatar-female-1.jpg";
import avatarMale3 from "@/assets/avatar-male-3.jpg";
import avatarFemale3 from "@/assets/avatar-female-3.jpg";

export type TxType = "tuition" | "salary" | "withdrawal" | "deposit" | "exam-fee" | "refund";
export type TxStatus = "completed" | "pending" | "failed" | "refunded";

export interface FinanceTransaction {
  id: string;
  user: string;
  userRole: string;
  type: TxType;
  amount: number;
  date: string;
  status: TxStatus;
  description: string;
}

export interface WithdrawalRequest {
  id: string;
  tutorName: string;
  tutorAvatar: string;
  amount: number;
  bankName: string;
  bankAccount: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  note?: string;
  totalEarned: number;
  totalWithdrawn: number;
}

export interface FinanceNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  timestamp: string;
}

const seedTransactions: FinanceTransaction[] = [
  { id: "ft1", user: "Lê Minh Châu", userRole: "Học sinh", type: "tuition", amount: 2000000, date: "03/03/2026", status: "completed", description: "Học phí Toán 12 - T3/2026" },
  { id: "ft2", user: "Nguyễn Văn An", userRole: "Gia sư", type: "salary", amount: 1600000, date: "02/03/2026", status: "completed", description: "Lương gia sư Toán 12 - T2/2026" },
  { id: "ft3", user: "Ngô Thị Lan", userRole: "Học sinh", type: "tuition", amount: 1500000, date: "01/03/2026", status: "pending", description: "Học phí Văn 11 - T3/2026" },
  { id: "ft4", user: "Trần Thị Bích", userRole: "Giáo viên", type: "salary", amount: 1200000, date: "28/02/2026", status: "completed", description: "Lương GV Văn 11 - T2/2026" },
  { id: "ft5", user: "Trương Văn Kiên", userRole: "Học sinh", type: "tuition", amount: 3000000, date: "27/02/2026", status: "completed", description: "Học phí IELTS Writing - T3/2026" },
  { id: "ft6", user: "Lê Minh Châu", userRole: "Học sinh", type: "exam-fee", amount: 50000, date: "25/02/2026", status: "completed", description: "Phí thi thử Toán 12" },
  { id: "ft7", user: "Phạm Hồng Đào", userRole: "Phụ huynh", type: "deposit", amount: 5000000, date: "24/02/2026", status: "completed", description: "Nạp tiền ví phụ huynh" },
  { id: "ft8", user: "Đỗ Quang Minh", userRole: "Gia sư", type: "withdrawal", amount: 2400000, date: "23/02/2026", status: "completed", description: "Rút tiền gia sư IELTS" },
  { id: "ft9", user: "Ngô Thị Lan", userRole: "Học sinh", type: "refund", amount: 500000, date: "20/02/2026", status: "completed", description: "Hoàn tiền buổi học bị hủy" },
  { id: "ft10", user: "Hoàng Đức Em", userRole: "Gia sư", type: "salary", amount: 900000, date: "18/02/2026", status: "pending", description: "Lương gia sư Lý 10 - T2/2026" },
  { id: "ft11", user: "Vũ Thị Phương", userRole: "Giáo viên", type: "salary", amount: 1700000, date: "15/02/2026", status: "completed", description: "Lương GV Hóa 12 - T1/2026" },
  { id: "ft12", user: "Lý Thị Mai", userRole: "Phụ huynh", type: "deposit", amount: 3000000, date: "10/02/2026", status: "completed", description: "Nạp tiền ví phụ huynh" },
];

const seedWithdrawals: WithdrawalRequest[] = [
  { id: "w1", tutorName: "Nguyễn Văn An", tutorAvatar: avatarMale1, amount: 3200000, bankName: "Vietcombank", bankAccount: "****5678", requestDate: "03/03/2026", status: "pending", totalEarned: 12800000, totalWithdrawn: 8000000 },
  { id: "w2", tutorName: "Đỗ Quang Minh", tutorAvatar: avatarMale3, amount: 1800000, bankName: "Techcombank", bankAccount: "****1234", requestDate: "02/03/2026", status: "pending", totalEarned: 7200000, totalWithdrawn: 4800000 },
  { id: "w3", tutorName: "Trần Thị Bích", tutorAvatar: avatarFemale1, amount: 2400000, bankName: "MB Bank", bankAccount: "****9012", requestDate: "28/02/2026", status: "approved", totalEarned: 9600000, totalWithdrawn: 7200000 },
  { id: "w4", tutorName: "Vũ Thị Phương", tutorAvatar: avatarFemale3, amount: 1700000, bankName: "ACB", bankAccount: "****3456", requestDate: "25/02/2026", status: "rejected", note: "Số dư khả dụng không đủ", totalEarned: 5100000, totalWithdrawn: 3400000 },
];

const seedNotifications: FinanceNotification[] = [
  { id: "fn1", title: "Yêu cầu rút tiền mới", message: "Gia sư Nguyễn Văn An yêu cầu rút 3.200.000đ", type: "warning", read: false, timestamp: "03/03/2026 09:00" },
  { id: "fn2", title: "Thanh toán học phí", message: "Học phí Toán 12 T3/2026 đã nhận", type: "success", read: false, timestamp: "03/03/2026 08:30" },
  { id: "fn3", title: "Yêu cầu rút tiền mới", message: "Gia sư Đỗ Quang Minh yêu cầu rút 1.800.000đ", type: "warning", read: false, timestamp: "02/03/2026 14:00" },
  { id: "fn4", title: "Báo cáo tài chính tháng 2", message: "Báo cáo tài chính T2/2026 đã sẵn sàng", type: "info", read: true, timestamp: "01/03/2026 10:00" },
];

interface FinanceContextType {
  transactions: FinanceTransaction[];
  withdrawals: WithdrawalRequest[];
  notifications: FinanceNotification[];
  approveWithdrawal: (id: string) => void;
  rejectWithdrawal: (id: string, note: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  profile: { name: string; role: string; avatar: string };
}

const FinanceContext = createContext<FinanceContextType | null>(null);

export const useFinance = () => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be inside FinanceProvider");
  return ctx;
};

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const [transactions] = useState(seedTransactions);
  const [withdrawals, setWithdrawals] = useState(seedWithdrawals);
  const [notifications, setNotifications] = useState(seedNotifications);

  const approveWithdrawal = useCallback((id: string) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: "approved" as const } : w));
  }, []);

  const rejectWithdrawal = useCallback((id: string, note: string) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: "rejected" as const, note } : w));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const profile = { name: "Lê Thị Hương", role: "Kế toán", avatar: avatarFemale3 };

  return (
    <FinanceContext.Provider value={{ transactions, withdrawals, notifications, approveWithdrawal, rejectWithdrawal, markNotificationRead, markAllNotificationsRead, profile }}>
      {children}
    </FinanceContext.Provider>
  );
};
