import { useState } from "react";
import { motion } from "framer-motion";

const tutorSteps = [
  { num: "01", title: "Đăng ký & Xác thực", desc: "Upload bằng điểm, chứng chỉ. AI kiểm tra tự động + Admin phê duyệt trong 48h" },
  { num: "02", title: "Làm bài test", desc: "Hoàn thành bài kiểm tra năng lực môn học" },
  { num: "03", title: "Nhận lớp & Dạy", desc: "Xem lớp phù hợp, đăng ký, thanh toán 10% phí và bắt đầu giảng dạy" },
  { num: "04", title: "Nhận lương", desc: "Nhận 80% lương hàng tháng, 20% escrow giải ngân sau khi hoàn thành" },
];

const studentSteps = [
  { num: "01", title: "Đăng ký lớp học", desc: "Chọn môn, lịch học, hình thức và mức giá phù hợp" },
  { num: "02", title: "Ghép gia sư", desc: "Hệ thống gợi ý gia sư phù hợp, xác nhận và bắt đầu học" },
  { num: "03", title: "Học & Đánh giá", desc: "Tham gia lớp học, làm test cuối tháng để đo lường tiến độ" },
  { num: "04", title: "Báo cáo cho phụ huynh", desc: "Phụ huynh nhận báo cáo AI về tiến độ và kết quả học tập" },
];

const HowItWorks = () => {
  const [tab, setTab] = useState<"tutor" | "student">("tutor");
  const steps = tab === "tutor" ? tutorSteps : studentSteps;

  return (
    <section className="py-20 md:py-28 bg-muted/50" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Cách hoạt động</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Quy trình đơn giản, minh bạch cho cả gia sư và học sinh
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-12">
          <button
            onClick={() => setTab("tutor")}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === "tutor"
                ? "bg-primary text-primary-foreground shadow-elevated"
                : "bg-card text-muted-foreground border border-border hover:border-primary/30"
            }`}
          >
            Dành cho Gia sư
          </button>
          <button
            onClick={() => setTab("student")}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === "student"
                ? "bg-primary text-primary-foreground shadow-elevated"
                : "bg-card text-muted-foreground border border-border hover:border-primary/30"
            }`}
          >
            Dành cho Học sinh
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={`${tab}-${step.num}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="relative bg-card rounded-2xl p-6 shadow-card border border-border"
            >
              <span className="text-5xl font-black text-primary/10 absolute top-4 right-4">{step.num}</span>
              <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center mb-4">
                <span className="text-secondary font-extrabold text-sm">{step.num}</span>
              </div>
              <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              {i < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-secondary/40" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
