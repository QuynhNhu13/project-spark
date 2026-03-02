import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const reviews = [
  {
    text: "Con tôi tiến bộ rõ rệt sau 3 tháng học với gia sư trên EduConnect. Báo cáo AI giúp tôi theo dõi tiến độ rất tốt.",
    name: "Nguyễn Thị Mai",
    role: "Phụ huynh",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    text: "Hệ thống thanh toán minh bạch, nhận lương đúng hạn. Quy trình xét duyệt nghiêm túc giúp tôi tự tin hơn về chất lượng.",
    name: "Trần Văn Hùng",
    role: "Gia sư Toán",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    text: "Thi thử online rất giống đề thật, giúp em làm quen với áp lực thi cử. AI chấm điểm nhanh và chính xác.",
    name: "Lê Hoàng Anh",
    role: "Học sinh lớp 12",
    gradient: "from-violet-500 to-purple-600",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden" id="testimonials">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 blur-[150px] rounded-full" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon/10 text-neon text-sm font-semibold mb-4">
            Đánh giá
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold font-display text-foreground mb-4">
            Đánh giá từ <span className="text-gradient">người dùng</span>
          </h2>
          <p className="text-muted-foreground text-lg">Hơn 2,000 người dùng đã tin tưởng EduConnect</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-card rounded-3xl p-7 shadow-soft border border-border hover:border-neon/20 hover:shadow-elevated transition-all duration-300 relative"
            >
              <Quote className="w-8 h-8 text-neon/20 absolute top-6 right-6" />
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-neon text-neon" />
                ))}
              </div>
              <p className="text-foreground mb-8 leading-relaxed text-[15px]">"{r.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-bold text-sm">{r.name[0]}</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground font-display">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
