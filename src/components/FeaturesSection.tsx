import { ShieldCheck, Brain, CreditCard, FileText, Video, Bell, Globe, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: ShieldCheck, title: "Xác thực gia sư", desc: "Kiểm tra lý lịch, bằng cấp và năng lực qua AI + Admin trong 48 giờ", color: "from-blue-500 to-blue-600" },
  { icon: Brain, title: "AI đánh giá", desc: "Tự động tạo đề và chấm điểm, báo cáo tiến độ học tập hàng tháng", color: "from-green-400 to-emerald-500" },
  { icon: CreditCard, title: "Thanh toán an toàn", desc: "Escrow 20%, thanh toán qua MoMo/VNPay, audit log realtime", color: "from-violet-500 to-purple-600" },
  { icon: FileText, title: "Test online", desc: "Thi thử THPT QG 12 môn, AI proctoring chống gian lận", color: "from-amber-400 to-orange-500" },
  { icon: Video, title: "Học trực tuyến", desc: "Tích hợp Zoom/Google Meet, lịch tự động đồng bộ", color: "from-cyan-400 to-blue-500" },
  { icon: Bell, title: "Thông báo thông minh", desc: "Push notification, email nhắc nhở vắng học tự động", color: "from-rose-400 to-red-500" },
  { icon: Globe, title: "Đa ngôn ngữ", desc: "Hỗ trợ Tiếng Việt và Tiếng Anh đầy đủ", color: "from-teal-400 to-emerald-500" },
  { icon: Smartphone, title: "Mobile App", desc: "Quản lý lớp học mọi lúc mọi nơi trên điện thoại", color: "from-indigo-400 to-blue-600" },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden" id="features">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-neon/5 blur-[120px] rounded-full" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Tính năng
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold font-display text-foreground mb-4">
            Tính năng <span className="text-gradient">nổi bật</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hệ thống quản lý học tập toàn diện với công nghệ AI tiên tiến
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group bg-card rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300 border border-border hover:border-neon/20 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-foreground font-display text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
