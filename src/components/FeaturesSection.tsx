import { ShieldCheck, Brain, CreditCard, FileText, Video, Bell, Globe, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: ShieldCheck, title: "Xác thực gia sư", desc: "Kiểm tra lý lịch, bằng cấp và năng lực qua AI + Admin trong 48 giờ" },
  { icon: Brain, title: "AI đánh giá", desc: "Tự động tạo đề và chấm điểm, báo cáo tiến độ học tập hàng tháng" },
  { icon: CreditCard, title: "Thanh toán an toàn", desc: "Escrow 20%, thanh toán qua MoMo/VNPay, audit log realtime" },
  { icon: FileText, title: "Test online", desc: "Thi thử THPT QG 12 môn, AI proctoring chống gian lận" },
  { icon: Video, title: "Học trực tuyến", desc: "Tích hợp Zoom/Google Meet, lịch tự động đồng bộ" },
  { icon: Bell, title: "Thông báo thông minh", desc: "Push notification, email nhắc nhở vắng học tự động" },
  { icon: Globe, title: "Đa ngôn ngữ", desc: "Hỗ trợ Tiếng Việt và Tiếng Anh đầy đủ" },
  { icon: Smartphone, title: "Mobile App", desc: "Quản lý lớp học mọi lúc mọi nơi trên điện thoại" },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Tính năng nổi bật</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hệ thống quản lý học tập toàn diện với công nghệ AI tiên tiến
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 border border-border hover:border-secondary/30"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4 group-hover:bg-secondary-light transition-colors">
                <f.icon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
              </div>
              <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
