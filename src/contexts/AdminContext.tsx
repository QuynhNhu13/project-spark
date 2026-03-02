import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

// Types
export type UserRole = "tutor" | "teacher" | "student" | "parent" | "accountant" | "office" | "exam-manager" | "admin";
export type UserStatus = "pending" | "approved" | "rejected" | "suspended";
export type ClassStatus = "searching" | "active" | "completed";
export type ClassFormat = "online" | "offline" | "hybrid";
export type TestType = "multiple-choice" | "essay";
export type TestStatus = "active" | "draft" | "archived";
export type TransactionType = "tuition" | "salary" | "exam-fee";
export type TransactionStatus = "completed" | "pending" | "failed" | "refunded";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatar: string;
  createdAt: string;
  subject?: string;
  bio?: string;
}

export interface AdminClass {
  id: string;
  name: string;
  studentId: string;
  tutorId: string;
  format: ClassFormat;
  fee: number;
  status: ClassStatus;
  subject: string;
  createdAt: string;
}

export interface AdminTest {
  id: string;
  code: string;
  name: string;
  subject: string;
  level: string;
  type: TestType;
  attempts: number;
  status: TestStatus;
  createdAt: string;
}

export interface AdminTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  date: string;
  status: TransactionStatus;
  description: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface SystemSettings {
  platformName: string;
  escrowPercent: number;
  enableExams: boolean;
  enableChat: boolean;
  enablePayments: boolean;
  maintenanceMode: boolean;
}

// Seed data
const seedUsers: AdminUser[] = [
  { id: "u1", name: "Nguyễn Văn An", email: "an.nguyen@edu.vn", phone: "0901234567", role: "tutor", status: "approved", avatar: "https://randomuser.me/api/portraits/men/32.jpg", createdAt: "2025-12-01", subject: "Toán", bio: "Gia sư Toán 5 năm kinh nghiệm" },
  { id: "u2", name: "Trần Thị Bích", email: "bich.tran@edu.vn", phone: "0912345678", role: "teacher", status: "approved", avatar: "https://randomuser.me/api/portraits/women/44.jpg", createdAt: "2025-11-15", subject: "Văn", bio: "Giáo viên Ngữ Văn trường THPT" },
  { id: "u3", name: "Lê Minh Châu", email: "chau.le@edu.vn", phone: "0923456789", role: "student", status: "approved", avatar: "https://randomuser.me/api/portraits/men/22.jpg", createdAt: "2026-01-10" },
  { id: "u4", name: "Phạm Hồng Đào", email: "dao.pham@edu.vn", phone: "0934567890", role: "parent", status: "approved", avatar: "https://randomuser.me/api/portraits/women/55.jpg", createdAt: "2026-01-05" },
  { id: "u5", name: "Hoàng Đức Em", email: "em.hoang@edu.vn", phone: "0945678901", role: "tutor", status: "pending", avatar: "https://randomuser.me/api/portraits/men/45.jpg", createdAt: "2026-02-20", subject: "Lý", bio: "Thạc sĩ Vật Lý, dạy ôn thi đại học" },
  { id: "u6", name: "Vũ Thị Phương", email: "phuong.vu@edu.vn", phone: "0956789012", role: "teacher", status: "pending", avatar: "https://randomuser.me/api/portraits/women/33.jpg", createdAt: "2026-02-22", subject: "Hóa", bio: "GV Hóa 10 năm kinh nghiệm" },
  { id: "u7", name: "Đỗ Quang Minh", email: "minh.do@edu.vn", phone: "0967890123", role: "tutor", status: "pending", avatar: "https://randomuser.me/api/portraits/men/56.jpg", createdAt: "2026-02-25", subject: "Anh", bio: "IELTS 8.5, dạy IELTS/TOEIC" },
  { id: "u8", name: "Ngô Thị Lan", email: "lan.ngo@edu.vn", phone: "0978901234", role: "student", status: "approved", avatar: "https://randomuser.me/api/portraits/women/22.jpg", createdAt: "2026-01-20" },
  { id: "u9", name: "Bùi Văn Hùng", email: "hung.bui@edu.vn", phone: "0989012345", role: "tutor", status: "rejected", avatar: "https://randomuser.me/api/portraits/men/67.jpg", createdAt: "2026-01-30", subject: "Sinh", bio: "Sinh viên năm 3" },
  { id: "u10", name: "Lý Thị Mai", email: "mai.ly@edu.vn", phone: "0990123456", role: "parent", status: "approved", avatar: "https://randomuser.me/api/portraits/women/66.jpg", createdAt: "2026-02-01" },
  { id: "u11", name: "Trương Văn Kiên", email: "kien.truong@edu.vn", phone: "0901112233", role: "student", status: "approved", avatar: "https://randomuser.me/api/portraits/men/12.jpg", createdAt: "2026-02-10" },
  { id: "u12", name: "Đinh Thị Hoa", email: "hoa.dinh@edu.vn", phone: "0912223344", role: "teacher", status: "approved", avatar: "https://randomuser.me/api/portraits/women/12.jpg", createdAt: "2025-10-05", subject: "Sử", bio: "Giáo viên Lịch Sử" },
];

const seedClasses: AdminClass[] = [
  { id: "c1", name: "Toán 12 - Ôn thi ĐH", studentId: "u3", tutorId: "u1", format: "online", fee: 2000000, status: "active", subject: "Toán", createdAt: "2026-01-15" },
  { id: "c2", name: "Văn 11 - Nâng cao", studentId: "u8", tutorId: "u2", format: "offline", fee: 1500000, status: "active", subject: "Văn", createdAt: "2026-01-20" },
  { id: "c3", name: "IELTS Writing", studentId: "u11", tutorId: "u1", format: "hybrid", fee: 3000000, status: "searching", subject: "Anh", createdAt: "2026-02-15" },
  { id: "c4", name: "Lý 10 - Cơ bản", studentId: "u3", tutorId: "u1", format: "online", fee: 1800000, status: "completed", subject: "Lý", createdAt: "2025-11-01" },
];

const seedTests: AdminTest[] = [
  { id: "t1", code: "T001", name: "Đề thi thử Toán 12", subject: "Toán", level: "Lớp 12", type: "multiple-choice", attempts: 234, status: "active", createdAt: "2026-01-01" },
  { id: "t2", code: "T002", name: "Đề thi thử Văn 11", subject: "Văn", level: "Lớp 11", type: "essay", attempts: 156, status: "active", createdAt: "2026-01-15" },
  { id: "t3", code: "T003", name: "IELTS Mock Test 1", subject: "Anh", level: "IELTS", type: "multiple-choice", attempts: 89, status: "active", createdAt: "2026-02-01" },
  { id: "t4", code: "T004", name: "Hóa 12 - Hữu cơ", subject: "Hóa", level: "Lớp 12", type: "multiple-choice", attempts: 45, status: "draft", createdAt: "2026-02-20" },
  { id: "t5", code: "T005", name: "Lý 10 - Động lực học", subject: "Lý", level: "Lớp 10", type: "multiple-choice", attempts: 312, status: "archived", createdAt: "2025-09-01" },
];

const seedTransactions: AdminTransaction[] = [
  { id: "tx1", userId: "u3", type: "tuition", amount: 2000000, date: "2026-02-01", status: "completed", description: "Học phí Toán 12 - T2/2026" },
  { id: "tx2", userId: "u1", type: "salary", amount: 1600000, date: "2026-02-05", status: "completed", description: "Lương gia sư Toán 12 - T1/2026" },
  { id: "tx3", userId: "u8", type: "tuition", amount: 1500000, date: "2026-02-10", status: "completed", description: "Học phí Văn 11 - T2/2026" },
  { id: "tx4", userId: "u2", type: "salary", amount: 1200000, date: "2026-02-12", status: "pending", description: "Lương GV Văn 11 - T1/2026" },
  { id: "tx5", userId: "u11", type: "exam-fee", amount: 50000, date: "2026-02-15", status: "completed", description: "Phí thi thử IELTS" },
  { id: "tx6", userId: "u3", type: "exam-fee", amount: 30000, date: "2026-02-18", status: "completed", description: "Phí thi thử Toán 12" },
  { id: "tx7", userId: "u3", type: "tuition", amount: 2000000, date: "2026-03-01", status: "completed", description: "Học phí Toán 12 - T3/2026" },
  { id: "tx8", userId: "u8", type: "tuition", amount: 1500000, date: "2026-03-01", status: "pending", description: "Học phí Văn 11 - T3/2026" },
];

const seedAuditLog: AuditLogEntry[] = [
  { id: "al1", actor: "Admin", action: "Duyệt tài khoản", target: "Nguyễn Văn An (Gia sư)", timestamp: "2025-12-01 09:00" },
  { id: "al2", actor: "Admin", action: "Tạo lớp học", target: "Toán 12 - Ôn thi ĐH", timestamp: "2026-01-15 10:30" },
  { id: "al3", actor: "Admin", action: "Từ chối tài khoản", target: "Bùi Văn Hùng (Gia sư)", timestamp: "2026-02-01 14:00" },
  { id: "al4", actor: "Admin", action: "Cập nhật cài đặt", target: "Phí escrow: 20%", timestamp: "2026-02-10 08:15" },
];

const defaultSettings: SystemSettings = {
  platformName: "EduConnect",
  escrowPercent: 20,
  enableExams: true,
  enableChat: true,
  enablePayments: true,
  maintenanceMode: false,
};

interface AdminContextType {
  users: AdminUser[];
  classes: AdminClass[];
  tests: AdminTest[];
  transactions: AdminTransaction[];
  auditLog: AuditLogEntry[];
  settings: SystemSettings;
  // User actions
  approveUser: (id: string) => void;
  rejectUser: (id: string) => void;
  updateUserStatus: (id: string, status: UserStatus) => void;
  deleteUser: (id: string) => void;
  // Class actions
  addClass: (cls: Omit<AdminClass, "id" | "createdAt">) => void;
  updateClass: (id: string, data: Partial<AdminClass>) => void;
  deleteClass: (id: string) => void;
  // Test actions
  addTest: (test: Omit<AdminTest, "id" | "createdAt" | "attempts">) => void;
  updateTest: (id: string, data: Partial<AdminTest>) => void;
  deleteTest: (id: string) => void;
  // Transaction actions
  addTransaction: (tx: Omit<AdminTransaction, "id">) => void;
  // Settings
  updateSettings: (s: Partial<SystemSettings>) => void;
  // Helpers
  getUserById: (id: string) => AdminUser | undefined;
  addAuditLog: (action: string, target: string) => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
};

let nextId = 100;
const genId = (prefix: string) => `${prefix}${++nextId}`;

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<AdminUser[]>(seedUsers);
  const [classes, setClasses] = useState<AdminClass[]>(seedClasses);
  const [tests, setTests] = useState<AdminTest[]>(seedTests);
  const [transactions, setTransactions] = useState<AdminTransaction[]>(seedTransactions);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(seedAuditLog);
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);

  const addAuditLog = useCallback((action: string, target: string) => {
    setAuditLog(prev => [{
      id: genId("al"),
      actor: "Admin",
      action,
      target,
      timestamp: new Date().toLocaleString("vi-VN"),
    }, ...prev]);
  }, []);

  const approveUser = useCallback((id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "approved" as UserStatus } : u));
    const user = users.find(u => u.id === id);
    if (user) addAuditLog("Duyệt tài khoản", `${user.name} (${user.role})`);
  }, [users, addAuditLog]);

  const rejectUser = useCallback((id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "rejected" as UserStatus } : u));
    const user = users.find(u => u.id === id);
    if (user) addAuditLog("Từ chối tài khoản", `${user.name} (${user.role})`);
  }, [users, addAuditLog]);

  const updateUserStatus = useCallback((id: string, status: UserStatus) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
  }, []);

  const deleteUser = useCallback((id: string) => {
    const user = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    if (user) addAuditLog("Xóa người dùng", `${user.name}`);
  }, [users, addAuditLog]);

  const addClass = useCallback((cls: Omit<AdminClass, "id" | "createdAt">) => {
    const newClass: AdminClass = { ...cls, id: genId("c"), createdAt: new Date().toISOString().slice(0, 10) };
    setClasses(prev => [newClass, ...prev]);
    addAuditLog("Tạo lớp học", cls.name);
  }, [addAuditLog]);

  const updateClass = useCallback((id: string, data: Partial<AdminClass>) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    addAuditLog("Cập nhật lớp học", data.name || id);
  }, [addAuditLog]);

  const deleteClass = useCallback((id: string) => {
    const cls = classes.find(c => c.id === id);
    setClasses(prev => prev.filter(c => c.id !== id));
    if (cls) addAuditLog("Xóa lớp học", cls.name);
  }, [classes, addAuditLog]);

  const addTest = useCallback((test: Omit<AdminTest, "id" | "createdAt" | "attempts">) => {
    const newTest: AdminTest = { ...test, id: genId("t"), createdAt: new Date().toISOString().slice(0, 10), attempts: 0 };
    setTests(prev => [newTest, ...prev]);
    addAuditLog("Tạo bài test", test.name);
  }, [addAuditLog]);

  const updateTest = useCallback((id: string, data: Partial<AdminTest>) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    addAuditLog("Cập nhật bài test", data.name || id);
  }, [addAuditLog]);

  const deleteTest = useCallback((id: string) => {
    const test = tests.find(t => t.id === id);
    setTests(prev => prev.filter(t => t.id !== id));
    if (test) addAuditLog("Xóa bài test", `${test.code} - ${test.name}`);
  }, [tests, addAuditLog]);

  const addTransaction = useCallback((tx: Omit<AdminTransaction, "id">) => {
    setTransactions(prev => [{ ...tx, id: genId("tx") }, ...prev]);
    addAuditLog("Thêm giao dịch", tx.description);
  }, [addAuditLog]);

  const updateSettings = useCallback((s: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...s }));
    addAuditLog("Cập nhật cài đặt", Object.keys(s).join(", "));
  }, [addAuditLog]);

  const getUserById = useCallback((id: string) => users.find(u => u.id === id), [users]);

  return (
    <AdminContext.Provider value={{
      users, classes, tests, transactions, auditLog, settings,
      approveUser, rejectUser, updateUserStatus, deleteUser,
      addClass, updateClass, deleteClass,
      addTest, updateTest, deleteTest,
      addTransaction, updateSettings, getUserById, addAuditLog,
    }}>
      {children}
    </AdminContext.Provider>
  );
};
