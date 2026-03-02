import { Star } from "lucide-react";
import { motion } from "framer-motion";

const reviews = [
  {
    text: "Con tôi tiến bộ rõ rệt sau 3 tháng học với gia sư trên EduConnect. Báo cáo AI giúp tôi theo dõi tiến độ rất tốt.",
    name: "Nguyễn Thị Mai",
    role: "Phụ huynh",
  },
  {
    text: "Hệ thống thanh toán minh bạch, nhận lương đúng hạn. Quy trình xét duyệt nghiêm túc giúp tôi tự tin hơn về chất lượng.",
    name: "Trần Văn Hùng",
    role: "Gia sư Toán",
  },
  {
    text: "Thi thử online rất giống đề thật, giúp em làm quen với áp lực thi cử. AI chấm điểm nhanh và chính xác.",
    name: "Lê Hoàng Anh",
    role: "Học sinh lớp 12",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Đánh giá từ người dùng</h2>
          <p className="text-muted-foreground text-lg">Hơn 2,000 người dùng đã tin tưởng EduConnect</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-card border border-border"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed italic">"{r.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">{r.name[0]}</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{r.name}</div>
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
