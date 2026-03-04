import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import studentAvatar1 from "@/assets/student-avatar-1.jpg";
import studentAvatar2 from "@/assets/student-avatar-2.jpg";
import avatarMale1 from "@/assets/avatar-male-1.jpg";
import tutor1 from "@/assets/tutor-1.jpg";
import tutor3 from "@/assets/tutor-3.jpg";
import tutor5 from "@/assets/tutor-5.jpg";

export interface ParentProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
}

export interface AttendanceConfirmation {
  id: string;
  subject: string;
  tutorName: string;
  tutorAvatar: string;
  date: string;
  time: string;
  sessionNumber: number;
  status: "pending" | "confirmed" | "rejected";
  note?: string;
}

export interface ChildInfo {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  school: string;
  gpa: number;
  totalClasses: number;
  attendance: number;
  classes: ChildClass[];
  attendanceConfirmations: AttendanceConfirmation[];
}

export interface ChildClass {
  id: string;
  name: string;
  subject: string;
  tutorName: string;
  tutorAvatar: string;
  schedule: string;
  fee: number;
  totalSessions: number;
  completedSessions: number;
  status: "active" | "completed";
  dueDate?: string;
  paid: boolean;
}

export interface ParentNotification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ParentChatMessage {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar: string;
  sender: "parent" | "other";
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ParentTransaction {
  id: string;
  type: "deposit" | "tuition_payment" | "refund" | "withdrawal";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending";
  childId?: string;
}

export interface ChildMonthlyProgress {
  month: string;
  gpa: number;
  attendance: number;
  sessionsCompleted: number;
}

export interface ChildScheduleItem {
  dayOfWeek: string;
  date: string;
  subject: string;
  tutorName: string;
  time: string;
  topic?: string;
  status: "completed" | "upcoming" | "cancelled";
}

export interface ChildTestItem {
  name: string;
  subject: string;
  date: string;
  tutorName: string;
  score: number | null;
  maxScore: number;
}

export interface ChildSubjectScore {
  subject: string;
  score: number;
  target: number;
  homeworkRate: number;
  participationRate: number;
  trend: "up" | "down" | "stable";
}

// ========== SEED DATA ==========

const parentProfile: ParentProfile = {
  id: "p1",
  name: "Nguyễn Văn Phụ Huynh",
  avatar: avatarMale1,
  email: "phuhuynh.nguyen@gmail.com",
  phone: "0901234567",
};

const seedAttendanceC1: AttendanceConfirmation[] = [
  { id: "ac1", subject: "Toán 12", tutorName: "Nguyễn Văn An", tutorAvatar: tutor1, date: "03/03/2026", time: "19:00-21:00", sessionNumber: 13, status: "pending", note: "Em An học tốt hôm nay" },
  { id: "ac2", subject: "IELTS Writing", tutorName: "Phạm Đức Huy", tutorAvatar: tutor3, date: "01/03/2026", time: "9:00-10:30", sessionNumber: 5, status: "pending" },
  { id: "ac3", subject: "Toán 12", tutorName: "Nguyễn Văn An", tutorAvatar: tutor1, date: "28/02/2026", time: "19:00-21:00", sessionNumber: 12, status: "confirmed" },
  { id: "ac4", subject: "IELTS Writing", tutorName: "Phạm Đức Huy", tutorAvatar: tutor3, date: "22/02/2026", time: "9:00-10:30", sessionNumber: 4, status: "confirmed" },
  { id: "ac5", subject: "Toán 12", tutorName: "Nguyễn Văn An", tutorAvatar: tutor1, date: "26/02/2026", time: "19:00-21:00", sessionNumber: 11, status: "rejected" },
];

const seedAttendanceC2: AttendanceConfirmation[] = [
  { id: "ac6", subject: "Toán 9", tutorName: "Nguyễn Văn An", tutorAvatar: tutor1, date: "02/03/2026", time: "17:00-18:30", sessionNumber: 11, status: "pending", note: "Thu Hà cần ôn lại phần hình học" },
  { id: "ac7", subject: "Toán 9", tutorName: "Nguyễn Văn An", tutorAvatar: tutor1, date: "27/02/2026", time: "17:00-18:30", sessionNumber: 10, status: "confirmed" },
  { id: "ac8", subject: "Văn 9", tutorName: "Lê Thị Hồng Nhung", tutorAvatar: tutor5, date: "28/02/2026", time: "14:00-16:00", sessionNumber: 8, status: "confirmed" },
];

const seedChildren: ChildInfo[] = [
  {
    id: "c1", name: "Nguyễn Minh An", avatar: studentAvatar1, grade: "Lớp 12",
    school: "THPT Nguyễn Thị Minh Khai", gpa: 8.2, totalClasses: 3, attendance: 92,
    attendanceConfirmations: seedAttendanceC1,
    classes: [
      { id: "cc1", name: "Toán 12 - Ôn thi ĐH", subject: "Toán", tutorName: "Nguyễn Văn An", tutorAvatar: tutor1, schedule: "T2, T4, T6 - 19:00-21:00", fee: 2000000, totalSessions: 24, completedSessions: 12, status: "active", dueDate: "2026-03-15", paid: false },
      { id: "cc2", name: "IELTS Writing", subject: "Anh văn", tutorName: "Phạm Đức Huy", tutorAvatar: tutor3, schedule: "T7 - 9:00-10:30", fee: 3000000, totalSessions: 12, completedSessions: 4, status: "active", dueDate: "2026-03-10", paid: false },
      { id: "cc3", name: "Hóa 11 - Cơ bản", subject: "Hóa", tutorName: "Trần Thị Bích Ngọc", tutorAvatar: tutor5, schedule: "T5 - 19:00-20:30", fee: 1800000, totalSessions: 20, completedSessions: 20, status: "completed", paid: true },
    ],
  },
  {
    id: "c2", name: "Nguyễn Thu Hà", avatar: studentAvatar2, grade: "Lớp 9",
    school: "THCS Trần Văn Ơn", gpa: 8.8, totalClasses: 2, attendance: 96,
    attendanceConfirmations: seedAttendanceC2,
    classes: [
      { id: "cc4", name: "Toán 9 - Luyện thi", subject: "Toán", tutorName: "Nguyễn Văn An", tutorAvatar: tutor1, schedule: "T3, T5 - 17:00-18:30", fee: 1500000, totalSessions: 20, completedSessions: 10, status: "active", dueDate: "2026-03-20", paid: false },
      { id: "cc5", name: "Văn 9 - Nâng cao", subject: "Văn", tutorName: "Lê Thị Hồng Nhung", tutorAvatar: tutor5, schedule: "T7 - 14:00-16:00", fee: 1200000, totalSessions: 16, completedSessions: 8, status: "active", paid: true },
    ],
  },
];

const seedNotifications: ParentNotification[] = [
  { id: "pn1", type: "warning", title: "Học phí sắp đến hạn", message: "Lớp Toán 12 của Minh An cần thanh toán trước 15/03.", timestamp: "03/03/2026 08:00", read: false },
  { id: "pn2", type: "info", title: "Chờ xác nhận điểm danh", message: "Gia sư Nguyễn Văn An đã điểm danh buổi Toán 12 ngày 03/03. Vui lòng xác nhận.", timestamp: "03/03/2026 09:00", read: false },
  { id: "pn3", type: "success", title: "Hoàn thành buổi học", message: "Thu Hà đã hoàn thành buổi Toán 9 ngày 01/03.", timestamp: "01/03/2026 18:35", read: false },
  { id: "pn4", type: "info", title: "Bài kiểm tra mới", message: "Minh An có bài kiểm tra Toán chương Tích phân - Điểm: 8.5/10.", timestamp: "28/02/2026 20:00", read: false },
  { id: "pn5", type: "warning", title: "Vắng buổi học", message: "Minh An vắng buổi IELTS ngày 25/02.", timestamp: "25/02/2026 18:00", read: true },
  { id: "pn6", type: "info", title: "Tin nhắn mới", message: "Thầy Nguyễn Văn An gửi tin nhắn về tiến độ học tập.", timestamp: "28/02/2026 20:20", read: true },
];

const seedChatMessages: ParentChatMessage[] = [
  { id: "pcm1", contactId: "t1", contactName: "Nguyễn Văn An", contactAvatar: tutor1, sender: "other", message: "Chị ơi, em An tuần này tiến bộ rất nhiều phần tích phân ạ.", timestamp: "28/02 20:15", read: true },
  { id: "pcm2", contactId: "t1", contactName: "Nguyễn Văn An", contactAvatar: tutor1, sender: "parent", message: "Cảm ơn thầy, ở nhà em cũng chăm chỉ lắm ạ.", timestamp: "28/02 20:30", read: true },
  { id: "pcm3", contactId: "t1", contactName: "Nguyễn Văn An", contactAvatar: tutor1, sender: "other", message: "Tuần tới thầy sẽ cho kiểm tra thử nhé chị.", timestamp: "01/03 09:00", read: false },
  { id: "pcm4", contactId: "t3", contactName: "Phạm Đức Huy", contactAvatar: tutor3, sender: "other", message: "Em An cần luyện thêm Writing Task 2, tuần sau thầy tập trung phần này.", timestamp: "02/03 14:00", read: false },
  { id: "pcm5", contactId: "t3", contactName: "Phạm Đức Huy", contactAvatar: tutor3, sender: "parent", message: "Dạ vâng thầy, nhờ thầy kèm thêm em ạ.", timestamp: "02/03 14:30", read: true },
];

const seedTransactions: ParentTransaction[] = [
  { id: "pt1", type: "deposit", amount: 10000000, description: "Nạp tiền vào ví", date: "2026-01-10", status: "completed" },
  { id: "pt2", type: "tuition_payment", amount: -2000000, description: "Thanh toán - Toán 12 (Minh An)", date: "2026-01-15", status: "completed", childId: "c1" },
  { id: "pt3", type: "tuition_payment", amount: -3000000, description: "Thanh toán - IELTS Writing (Minh An)", date: "2026-02-01", status: "completed", childId: "c1" },
  { id: "pt4", type: "tuition_payment", amount: -1500000, description: "Thanh toán - Toán 9 (Thu Hà)", date: "2026-02-05", status: "completed", childId: "c2" },
  { id: "pt5", type: "tuition_payment", amount: -1200000, description: "Thanh toán - Văn 9 (Thu Hà)", date: "2026-02-10", status: "completed", childId: "c2" },
  { id: "pt6", type: "refund", amount: 500000, description: "Hoàn tiền 3 buổi - Hóa 11 (Minh An)", date: "2026-02-15", status: "completed", childId: "c1" },
  { id: "pt7", type: "deposit", amount: 5000000, description: "Nạp tiền vào ví", date: "2026-02-28", status: "completed" },
];

const childProgress: Record<string, ChildMonthlyProgress[]> = {
  c1: [
    { month: "T10/2025", gpa: 7.8, attendance: 88, sessionsCompleted: 10 },
    { month: "T11/2025", gpa: 8.0, attendance: 90, sessionsCompleted: 12 },
    { month: "T12/2025", gpa: 7.9, attendance: 85, sessionsCompleted: 10 },
    { month: "T1/2026", gpa: 8.1, attendance: 92, sessionsCompleted: 14 },
    { month: "T2/2026", gpa: 8.2, attendance: 92, sessionsCompleted: 16 },
  ],
  c2: [
    { month: "T10/2025", gpa: 8.4, attendance: 95, sessionsCompleted: 8 },
    { month: "T11/2025", gpa: 8.5, attendance: 96, sessionsCompleted: 8 },
    { month: "T12/2025", gpa: 8.6, attendance: 94, sessionsCompleted: 7 },
    { month: "T1/2026", gpa: 8.7, attendance: 96, sessionsCompleted: 8 },
    { month: "T2/2026", gpa: 8.8, attendance: 96, sessionsCompleted: 10 },
  ],
};

const seedChildSchedules: Record<string, ChildScheduleItem[]> = {
  c1: [
    { dayOfWeek: "Thứ 2", date: "03/03", subject: "Toán 12 - Ôn thi ĐH", tutorName: "Nguyễn Văn An", time: "19:00-21:00", topic: "Tích phân - Ôn tập", status: "upcoming" },
    { dayOfWeek: "Thứ 4", date: "05/03", subject: "Toán 12 - Ôn thi ĐH", tutorName: "Nguyễn Văn An", time: "19:00-21:00", topic: "Lượng giác", status: "upcoming" },
    { dayOfWeek: "Thứ 6", date: "07/03", subject: "Toán 12 - Ôn thi ĐH", tutorName: "Nguyễn Văn An", time: "19:00-21:00", status: "upcoming" },
    { dayOfWeek: "Thứ 7", date: "08/03", subject: "IELTS Writing", tutorName: "Phạm Đức Huy", time: "9:00-10:30", topic: "Task 2 - Opinion Essay", status: "upcoming" },
    { dayOfWeek: "Thứ 2", date: "24/02", subject: "Toán 12", tutorName: "Nguyễn Văn An", time: "19:00-21:00", topic: "Tích phân xác định", status: "completed" },
    { dayOfWeek: "Thứ 7", date: "01/03", subject: "IELTS Writing", tutorName: "Phạm Đức Huy", time: "9:00-10:30", topic: "Task 1 - Graph", status: "completed" },
  ],
  c2: [
    { dayOfWeek: "Thứ 3", date: "04/03", subject: "Toán 9 - Luyện thi", tutorName: "Nguyễn Văn An", time: "17:00-18:30", topic: "Hình học không gian", status: "upcoming" },
    { dayOfWeek: "Thứ 5", date: "06/03", subject: "Toán 9 - Luyện thi", tutorName: "Nguyễn Văn An", time: "17:00-18:30", status: "upcoming" },
    { dayOfWeek: "Thứ 7", date: "08/03", subject: "Văn 9 - Nâng cao", tutorName: "Lê Thị Hồng Nhung", time: "14:00-16:00", topic: "Nghị luận xã hội", status: "upcoming" },
    { dayOfWeek: "Thứ 3", date: "25/02", subject: "Toán 9", tutorName: "Nguyễn Văn An", time: "17:00-18:30", topic: "Phương trình bậc hai", status: "completed" },
    { dayOfWeek: "Thứ 7", date: "01/03", subject: "Văn 9", tutorName: "Lê Thị Hồng Nhung", time: "14:00-16:00", topic: "Phân tích thơ", status: "completed" },
  ],
};

const seedChildTests: Record<string, ChildTestItem[]> = {
  c1: [
    { name: "Kiểm tra Tích phân", subject: "Toán 12", date: "28/02/2026", tutorName: "Nguyễn Văn An", score: 8.5, maxScore: 10 },
    { name: "IELTS Writing Mock Test 1", subject: "IELTS", date: "22/02/2026", tutorName: "Phạm Đức Huy", score: 6.0, maxScore: 9 },
    { name: "Kiểm tra Giải tích", subject: "Toán 12", date: "14/02/2026", tutorName: "Nguyễn Văn An", score: 7.5, maxScore: 10 },
    { name: "IELTS Writing Task 1", subject: "IELTS", date: "08/02/2026", tutorName: "Phạm Đức Huy", score: 6.5, maxScore: 9 },
    { name: "Kiểm tra Đạo hàm", subject: "Toán 12", date: "30/01/2026", tutorName: "Nguyễn Văn An", score: 9.0, maxScore: 10 },
    { name: "KT chương Hóa hữu cơ", subject: "Hóa 11", date: "20/01/2026", tutorName: "Trần Thị Bích Ngọc", score: 8.0, maxScore: 10 },
  ],
  c2: [
    { name: "Kiểm tra Hình học", subject: "Toán 9", date: "27/02/2026", tutorName: "Nguyễn Văn An", score: 9.0, maxScore: 10 },
    { name: "Bài kiểm tra Nghị luận", subject: "Văn 9", date: "22/02/2026", tutorName: "Lê Thị Hồng Nhung", score: 8.5, maxScore: 10 },
    { name: "Kiểm tra PT bậc hai", subject: "Toán 9", date: "13/02/2026", tutorName: "Nguyễn Văn An", score: 8.0, maxScore: 10 },
    { name: "Phân tích thơ", subject: "Văn 9", date: "08/02/2026", tutorName: "Lê Thị Hồng Nhung", score: null, maxScore: 10 },
  ],
};

const seedChildSubjectScores: Record<string, ChildSubjectScore[]> = {
  c1: [
    { subject: "Toán", score: 8.5, target: 9.0, homeworkRate: 90, participationRate: 95, trend: "up" },
    { subject: "Anh văn", score: 7.0, target: 8.0, homeworkRate: 85, participationRate: 88, trend: "up" },
    { subject: "Hóa", score: 8.0, target: 8.5, homeworkRate: 88, participationRate: 90, trend: "stable" },
    { subject: "Lý", score: 7.5, target: 8.0, homeworkRate: 80, participationRate: 85, trend: "down" },
    { subject: "Văn", score: 7.8, target: 8.0, homeworkRate: 82, participationRate: 87, trend: "stable" },
  ],
  c2: [
    { subject: "Toán", score: 9.0, target: 9.5, homeworkRate: 95, participationRate: 98, trend: "up" },
    { subject: "Văn", score: 8.5, target: 9.0, homeworkRate: 92, participationRate: 95, trend: "up" },
    { subject: "Anh văn", score: 8.2, target: 8.5, homeworkRate: 88, participationRate: 90, trend: "stable" },
    { subject: "Sử", score: 8.8, target: 9.0, homeworkRate: 90, participationRate: 92, trend: "up" },
  ],
};

// ========== CONTEXT ==========

interface ParentContextType {
  profile: ParentProfile;
  children: ChildInfo[];
  notifications: ParentNotification[];
  chatMessages: ParentChatMessage[];
  transactions: ParentTransaction[];
  walletBalance: number;
  childProgress: Record<string, ChildMonthlyProgress[]>;
  childSchedules: Record<string, ChildScheduleItem[]>;
  childTests: Record<string, ChildTestItem[]>;
  childSubjectScores: Record<string, ChildSubjectScore[]>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  sendChatMessage: (contactId: string, message: string) => void;
  markChatRead: (contactId: string) => void;
  payChildTuition: (classId: string, childId: string, amount: number, description: string) => void;
  depositWallet: (amount: number) => void;
  withdrawWallet: (amount: number, method: string) => void;
  confirmAttendance: (childId: string, confirmId: string, confirmed: boolean) => void;
}

const ParentContext = createContext<ParentContextType | undefined>(undefined);

export const useParent = () => {
  const ctx = useContext(ParentContext);
  if (!ctx) throw new Error("useParent must be used within ParentProvider");
  return ctx;
};

export const ParentProvider = ({ children: kids }: { children: ReactNode }) => {
  const [profile] = useState(parentProfile);
  const [childrenState, setChildren] = useState(seedChildren);
  const [notifs, setNotifs] = useState(seedNotifications);
  const [chatMsgs, setChatMsgs] = useState(seedChatMessages);
  const [txns, setTxns] = useState(seedTransactions);

  const walletBalance = txns.filter(t => t.status === "completed").reduce((s, t) => s + t.amount, 0);

  const markNotificationRead = useCallback((id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const sendChatMessage = useCallback((contactId: string, message: string) => {
    const contact = chatMsgs.find(m => m.contactId === contactId);
    const newMsg: ParentChatMessage = {
      id: `pcm${Date.now()}`, contactId,
      contactName: contact?.contactName || "", contactAvatar: contact?.contactAvatar || "",
      sender: "parent", message,
      timestamp: new Date().toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
      read: true,
    };
    setChatMsgs(prev => [...prev, newMsg]);
  }, [chatMsgs]);

  const markChatRead = useCallback((contactId: string) => {
    setChatMsgs(prev => prev.map(m => m.contactId === contactId ? { ...m, read: true } : m));
  }, []);

  const payChildTuition = useCallback((classId: string, childId: string, amount: number, description: string) => {
    setTxns(prev => [...prev, { id: `pt${Date.now()}`, type: "tuition_payment" as const, amount: -amount, description, date: new Date().toISOString().split("T")[0], status: "completed" as const, childId }]);
    setChildren(prev => prev.map(c => c.id === childId ? { ...c, classes: c.classes.map(cl => cl.id === classId ? { ...cl, paid: true } : cl) } : c));
  }, []);

  const depositWallet = useCallback((amount: number) => {
    setTxns(prev => [...prev, { id: `pt${Date.now()}`, type: "deposit" as const, amount, description: "Nạp tiền vào ví", date: new Date().toISOString().split("T")[0], status: "completed" as const }]);
  }, []);

  const withdrawWallet = useCallback((amount: number, method: string) => {
    setTxns(prev => [...prev, { id: `pt${Date.now()}`, type: "withdrawal" as const, amount: -amount, description: `Rút tiền từ ví qua ${method}`, date: new Date().toISOString().split("T")[0], status: "completed" as const }]);
  }, []);

  const confirmAttendance = useCallback((childId: string, confirmId: string, confirmed: boolean) => {
    setChildren(prev => prev.map(c => c.id === childId ? {
      ...c,
      attendanceConfirmations: c.attendanceConfirmations.map(a => a.id === confirmId ? { ...a, status: confirmed ? "confirmed" as const : "rejected" as const } : a),
    } : c));
  }, []);

  return (
    <ParentContext.Provider value={{
      profile, children: childrenState, notifications: notifs, chatMessages: chatMsgs,
      transactions: txns, walletBalance, childProgress,
      childSchedules: seedChildSchedules, childTests: seedChildTests, childSubjectScores: seedChildSubjectScores,
      markNotificationRead, markAllNotificationsRead, sendChatMessage, markChatRead,
      payChildTuition, depositWallet, withdrawWallet, confirmAttendance,
    }}>
      {kids}
    </ParentContext.Provider>
  );
};
