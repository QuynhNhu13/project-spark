import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, GraduationCap, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { icon: Users, value: "1,200+", label: "Gia sư & Giáo viên" },
  { icon: GraduationCap, value: "890+", label: "Học sinh" },
  { icon: ThumbsUp, value: "98%", label: "Hài lòng" },
];

const bullets = [
  "Gia sư được kiểm tra năng lực",
  "AI hỗ trợ đánh giá học tập",
  "Thanh toán an toàn, minh bạch",
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden gradient-hero pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Decorative circles */}
      <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-primary-foreground/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-semibold mb-6">
              Nền tảng giáo dục hàng đầu Việt Nam
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-6">
              Kết nối Gia sư chất lượng với Học sinh
            </h1>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl">
              EduConnect giúp phụ huynh tìm gia sư phù hợp, đảm bảo chất lượng giảng dạy thông qua hệ thống kiểm tra năng lực và đánh giá AI.
            </p>

            <ul className="space-y-3 mb-8">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-3 text-primary-foreground/90">
                  <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="font-medium">{b}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4 mb-10">
              <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-base px-8 h-12 rounded-xl shadow-elevated">
                <Link to="/find-tutor">Tìm gia sư ngay</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8 h-12 rounded-xl">
                <Link to="/register-tutor">Đăng ký làm gia sư</Link>
              </Button>
            </div>

            {/* Tutors preview */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-secondary/30 border-2 border-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-primary-foreground/70 text-sm font-medium">+180 gia sư nổi bật</span>
            </div>
          </motion.div>

          {/* Right - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-5"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-6 flex items-center gap-5 border border-primary-foreground/10"
              >
                <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-primary-foreground">{stat.value}</div>
                  <div className="text-primary-foreground/70 text-sm">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
