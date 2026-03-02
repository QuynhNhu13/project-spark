import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Sparkles, Clock, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Clock, text: "Mô phỏng thi thật (đúng format và thời gian)" },
  { icon: ShieldCheck, text: "AI Proctoring chống gian lận" },
  { icon: Sparkles, text: "Đề AI generate mới mỗi lần thi" },
  { icon: CreditCard, text: "Chỉ 10.000đ/lần (MoMo/VNPay)" },
];

const ExamSection = () => {
  return (
    <section className="py-20 md:py-28 bg-muted/50" id="exam">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/15 text-secondary text-sm font-semibold mb-6">
              Thi thử Online
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
              Luyện thi THPT Quốc gia với đề AI
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Hệ thống thi thử online với đề được AI generate theo chuẩn Bộ GD&DT, giám sát bằng AI proctoring để đảm bảo công bằng.
            </p>

            <ul className="space-y-4 mb-8">
              {features.map((f) => (
                <li key={f.text} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium text-sm">{f.text}</span>
                </li>
              ))}
            </ul>

            <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 h-12 rounded-xl">
              <Link to="/exam-online">Thi ngay</Link>
            </Button>
          </motion.div>

          {/* Mock exam card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-card rounded-2xl p-8 shadow-elevated border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Đề thi thử Toán THPT QG 2025</h3>
                  <p className="text-xs text-muted-foreground">AI Generated</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted rounded-xl p-4">
                  <div className="text-xs text-muted-foreground mb-1">Thời gian</div>
                  <div className="font-bold text-foreground">90 phút</div>
                </div>
                <div className="bg-muted rounded-xl p-4">
                  <div className="text-xs text-muted-foreground mb-1">Số câu</div>
                  <div className="font-bold text-foreground">50 câu trắc nghiệm</div>
                </div>
                <div className="bg-muted rounded-xl p-4">
                  <div className="text-xs text-muted-foreground mb-1">Phí thi</div>
                  <div className="font-bold text-secondary">10.000đ</div>
                </div>
                <div className="bg-muted rounded-xl p-4">
                  <div className="text-xs text-muted-foreground mb-1">Lượt thi</div>
                  <div className="font-bold text-foreground">1,234 lượt</div>
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-xl" asChild>
                <Link to="/exam-online">Thi ngay</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExamSection;
